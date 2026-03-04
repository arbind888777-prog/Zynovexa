// ============================================================
// Zynovexa - Accounts API Routes
// Social media account connection management
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';
const accounts = new Hono();
accounts.use('*', authMiddleware);
// GET /api/accounts - List all connected accounts
accounts.get('/', async (c) => {
    const userId = c.get('userId');
    const result = await c.env.DB.prepare('SELECT id, platform, platform_username, avatar_url, followers_count, status, created_at FROM accounts WHERE user_id = ? ORDER BY platform').bind(userId).all();
    return c.json(apiSuccess({ accounts: result.results }));
});
// POST /api/accounts/connect - Connect a new social account
accounts.post('/connect', async (c) => {
    try {
        const userId = c.get('userId');
        const { platform, username } = await c.req.json();
        if (!platform)
            return c.json(apiError('Platform is required'), 400);
        const supported = ['instagram', 'facebook', 'youtube', 'linkedin', 'twitter', 'tiktok'];
        if (!supported.includes(platform))
            return c.json(apiError(`Unsupported platform: ${platform}`), 400);
        // Check if already connected
        const existing = await c.env.DB.prepare('SELECT id FROM accounts WHERE user_id = ? AND platform = ?').bind(userId, platform).first();
        if (existing)
            return c.json(apiError(`${platform} is already connected`), 409);
        const accountId = generateId('acc');
        const mockUsername = username || `@user_${platform}`;
        const mockFollowers = Math.floor(Math.random() * 50000) + 1000;
        await c.env.DB.prepare(`
      INSERT INTO accounts (id, user_id, platform, platform_username, followers_count, status)
      VALUES (?, ?, ?, ?, ?, 'connected')
    `).bind(accountId, userId, platform, mockUsername, mockFollowers).run();
        await c.env.DB.prepare('INSERT INTO activity_logs (id, user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?, ?)')
            .bind(generateId('log'), userId, 'connect_account', 'account', accountId, `Connected ${platform}`).run();
        await c.env.DB.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)')
            .bind(generateId('notif'), userId, 'Account Connected', `Your ${platform} account (${mockUsername}) has been connected successfully.`, 'success').run();
        return c.json(apiSuccess({
            id: accountId, platform, username: mockUsername, followers: mockFollowers, status: 'connected'
        }, `${platform} connected successfully`), 201);
    }
    catch (e) {
        return c.json(apiError(e.message || 'Connection failed'), 500);
    }
});
// DELETE /api/accounts/:id - Disconnect account
accounts.delete('/:id', async (c) => {
    const userId = c.get('userId');
    const result = await c.env.DB.prepare('DELETE FROM accounts WHERE id = ? AND user_id = ?').bind(c.req.param('id'), userId).run();
    if (!result.meta.changes)
        return c.json(apiError('Account not found'), 404);
    return c.json(apiSuccess(null, 'Account disconnected'));
});
// POST /api/accounts/:id/reconnect - Refresh token / reconnect
accounts.post('/:id/reconnect', async (c) => {
    const userId = c.get('userId');
    const accountId = c.req.param('id');
    await c.env.DB.prepare("UPDATE accounts SET status = 'connected', updated_at = datetime('now') WHERE id = ? AND user_id = ?").bind(accountId, userId).run();
    return c.json(apiSuccess(null, 'Account reconnected'));
});
export default accounts;
