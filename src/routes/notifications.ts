// ============================================================
// Zynovexa - Notifications API Routes
// ============================================================
import { Hono } from 'hono';
import { apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const notifications = new Hono<{ Bindings: Bindings; Variables: Variables }>();

notifications.use('*', authMiddleware);

// GET /api/notifications
notifications.get('/', async (c) => {
  const userId = c.get('userId');
  const result = await c.env.DB.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).bind(userId).all();
  return c.json(apiSuccess({ notifications: result.results }));
});

// PUT /api/notifications/:id/read
notifications.put('/:id/read', async (c) => {
  const userId = c.get('userId');
  await c.env.DB.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').bind(c.req.param('id'), userId).run();
  return c.json(apiSuccess(null, 'Marked as read'));
});

// PUT /api/notifications/read-all
notifications.put('/read-all', async (c) => {
  const userId = c.get('userId');
  await c.env.DB.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').bind(userId).run();
  return c.json(apiSuccess(null, 'All marked as read'));
});

export default notifications;
