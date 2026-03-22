// ============================================================
// Zynovexa - AI Growth Coach API Routes
// Daily recommendations, weekly reports, smart insights
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess } from '../lib/utils';
import { authMiddleware } from '../lib/auth';
const growthCoach = new Hono();
growthCoach.use('*', authMiddleware);
// ── GET /api/growth-coach/daily — Today's recommendations ───
growthCoach.get('/daily', async (c) => {
    const userId = c.get('userId');
    // Fetch user context for personalized recommendations
    const [userInfo, recentPosts, accounts, streakInfo] = await Promise.all([
        c.env.DB.prepare('SELECT niche, plan, timezone FROM users WHERE id = ?').bind(userId).first(),
        c.env.DB.prepare("SELECT id, caption, platforms, viral_score, status, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 10").bind(userId).all(),
        c.env.DB.prepare('SELECT platform, followers_count FROM accounts WHERE user_id = ?').bind(userId).all(),
        c.env.DB.prepare('SELECT current_streak, last_post_date FROM user_streaks WHERE user_id = ?').bind(userId).first(),
    ]);
    const niche = userInfo?.niche || 'general';
    const posts = recentPosts.results || [];
    const connectedPlatforms = (accounts.results || []).map((a) => a.platform);
    const streak = streakInfo;
    const today = new Date().toISOString().split('T')[0];
    const lastPost = streak?.last_post_date || '';
    const daysSincePost = lastPost ? Math.floor((Date.now() - new Date(lastPost).getTime()) / 86400000) : 99;
    const recommendations = [];
    // What to post
    const contentIdeas = generateContentIdeas(niche, connectedPlatforms, posts);
    recommendations.push({
        type: 'what_to_post',
        icon: '📝',
        title: contentIdeas.title,
        description: contentIdeas.description,
        action: contentIdeas.action,
        priority: 'high',
    });
    // When to post
    const bestTime = getBestPostingTime(niche);
    recommendations.push({
        type: 'when_to_post',
        icon: '⏰',
        title: `Best time to post today: ${bestTime.time}`,
        description: bestTime.reason,
        action: 'Schedule a post for this time slot',
        priority: 'high',
    });
    // Why it works
    recommendations.push({
        type: 'why_it_works',
        icon: '💡',
        title: 'Algorithm insight for today',
        description: getAlgorithmInsight(niche, connectedPlatforms),
        priority: 'medium',
    });
    // Streak warning
    if (daysSincePost >= 2) {
        recommendations.unshift({
            type: 'streak_warning',
            icon: '🔥',
            title: daysSincePost >= 7
                ? `You haven't posted in ${daysSincePost} days! Your streak is at risk.`
                : `Post today to maintain your ${streak?.current_streak || 0}-day streak!`,
            description: 'Consistent posting is the #1 growth driver. Even a simple story counts.',
            action: 'Create a quick post now',
            priority: 'critical',
        });
    }
    // Performance-based suggestion
    if (posts.length > 0) {
        const avgScore = posts.reduce((s, p) => s + (p.viral_score || 0), 0) / posts.length;
        if (avgScore < 60) {
            recommendations.push({
                type: 'improvement',
                icon: '📈',
                title: 'Improve your content quality',
                description: `Your average viral score is ${avgScore.toFixed(0)}/100. Try using stronger hooks and asking questions to boost engagement.`,
                priority: 'high',
            });
        }
    }
    return c.json(apiSuccess({ recommendations, context: { niche, streak: streak?.current_streak || 0, days_since_post: daysSincePost } }));
});
// ── GET /api/growth-coach/weekly-report — Generate report ───
growthCoach.get('/weekly-report', async (c) => {
    const userId = c.get('userId');
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const [postsThisWeek, analyticsThisWeek, lastWeekReport] = await Promise.all([
        c.env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND created_at >= ?").bind(userId, weekAgo).first(),
        c.env.DB.prepare("SELECT metric_type, SUM(metric_value) as total FROM analytics WHERE user_id = ? AND recorded_date >= date('now', '-7 days') GROUP BY metric_type").bind(userId).all(),
        c.env.DB.prepare("SELECT * FROM weekly_reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").bind(userId).first(),
    ]);
    const metrics = {};
    (analyticsThisWeek.results || []).forEach((r) => { metrics[r.metric_type] = r.total; });
    const totalEngagement = (metrics['likes'] || 0) + (metrics['comments'] || 0) + (metrics['shares'] || 0);
    const impressions = metrics['impressions'] || 0;
    const engagementRate = impressions > 0 ? (totalEngagement / impressions * 100) : 0;
    // Generate improvement suggestions
    const suggestions = [];
    const postCount = postsThisWeek?.count || 0;
    if (postCount < 3)
        suggestions.push('Post at least 5 times per week for optimal growth');
    if (engagementRate < 3)
        suggestions.push('Add engaging questions in your captions to boost comments');
    if (!metrics['shares'] || metrics['shares'] < 10)
        suggestions.push('Create shareable content like tips, quotes, or controversial takes');
    if (impressions < 1000)
        suggestions.push('Use trending hashtags and post during peak hours (6-8 PM)');
    suggestions.push('Experiment with Reels/Shorts — they get 2-3x more reach than static posts');
    const report = {
        period: { start: weekAgo.split('T')[0], end: new Date().toISOString().split('T')[0] },
        posts_created: postCount,
        total_impressions: impressions,
        total_engagement: totalEngagement,
        engagement_rate: engagementRate.toFixed(1),
        follower_change: metrics['followers'] || 0,
        top_metric: Object.entries(metrics).sort((a, b) => b[1] - a[1])[0] || null,
        improvement_suggestions: suggestions,
        week_over_week: lastWeekReport ? {
            posts_change: postCount - (lastWeekReport.total_posts || 0),
            engagement_change: totalEngagement - (lastWeekReport.total_engagement || 0),
        } : null,
        summary: generateWeeklySummary(postCount, impressions, totalEngagement, engagementRate),
    };
    // Save report
    const reportId = generateId('wr');
    await c.env.DB.prepare(`
    INSERT INTO weekly_reports (id, user_id, week_start, week_end, total_posts, total_impressions, total_engagement, engagement_rate, improvement_suggestions, summary_text)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(reportId, userId, report.period.start, report.period.end, postCount, impressions, totalEngagement, engagementRate, JSON.stringify(suggestions), report.summary).run();
    return c.json(apiSuccess({ report }));
});
// ── POST /api/growth-coach/dismiss — Dismiss recommendation ─
growthCoach.post('/dismiss/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    await c.env.DB.prepare('UPDATE growth_recommendations SET dismissed = 1 WHERE id = ? AND user_id = ?').bind(id, userId).run();
    return c.json(apiSuccess(null, 'Dismissed'));
});
// ── Helper functions ────────────────────────────────────────
function generateContentIdeas(niche, platforms, recentPosts) {
    const ideas = {
        lifestyle: {
            title: 'Create a "Day in my life" reel today',
            description: 'Behind-the-scenes content sees 3.2x higher engagement in the lifestyle niche. Show your morning routine or workspace setup.',
            action: 'Generate AI caption for lifestyle reel',
        },
        tech: {
            title: 'Share a quick tech tip or tool review',
            description: 'Short, actionable tech tips get the highest save rate. Pick one tool you use daily and explain why it\'s great.',
            action: 'Generate AI script for tech tip video',
        },
        fitness: {
            title: 'Post a workout transformation or tip',
            description: 'Before/after content and quick workout clips drive massive engagement in fitness. Add a relatable caption.',
            action: 'Generate AI caption for fitness post',
        },
        food: {
            title: 'Share a recipe reel with close-up shots',
            description: 'Recipe videos under 60 seconds get 4x more shares. Film the cooking process with ASMR audio.',
            action: 'Generate AI script for recipe video',
        },
        general: {
            title: 'Share your best tip from this week',
            description: 'Value-driven content consistently outperforms. Share one actionable insight your audience can use today.',
            action: 'Generate AI caption for value post',
        },
    };
    return ideas[niche] || ideas.general;
}
function getBestPostingTime(niche) {
    const times = {
        lifestyle: { time: '7:00 PM - 9:00 PM', reason: 'Lifestyle audiences scroll most during evening wind-down hours.' },
        tech: { time: '8:00 AM - 10:00 AM', reason: 'Tech professionals check social media during morning commute.' },
        fitness: { time: '6:00 AM - 8:00 AM', reason: 'Fitness enthusiasts are most active during morning workout planning.' },
        food: { time: '11:00 AM - 1:00 PM', reason: 'Food content peaks during lunch hour when people plan meals.' },
        general: { time: '6:00 PM - 8:00 PM', reason: 'General audiences are most active during evening leisure time.' },
    };
    return times[niche] || times.general;
}
function getAlgorithmInsight(niche, platforms) {
    const insights = [
        'Instagram is now prioritizing Reels over static images — aim for 3+ Reels per week.',
        'YouTube Shorts algorithm favors consistent daily uploads for the first 30 days.',
        'TikTok rewards watch time above all. Front-load your hook in the first 1.5 seconds.',
        'LinkedIn carousel posts get 3x more reach than text-only posts.',
        'Twitter/X rewards reply chain engagement. Start conversations, don\'t just broadcast.',
        'Posting within 30 minutes of peak hours gives a 23% reach boost on average.',
        'Captions with questions get 2x more comments, which signals high engagement to algorithms.',
    ];
    return insights[Math.floor(Math.random() * insights.length)];
}
function generateWeeklySummary(posts, impressions, engagement, rate) {
    if (posts === 0)
        return 'You didn\'t post this week. Consistency is key — try to post at least 3 times next week.';
    if (rate > 5)
        return `Great week! ${posts} posts with ${rate.toFixed(1)}% engagement rate. Your content is resonating well. Keep experimenting.`;
    if (rate > 2)
        return `Solid week with ${posts} posts and ${engagement} total engagements. Try adding stronger hooks to push past 5% engagement.`;
    return `${posts} posts published with ${impressions} impressions. Focus on caption quality and posting consistency to improve engagement.`;
}
export default growthCoach;
