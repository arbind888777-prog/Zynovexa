// ============================================================
// Zynovexa - Analytics API Routes
// Dashboard stats, engagement metrics, follower growth, heatmaps
// ============================================================
import { Hono } from 'hono';
import { apiSuccess } from '../lib/utils';
import { authMiddleware } from '../lib/auth';
const analytics = new Hono();
analytics.use('*', authMiddleware);
// GET /api/analytics/dashboard - Main dashboard stats
analytics.get('/dashboard', async (c) => {
    const userId = c.get('userId');
    const [totalPosts, scheduledPosts, publishedPosts, totalAccounts, notifications] = await Promise.all([
        c.env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').bind(userId).first(),
        c.env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND status = 'scheduled'").bind(userId).first(),
        c.env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND status = 'published'").bind(userId).first(),
        c.env.DB.prepare('SELECT COUNT(*) as count FROM accounts WHERE user_id = ?').bind(userId).first(),
        c.env.DB.prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0").bind(userId).first(),
    ]);
    const totalFollowers = await c.env.DB.prepare('SELECT SUM(followers_count) as total FROM accounts WHERE user_id = ?').bind(userId).first();
    const recentAnalytics = await c.env.DB.prepare(`
    SELECT metric_type, SUM(metric_value) as total FROM analytics 
    WHERE user_id = ? AND recorded_date >= date('now', '-7 days')
    GROUP BY metric_type
  `).bind(userId).all();
    const metricsMap = {};
    (recentAnalytics.results || []).forEach((r) => { metricsMap[r.metric_type] = r.total; });
    const upcomingPosts = await c.env.DB.prepare("SELECT id, caption, platforms, scheduled_at FROM posts WHERE user_id = ? AND status = 'scheduled' ORDER BY scheduled_at ASC LIMIT 5").bind(userId).all();
    return c.json(apiSuccess({
        stats: {
            total_posts: totalPosts?.count || 0,
            scheduled_posts: scheduledPosts?.count || 0,
            published_posts: publishedPosts?.count || 0,
            connected_accounts: totalAccounts?.count || 0,
            total_followers: totalFollowers?.total || 0,
            unread_notifications: notifications?.count || 0,
            weekly_impressions: metricsMap['impressions'] || 0,
            weekly_likes: metricsMap['likes'] || 0,
            weekly_comments: metricsMap['comments'] || 0,
            weekly_shares: metricsMap['shares'] || 0,
            engagement_rate: metricsMap['impressions'] ? (((metricsMap['likes'] || 0) + (metricsMap['comments'] || 0)) / metricsMap['impressions'] * 100).toFixed(1) : '0.0'
        },
        upcoming_posts: upcomingPosts.results,
        ai_recommendations: [
            { type: 'timing', text: 'Your audience is most active between 6-8 PM. Schedule your next post then.' },
            { type: 'content', text: 'Carousel posts get 2.3x more engagement. Try creating one this week.' },
            { type: 'growth', text: 'Collaborate with creators in your niche to boost follower growth by 40%.' },
            { type: 'hashtag', text: 'Add 5-8 niche hashtags to increase discoverability by 30%.' }
        ]
    }));
});
// GET /api/analytics/growth - Follower growth over time
analytics.get('/growth', async (c) => {
    const userId = c.get('userId');
    const days = parseInt(new URL(c.req.url).searchParams.get('days') || '30');
    const growth = await c.env.DB.prepare(`
    SELECT platform, recorded_date, metric_value FROM analytics 
    WHERE user_id = ? AND metric_type = 'followers' AND recorded_date >= date('now', '-' || ? || ' days')
    ORDER BY recorded_date ASC
  `).bind(userId, days).all();
    return c.json(apiSuccess({ growth: growth.results }));
});
// GET /api/analytics/engagement - Engagement breakdown
analytics.get('/engagement', async (c) => {
    const userId = c.get('userId');
    const engagement = await c.env.DB.prepare(`
    SELECT platform, metric_type, SUM(metric_value) as total
    FROM analytics WHERE user_id = ? AND metric_type IN ('likes','comments','shares','saves','impressions')
    AND recorded_date >= date('now', '-30 days')
    GROUP BY platform, metric_type ORDER BY platform
  `).bind(userId).all();
    return c.json(apiSuccess({ engagement: engagement.results }));
});
// GET /api/analytics/top-posts - Best performing posts
analytics.get('/top-posts', async (c) => {
    const userId = c.get('userId');
    const topPosts = await c.env.DB.prepare(`
    SELECT p.id, p.caption, p.platforms, p.media_type, p.published_at, p.viral_score,
      SUM(CASE WHEN a.metric_type = 'impressions' THEN a.metric_value ELSE 0 END) as impressions,
      SUM(CASE WHEN a.metric_type = 'likes' THEN a.metric_value ELSE 0 END) as likes,
      SUM(CASE WHEN a.metric_type = 'comments' THEN a.metric_value ELSE 0 END) as comments
    FROM posts p LEFT JOIN analytics a ON p.id = a.post_id
    WHERE p.user_id = ? AND p.status = 'published'
    GROUP BY p.id ORDER BY impressions DESC LIMIT 10
  `).bind(userId).all();
    return c.json(apiSuccess({ top_posts: topPosts.results }));
});
// GET /api/analytics/heatmap - Best posting times
analytics.get('/heatmap', async (c) => {
    // Return pre-computed heatmap data (simulated)
    const heatmapData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let d = 0; d < 7; d++) {
        for (let h = 0; h < 24; h++) {
            let value = Math.random() * 100;
            if (h >= 18 && h <= 21)
                value *= 2;
            if (h >= 12 && h <= 14)
                value *= 1.5;
            if (d >= 5)
                value *= 1.3;
            heatmapData.push({ day: days[d], hour: h, value: Math.min(100, Math.round(value)) });
        }
    }
    return c.json(apiSuccess({ heatmap: heatmapData }));
});
export default analytics;
