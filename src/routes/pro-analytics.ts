// ============================================================
// Zynovexa - Pro Analytics & Competitor Tracking API Routes
// Advanced metrics, competitor comparison, content ranking
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const proAnalytics = new Hono<{ Bindings: Bindings; Variables: Variables }>();

proAnalytics.use('*', authMiddleware);

// ── Middleware: Check user has Pro or higher plan ────────────
async function requireProPlan(c: any, next: any) {
  const userId = c.get('userId');
  const user = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
  if (!user || !['pro', 'promax', 'business'].includes(user?.plan)) {
    return c.json(apiError('Pro plan required. Upgrade to access advanced analytics.'), 403);
  }
  await next();
}

// ── GET /api/pro-analytics/overview — Advanced metrics ──────
proAnalytics.get('/overview', requireProPlan, async (c) => {
  const userId = c.get('userId');

  const [analytics7d, analytics30d, totalFollowers, postsCount] = await Promise.all([
    c.env.DB.prepare(`
      SELECT metric_type, SUM(metric_value) as total FROM analytics
      WHERE user_id = ? AND recorded_date >= date('now', '-7 days')
      GROUP BY metric_type
    `).bind(userId).all(),
    c.env.DB.prepare(`
      SELECT metric_type, SUM(metric_value) as total FROM analytics
      WHERE user_id = ? AND recorded_date >= date('now', '-30 days')
      GROUP BY metric_type
    `).bind(userId).all(),
    c.env.DB.prepare('SELECT SUM(followers_count) as total FROM accounts WHERE user_id = ?').bind(userId).first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').bind(userId).first(),
  ]);

  const m7: Record<string, number> = {};
  (analytics7d.results || []).forEach((r: any) => { m7[r.metric_type] = r.total; });
  const m30: Record<string, number> = {};
  (analytics30d.results || []).forEach((r: any) => { m30[r.metric_type] = r.total; });

  const totalFollowersNum = (totalFollowers as any)?.total || 0;
  const impressions7d = m7['impressions'] || 0;
  const likes7d = m7['likes'] || 0;
  const comments7d = m7['comments'] || 0;
  const shares7d = m7['shares'] || 0;
  const clicks7d = m7['clicks'] || 0;

  // Engagement Rate = (likes + comments + shares) / impressions * 100
  const engagementRate = impressions7d > 0
    ? ((likes7d + comments7d + shares7d) / impressions7d * 100)
    : 0;

  // CTR = clicks / impressions * 100
  const ctr = impressions7d > 0 ? (clicks7d / impressions7d * 100) : 0;

  // Follower Growth Rate (7d) — compare earliest and latest follower counts
  const followerHistory = await c.env.DB.prepare(`
    SELECT metric_value, recorded_date FROM analytics
    WHERE user_id = ? AND metric_type = 'followers'
    ORDER BY recorded_date DESC LIMIT 14
  `).bind(userId).all();
  const fh = followerHistory.results || [];
  const latestFollowers = fh.length > 0 ? (fh[0] as any).metric_value : totalFollowersNum;
  const earlierFollowers = fh.length > 7 ? (fh[7] as any).metric_value : latestFollowers;
  const followerGrowthRate = earlierFollowers > 0
    ? ((latestFollowers - earlierFollowers) / earlierFollowers * 100)
    : 0;

  return c.json(apiSuccess({
    metrics: {
      engagement_rate: { value: engagementRate.toFixed(2), label: 'Engagement Rate', unit: '%', period: '7d' },
      ctr: { value: ctr.toFixed(2), label: 'Click-Through Rate', unit: '%', period: '7d' },
      follower_growth_rate: { value: followerGrowthRate.toFixed(2), label: 'Follower Growth Rate', unit: '%', period: '7d' },
      total_followers: { value: totalFollowersNum, label: 'Total Followers' },
      total_impressions_7d: { value: impressions7d, label: '7-Day Impressions' },
      total_impressions_30d: { value: m30['impressions'] || 0, label: '30-Day Impressions' },
      total_engagement_7d: { value: likes7d + comments7d + shares7d, label: '7-Day Engagement' },
      avg_likes_per_post: { value: (postsCount as any)?.count > 0 ? Math.round(likes7d / Math.max((postsCount as any).count, 1)) : 0, label: 'Avg Likes/Post' },
    },
    trends: {
      impressions: await getMetricTrend(c, userId, 'impressions', 30),
      followers: await getMetricTrend(c, userId, 'followers', 30),
      engagement: await getMetricTrend(c, userId, 'likes', 30),
    },
  }));
});

