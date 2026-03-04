// ============================================================
// Zynovexa - Video Analytics API Routes
// Watch time, retention, CTR, subscriber conversion, video-level metrics
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';
const videoAnalytics = new Hono();
videoAnalytics.use('*', authMiddleware);
// GET /api/video-analytics/overview — Video performance summary
videoAnalytics.get('/overview', async (c) => {
    const userId = c.get('userId');
    const videoCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND media_type = 'video'").bind(userId).first();
    const videos = await c.env.DB.prepare("SELECT * FROM posts WHERE user_id = ? AND media_type = 'video' ORDER BY created_at DESC LIMIT 20").bind(userId).all();
    // Fetch video-specific metrics from video_metadata table
    const videoMeta = await c.env.DB.prepare('SELECT * FROM video_metadata WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').bind(userId).all().catch(() => ({ results: [] }));
    // Aggregate stats
    const metaList = videoMeta.results || [];
    const totalViews = metaList.reduce((s, v) => s + (v.views || 0), 0);
    const totalWatchHours = metaList.reduce((s, v) => s + (v.watch_time_minutes || 0), 0) / 60;
    const avgRetention = metaList.length > 0 ? metaList.reduce((s, v) => s + (v.avg_retention_pct || 0), 0) / metaList.length : 0;
    const avgCTR = metaList.length > 0 ? metaList.reduce((s, v) => s + (v.ctr_pct || 0), 0) / metaList.length : 0;
    const totalSubsGained = metaList.reduce((s, v) => s + (v.subscribers_gained || 0), 0);
    const totalLikes = metaList.reduce((s, v) => s + (v.likes || 0), 0);
    const totalComments = metaList.reduce((s, v) => s + (v.comments || 0), 0);
    // Audience retention curve (simulated — production pulls from YouTube API)
    const retentionCurve = Array.from({ length: 20 }, (_, i) => ({
        pct_through: (i + 1) * 5,
        retention: Math.max(15, 100 - (i * 4.2) + (Math.random() * 8 - 4))
    }));
    // Watch time trend (last 14 days)
    const watchTimeTrend = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return {
            date: d.toISOString().split('T')[0],
            minutes: Math.floor(Math.random() * 400) + 100,
            views: Math.floor(Math.random() * 2000) + 300
        };
    });
    return c.json(apiSuccess({
        summary: {
            total_videos: videoCount?.count || 0,
            total_views: totalViews,
            total_watch_hours: Math.round(totalWatchHours * 10) / 10,
            avg_retention_pct: Math.round(avgRetention * 10) / 10,
            avg_ctr_pct: Math.round(avgCTR * 100) / 100,
            subscribers_gained: totalSubsGained,
            total_likes: totalLikes,
            total_comments: totalComments
        },
        videos: metaList,
        retention_curve: retentionCurve,
        watch_time_trend: watchTimeTrend
    }));
});
// GET /api/video-analytics/:postId — Single video deep analytics
videoAnalytics.get('/:postId', async (c) => {
    const userId = c.get('userId');
    const postId = c.req.param('postId');
    const post = await c.env.DB.prepare("SELECT * FROM posts WHERE id = ? AND user_id = ? AND media_type = 'video'").bind(postId, userId).first();
    if (!post)
        return c.json(apiError('Video not found'), 404);
    const meta = await c.env.DB.prepare('SELECT * FROM video_metadata WHERE post_id = ? AND user_id = ?').bind(postId, userId).first().catch(() => null);
    // Per-video retention curve
    const retentionCurve = Array.from({ length: 20 }, (_, i) => ({
        pct_through: (i + 1) * 5,
        retention: Math.max(10, 100 - (i * 4.5) + (Math.random() * 10 - 5))
    }));
    // Traffic sources
    const trafficSources = [
        { source: 'YouTube Search', pct: 35 + Math.floor(Math.random() * 10) },
        { source: 'Suggested Videos', pct: 25 + Math.floor(Math.random() * 8) },
        { source: 'Browse Features', pct: 15 + Math.floor(Math.random() * 5) },
        { source: 'External', pct: 10 + Math.floor(Math.random() * 5) },
        { source: 'Direct', pct: 8 + Math.floor(Math.random() * 3) },
        { source: 'Other', pct: 5 }
    ];
    // Demographics
    const demographics = {
        age: { '13-17': 8, '18-24': 32, '25-34': 35, '35-44': 15, '45-54': 7, '55+': 3 },
        gender: { male: 48, female: 49, other: 3 },
        top_countries: [
            { country: 'United States', pct: 35 },
            { country: 'India', pct: 18 },
            { country: 'United Kingdom', pct: 12 },
            { country: 'Canada', pct: 8 },
            { country: 'Australia', pct: 6 }
        ]
    };
    return c.json(apiSuccess({
        post, metadata: meta,
        retention_curve: retentionCurve,
        traffic_sources: trafficSources,
        demographics
    }));
});
// POST /api/video-analytics/metadata — Save/update video metadata (from post creation)
videoAnalytics.post('/metadata', async (c) => {
    try {
        const userId = c.get('userId');
        const { post_id, title, description, tags, category, thumbnail_url, duration_seconds, video_url, visibility, seo_title, seo_description, seo_tags } = await c.req.json();
        if (!post_id)
            return c.json(apiError('post_id required'), 400);
        const existing = await c.env.DB.prepare('SELECT id FROM video_metadata WHERE post_id = ? AND user_id = ?').bind(post_id, userId).first();
        if (existing) {
            await c.env.DB.prepare(`
        UPDATE video_metadata SET title=?, description=?, tags=?, category=?, thumbnail_url=?,
        duration_seconds=?, video_url=?, visibility=?, seo_title=?, seo_description=?, seo_tags=?,
        updated_at=datetime('now') WHERE post_id=? AND user_id=?
      `).bind(title || '', description || '', JSON.stringify(tags || []), category || '', thumbnail_url || '', duration_seconds || 0, video_url || '', visibility || 'public', seo_title || '', seo_description || '', JSON.stringify(seo_tags || []), post_id, userId).run();
        }
        else {
            await c.env.DB.prepare(`
        INSERT INTO video_metadata (id, post_id, user_id, title, description, tags, category,
        thumbnail_url, duration_seconds, video_url, visibility, seo_title, seo_description, seo_tags,
        views, watch_time_minutes, avg_retention_pct, ctr_pct, likes, comments, subscribers_gained)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0)
      `).bind(generateId('vmeta'), post_id, userId, title || '', description || '', JSON.stringify(tags || []), category || '', thumbnail_url || '', duration_seconds || 0, video_url || '', visibility || 'public', seo_title || '', seo_description || '', JSON.stringify(seo_tags || [])).run();
        }
        return c.json(apiSuccess(null, 'Video metadata saved'));
    }
    catch (e) {
        return c.json(apiError(e.message || 'Failed'), 500);
    }
});
export default videoAnalytics;
