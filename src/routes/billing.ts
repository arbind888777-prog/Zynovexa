// ============================================================
// Zynovexa - Billing & Notifications API Routes
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const billing = new Hono<{ Bindings: Bindings; Variables: Variables }>();

billing.use('*', authMiddleware);

// GET /api/billing - Get subscription and payment info
billing.get('/', async (c) => {
  const userId = c.get('userId');
  const sub = await c.env.DB.prepare('SELECT * FROM subscriptions WHERE user_id = ?').bind(userId).first();
  const payments = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).bind(userId).all();
  const user: any = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first();
  
  return c.json(apiSuccess({
    current_plan: user?.plan || 'free',
    subscription: sub,
    payments: payments.results,
    plans: {
      free: { name: 'Free', price: 0, posts_per_month: 10, ai_requests: 20, accounts: 2 },
      pro: { name: 'Pro', price: 1900, posts_per_month: 100, ai_requests: 500, accounts: 10 },
      business: { name: 'Business', price: 4900, posts_per_month: -1, ai_requests: -1, accounts: -1 }
    }
  }));
});

// POST /api/billing/upgrade - Upgrade plan
billing.post('/upgrade', async (c) => {
  try {
    const userId = c.get('userId');
    const { plan } = await c.req.json();
    if (!['free', 'pro', 'business'].includes(plan)) return c.json(apiError('Invalid plan'), 400);
    
    await c.env.DB.prepare('UPDATE users SET plan = ?, updated_at = datetime("now") WHERE id = ?').bind(plan, userId).run();
    await c.env.DB.prepare(
      'UPDATE subscriptions SET plan = ?, current_period_start = datetime("now"), current_period_end = datetime("now", "+30 days"), updated_at = datetime("now") WHERE user_id = ?'
    ).bind(plan, userId).run();

    const prices: Record<string, number> = { free: 0, pro: 1900, business: 4900 };
    if (prices[plan] > 0) {
      await c.env.DB.prepare(
        'INSERT INTO payments (id, user_id, amount, currency, status, description) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(generateId('pay'), userId, prices[plan], 'usd', 'succeeded', `Upgrade to ${plan}`).run();
    }

    await c.env.DB.prepare('INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)')
      .bind(generateId('notif'), userId, 'Plan Upgraded!', `You're now on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`, 'success').run();

    return c.json(apiSuccess({ plan }, `Upgraded to ${plan}`));
  } catch (e: any) {
    return c.json(apiError(e.message || 'Upgrade failed'), 500);
  }
});

export default billing;