// ── GET /api/pro-analytics/content-ranking — Top/worst posts ─
proAnalytics.get('/content-ranking', requireProPlan, async (c) => {
  const userId = c.get('userId');

  const [topPosts, worstPosts] = await Promise.all([
    c.env.DB.prepare(`
      SELECT p.id, p.caption, p.platforms, p.viral_score, p.media_type, p.created_at,
        COALESCE((SELECT SUM(a.metric_value) FROM analytics a WHERE a.post_id = p.id AND a.metric_type = 'impressions'), 0) as impressions,
        COALESCE((SELECT SUM(a.metric_value) FROM analytics a WHERE a.post_id = p.id AND a.metric_type = 'likes'), 0) as likes,
        COALESCE((SELECT SUM(a.metric_value) FROM analytics a WHERE a.post_id = p.id AND a.metric_type = 'comments'), 0) as comments,
        COALESCE((SELECT SUM(a.metric_value) FROM analytics a WHERE a.post_id = p.id AND a.metric_type = 'shares'), 0) as shares
      FROM posts p WHERE p.user_id = ? AND p.status = 'published'
      ORDER BY p.viral_score DESC LIMIT 10
    `).bind(userId).all(),
    c.env.DB.prepare(`
      SELECT p.id, p.caption, p.platforms, p.viral_score, p.media_type, p.created_at,
        COALESCE((SELECT SUM(a.metric_value) FROM analytics a WHERE a.post_id = p.id AND a.metric_type = 'impressions'), 0) as impressions,
        COALESCE((SELECT SUM(a.metric_value) FROM analytics a WHERE a.post_id = p.id AND a.metric_type = 'likes'), 0) as likes
      FROM posts p WHERE p.user_id = ? AND p.status = 'published'
      ORDER BY p.viral_score ASC LIMIT 5
    `).bind(userId).all(),
  ]);

  return c.json(apiSuccess({
    top_posts: topPosts.results || [],
    worst_posts: worstPosts.results || [],
    insights: generateContentInsights(topPosts.results || [], worstPosts.results || []),
  }));
});

