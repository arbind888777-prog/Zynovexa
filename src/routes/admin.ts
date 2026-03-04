// ============================================================
// Zynovexa - Admin API Routes
// User management, system overview, subscription control
// ============================================================
import { Hono } from 'hono';
import { apiSuccess, apiError, getPagination } from '../lib/utils';
import { authMiddleware, adminMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use('*', authMiddleware);
admin.use('*', adminMiddleware);

// GET /api/admin/overview - System-wide stats
admin.get('/overview', async (c) => {
  const [users, posts, accounts, subs, aiReqs, logs] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM posts').first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM accounts').first(),
    c.env.DB.prepare("SELECT plan, COUNT(*) as count FROM subscriptions GROUP BY plan").all(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM ai_requests').first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM activity_logs').first(),
  ]);

  const todayUsers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM users WHERE created_at >= date('now')"
  ).first();

  const todayPosts = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM posts WHERE created_at >= date('now')"
  ).first();

  const revenue = await c.env.DB.prepare(
    'SELECT SUM(amount) as total FROM payments'
  ).first();

  return c.json(apiSuccess({
    total_users: (users as any)?.count || 0,
    total_posts: (posts as any)?.count || 0,
    total_accounts: (accounts as any)?.count || 0,
    total_ai_requests: (aiReqs as any)?.count || 0,
    total_activity_logs: (logs as any)?.count || 0,
    today_signups: (todayUsers as any)?.count || 0,
    today_posts: (todayPosts as any)?.count || 0,
    total_revenue: (revenue as any)?.total || 0,
    subscriptions_by_plan: (subs as any)?.results || []
  }));
});

// GET /api/admin/users - List all users with pagination
admin.get('/users', async (c) => {
  const url = new URL(c.req.url);
  const { limit, offset } = getPagination(url);
  const search = url.searchParams.get('search') || '';
  
  let query = 'SELECT id, email, name, role, niche, plan, onboarded, created_at FROM users';
  const params: any[] = [];
  if (search) {
    query += ' WHERE email LIKE ? OR name LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await c.env.DB.prepare(query).bind(...params).all();
  const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
  
  return c.json(apiSuccess({ users: result.results, total: (total as any)?.count || 0 }));
});

// GET /api/admin/users/:id - Get user details
admin.get('/users/:id', async (c) => {
  const userId = c.req.param('id');
  const user: any = await c.env.DB.prepare(
    'SELECT id, email, name, role, niche, plan, onboarded, timezone, created_at FROM users WHERE id = ?'
  ).bind(userId).first();
  if (!user) return c.json(apiError('User not found'), 404);

  const accounts = await c.env.DB.prepare('SELECT * FROM accounts WHERE user_id = ?').bind(userId).all();
  const postCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').bind(userId).first();
  const sub = await c.env.DB.prepare('SELECT * FROM subscriptions WHERE user_id = ?').bind(userId).first();

  return c.json(apiSuccess({ user, accounts: accounts.results, post_count: (postCount as any)?.count || 0, subscription: sub }));
});

// PUT /api/admin/users/:id - Update user (role, plan, etc.)
admin.put('/users/:id', async (c) => {
  const userId = c.req.param('id');
  const { role, plan, niche } = await c.req.json();
  
  await c.env.DB.prepare(
    'UPDATE users SET role = COALESCE(?, role), plan = COALESCE(?, plan), niche = COALESCE(?, niche), updated_at = datetime("now") WHERE id = ?'
  ).bind(role || null, plan || null, niche || null, userId).run();

  if (plan) {
    await c.env.DB.prepare('UPDATE subscriptions SET plan = ?, updated_at = datetime("now") WHERE user_id = ?').bind(plan, userId).run();
  }
  
  return c.json(apiSuccess(null, 'User updated'));
});

// GET /api/admin/posts - All posts across platform
admin.get('/posts', async (c) => {
  const url = new URL(c.req.url);
  const { limit, offset } = getPagination(url);
  
  const result = await c.env.DB.prepare(`
    SELECT p.*, u.name as author_name, u.email as author_email
    FROM posts p JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `).bind(limit, offset).all();
  
  return c.json(apiSuccess({ posts: result.results }));
});

// GET /api/admin/activity - Recent activity logs
admin.get('/activity', async (c) => {
  const url = new URL(c.req.url);
  const { limit, offset } = getPagination(url);
  
  const result = await c.env.DB.prepare(`
    SELECT l.*, u.name as user_name, u.email as user_email
    FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC LIMIT ? OFFSET ?
  `).bind(limit, offset).all();
  
  return c.json(apiSuccess({ logs: result.results }));
});

// GET /api/admin/revenue - Revenue analytics
admin.get('/revenue', async (c) => {
  const monthly = await c.env.DB.prepare(`
    SELECT strftime('%Y-%m', created_at) as month, SUM(amount) as total, COUNT(*) as count
    FROM payments GROUP BY month ORDER BY month DESC LIMIT 12
  `).all();

  const byPlan = await c.env.DB.prepare(`
    SELECT plan, COUNT(*) as count FROM subscriptions WHERE status = 'active' GROUP BY plan
  `).all();

  return c.json(apiSuccess({ monthly_revenue: monthly.results, active_by_plan: byPlan.results }));
});

export default admin;
