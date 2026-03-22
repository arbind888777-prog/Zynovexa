// ============================================================
// Zynovexa - Integration Architecture
// OAuth flows, token management, posting scheduler
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';
const integrations = new Hono();
integrations.use('*', authMiddleware);
// ── Platform OAuth Configuration ────────────────────────────
const PLATFORM_CONFIG = {
    instagram: {
        name: 'Instagram',
        authUrl: 'https://api.instagram.com/oauth/authorize',
        tokenUrl: 'https://api.instagram.com/oauth/access_token',
        scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
        apiBase: 'https://graph.instagram.com/v18.0',
    },
    youtube: {
        name: 'YouTube',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scopes: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
        apiBase: 'https://www.googleapis.com/youtube/v3',
    },
    tiktok: {
        name: 'TikTok',
        authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
        tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
        scopes: ['user.info.basic', 'video.publish', 'video.list'],
        apiBase: 'https://open.tiktokapis.com/v2',
    },
    linkedin: {
        name: 'LinkedIn',
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        scopes: ['r_liteprofile', 'w_member_social', 'r_organization_social'],
        apiBase: 'https://api.linkedin.com/v2',
    },
    twitter: {
        name: 'Twitter / X',
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        scopes: ['tweet.read', 'tweet.write', 'users.read'],
        apiBase: 'https://api.twitter.com/2',
    },
};
// ── GET /api/integrations/platforms — Available platforms ────
integrations.get('/platforms', async (c) => {
    const userId = c.get('userId');
    const connected = await c.env.DB.prepare('SELECT platform, status FROM accounts WHERE user_id = ?').bind(userId).all();
    const connectedMap = {};
    (connected.results || []).forEach((a) => { connectedMap[a.platform] = a.status; });
    const platforms = Object.entries(PLATFORM_CONFIG).map(([key, config]) => ({
        id: key,
        name: config.name,
        connected: !!connectedMap[key],
        status: connectedMap[key] || 'disconnected',
        scopes: config.scopes,
    }));
    return c.json(apiSuccess({ platforms }));
});
// ── GET /api/integrations/oauth/:platform — Start OAuth ─────
integrations.get('/oauth/:platform', async (c) => {
    const userId = c.get('userId');
    const platform = c.req.param('platform');
    const config = PLATFORM_CONFIG[platform];
    if (!config) {
        return c.json(apiError(`Unsupported platform: ${platform}`), 400);
    }
    // Generate state token for CSRF protection
    const state = generateId('oauth');
    // In production, this would be saved to Redis/DB with expiry
    const redirectUri = `${c.req.url.split('/api')[0]}/api/integrations/callback/${platform}`;
    const params = new URLSearchParams({
        client_id: `ZYNOVEXA_${platform.toUpperCase()}_CLIENT_ID`,
        redirect_uri: redirectUri,
        scope: config.scopes.join(' '),
        response_type: 'code',
        state,
    });
    return c.json(apiSuccess({
        auth_url: `${config.authUrl}?${params.toString()}`,
        state,
        platform: config.name,
    }));
});
// ── GET /api/integrations/callback/:platform — OAuth callback
integrations.get('/callback/:platform', async (c) => {
    const platform = c.req.param('platform');
    const code = c.req.query('code');
    const state = c.req.query('state');
    const error = c.req.query('error');
    if (error) {
        return c.json(apiError(`OAuth error: ${error}`), 400);
    }
    if (!code) {
        return c.json(apiError('Authorization code missing'), 400);
    }
    // In production: validate state token, exchange code for tokens
    // Simulated token exchange
    const tokenData = {
        access_token: generateId('at'),
        refresh_token: generateId('rt'),
        expires_in: 3600,
        token_type: 'Bearer',
    };
    // Note: In production, tokens would be encrypted before storage
    return c.json(apiSuccess({
        message: `${platform} connected successfully`,
        platform,
        token_expires: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    }));
});
// ── POST /api/integrations/refresh-token — Refresh tokens ───
integrations.post('/refresh-token/:platform', async (c) => {
    const userId = c.get('userId');
    const platform = c.req.param('platform');
    const account = await c.env.DB.prepare('SELECT id, refresh_token, token_expires_at FROM accounts WHERE user_id = ? AND platform = ?').bind(userId, platform).first();
    if (!account) {
        return c.json(apiError('Account not connected'), 404);
    }
    // In production: use refresh_token to get new access_token from platform API
    const newToken = generateId('at');
    const newExpiry = new Date(Date.now() + 3600 * 1000).toISOString();
    await c.env.DB.prepare('UPDATE accounts SET access_token = ?, token_expires_at = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(newToken, newExpiry, account.id).run();
    return c.json(apiSuccess({ refreshed: true, expires_at: newExpiry }));
});
// ── POST /api/integrations/schedule — Queue post for publish ─
integrations.post('/schedule', async (c) => {
    const userId = c.get('userId');
    const { post_id, platforms, scheduled_at } = await c.req.json();
    if (!post_id || !platforms || !scheduled_at) {
        return c.json(apiError('post_id, platforms, and scheduled_at are required'), 400);
    }
    // Verify post exists and belongs to user
    const post = await c.env.DB.prepare('SELECT id FROM posts WHERE id = ? AND user_id = ?').bind(post_id, userId).first();
    if (!post)
        return c.json(apiError('Post not found'), 404);
    // Create job entries per platform
    const jobs = [];
    for (const platform of platforms) {
        const jobId = generateId('job');
        await c.env.DB.prepare(`
      INSERT INTO scheduled_jobs (id, post_id, user_id, platform, scheduled_at, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).bind(jobId, post_id, userId, platform, scheduled_at).run();
        jobs.push({ id: jobId, platform, scheduled_at, status: 'pending' });
    }
    // Update post status
    await c.env.DB.prepare("UPDATE posts SET status = 'scheduled', scheduled_at = ?, updated_at = datetime('now') WHERE id = ?").bind(scheduled_at, post_id).run();
    return c.json(apiSuccess({ jobs, message: `Post scheduled for ${platforms.length} platform(s)` }));
});
// ── GET /api/integrations/queue — View scheduled queue ──────
integrations.get('/queue', async (c) => {
    const userId = c.get('userId');
    const result = await c.env.DB.prepare(`
    SELECT j.id, j.post_id, j.platform, j.scheduled_at, j.status, j.attempts, j.last_error,
           p.caption, p.media_type
    FROM scheduled_jobs j
    JOIN posts p ON j.post_id = p.id
    WHERE j.user_id = ? AND j.status IN ('pending', 'processing')
    ORDER BY j.scheduled_at ASC
  `).bind(userId).all();
    return c.json(apiSuccess({ queue: result.results || [] }));
});
// ── DELETE /api/integrations/queue/:id — Cancel scheduled job
integrations.delete('/queue/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    await c.env.DB.prepare("UPDATE scheduled_jobs SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'pending'").bind(id, userId).run();
    return c.json(apiSuccess(null, 'Job cancelled'));
});
export default integrations;