// ── POST /api/pro-analytics/competitors — Add competitor ────
proAnalytics.post('/competitors', requireProPlan, async (c) => {
  const userId = c.get('userId');
  const { platform, username } = await c.req.json();

  if (!platform || !username) {
    return c.json(apiError('Platform and username are required'), 400);
  }

  // Limit to 5 competitors per user
  const count = await c.env.DB.prepare('SELECT COUNT(*) as c FROM competitor_profiles WHERE user_id = ?').bind(userId).first() as any;
  if (count && count.c >= 5) {
    return c.json(apiError('Maximum 5 competitors allowed. Remove one to add another.'), 400);
  }

  const id = generateId('comp');
  // Simulated competitor data (production would use platform APIs)
  const mockFollowers = Math.floor(Math.random() * 100000) + 5000;
  const mockEngagement = (Math.random() * 8 + 1).toFixed(2);

  await c.env.DB.prepare(`
    INSERT INTO competitor_profiles (id, user_id, platform, competitor_username, display_name, followers_count, avg_engagement_rate, last_synced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(id, userId, platform, username, username, mockFollowers, mockEngagement).run();

  // Create initial snapshot
  await c.env.DB.prepare(`
    INSERT INTO competitor_snapshots (id, competitor_id, followers_count, engagement_rate, posts_this_week, recorded_date)
    VALUES (?, ?, ?, ?, ?, date('now'))
  `).bind(generateId('snap'), id, mockFollowers, mockEngagement, Math.floor(Math.random() * 10) + 1).run();

  return c.json(apiSuccess({
    id, platform, username, followers: mockFollowers, engagement_rate: mockEngagement,
  }, 'Competitor added'), 201);
});

// ── GET /api/pro-analytics/competitors — List & compare ─────
proAnalytics.get('/competitors', requireProPlan, async (c) => {
  const userId = c.get('userId');

  const competitors = await c.env.DB.prepare(`
    SELECT id, platform, competitor_username, display_name, followers_count, avg_engagement_rate, last_synced_at
    FROM competitor_profiles WHERE user_id = ? ORDER BY followers_count DESC
  `).bind(userId).all();

  // Get user's own metrics for comparison
  const userFollowers = await c.env.DB.prepare('SELECT SUM(followers_count) as total FROM accounts WHERE user_id = ?').bind(userId).first() as any;
  const userAnalytics = await c.env.DB.prepare(`
    SELECT metric_type, SUM(metric_value) as total FROM analytics
    WHERE user_id = ? AND recorded_date >= date('now', '-7 days') GROUP BY metric_type
  `).bind(userId).all();

  const um: Record<string, number> = {};
  (userAnalytics.results || []).forEach((r: any) => { um[r.metric_type] = r.total; });
  const userEngagement = (um['impressions'] || 0) > 0
    ? ((um['likes'] || 0) + (um['comments'] || 0)) / (um['impressions'] || 1) * 100
    : 0;

  return c.json(apiSuccess({
    your_metrics: {
      followers: userFollowers?.total || 0,
      engagement_rate: userEngagement.toFixed(2),
    },
    competitors: competitors.results || [],
    comparison_insights: generateComparisonInsights(
      userFollowers?.total || 0,
      userEngagement,
      competitors.results || []
    ),
  }));
});

// ── DELETE /api/pro-analytics/competitors/:id ────────────────
proAnalytics.delete('/competitors/:id', requireProPlan, async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM competitor_snapshots WHERE competitor_id = ?').bind(id).run();
  await c.env.DB.prepare('DELETE FROM competitor_profiles WHERE id = ? AND user_id = ?').bind(id, userId).run();
  return c.json(apiSuccess(null, 'Competitor removed'));
});

// ── Helper functions ────────────────────────────────────────

async function getMetricTrend(c: any, userId: string, metricType: string, days: number) {
  const result = await c.env.DB.prepare(`
    SELECT recorded_date, SUM(metric_value) as value FROM analytics
    WHERE user_id = ? AND metric_type = ? AND recorded_date >= date('now', '-${days} days')
    GROUP BY recorded_date ORDER BY recorded_date ASC
  `).bind(userId, metricType).all();
  return result.results || [];
}

function generateContentInsights(topPosts: any[], worstPosts: any[]) {
  const insights: string[] = [];
  if (topPosts.length > 0) {
    const topTypes = topPosts.map(p => p.media_type);
    const videoCount = topTypes.filter(t => t === 'video').length;
    if (videoCount > topPosts.length / 2) {
      insights.push('Video content dominates your top posts. Double down on Reels and Shorts.');
    }
    const avgTopScore = topPosts.reduce((s, p) => s + p.viral_score, 0) / topPosts.length;
    insights.push(`Your top content averages a ${avgTopScore.toFixed(0)} viral score. Aim for hooks and questions in every post.`);
  }
  if (worstPosts.length > 0) {
    const avgWorstScore = worstPosts.reduce((s, p) => s + p.viral_score, 0) / worstPosts.length;
    insights.push(`Your lowest-performing content scores around ${avgWorstScore.toFixed(0)}. Review these posts to identify patterns to avoid.`);
  }
  return insights;
}

function generateComparisonInsights(userFollowers: number, userEngagement: number, competitors: any[]) {
  const insights: string[] = [];
  if (competitors.length === 0) return ['Add competitors to get comparison insights.'];

  const avgCompFollowers = competitors.reduce((s: number, c: any) => s + (c.followers_count || 0), 0) / competitors.length;
  const avgCompEngagement = competitors.reduce((s: number, c: any) => s + parseFloat(c.avg_engagement_rate || '0'), 0) / competitors.length;

  if (userFollowers > avgCompFollowers) {
    insights.push(`You have ${((userFollowers / avgCompFollowers - 1) * 100).toFixed(0)}% more followers than your competitors' average.`);
  } else {
    insights.push(`Your competitors average ${Math.round(avgCompFollowers).toLocaleString()} followers. Focus on consistent posting to close the gap.`);
  }

  if (userEngagement > avgCompEngagement) {
    insights.push('Your engagement rate beats the competition. Your content quality is a key strength.');
  } else {
    insights.push(`Competitors average ${avgCompEngagement.toFixed(1)}% engagement. Try more interactive content (polls, questions, carousels).`);
  }

  return insights;
}

export default proAnalytics;
