// ============================================================
// Zynovexa - Pricing & Feature Gating System
// Pro Max tier, feature gating middleware, upgrade nudges
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const pricing = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ── Plan definitions with feature matrix ────────────────────
export const PLAN_CONFIG: Record<string, {
  name: string;
  price: number;
  priceYearly: number;
  features: Record<string, boolean | number>;
  limits: Record<string, number>;
  description: string;
  badge: string;
}> = {
  free: {
    name: 'Free',
    price: 0,
    priceYearly: 0,
    description: 'Get started with basic tools',
    badge: '',
    features: {
      ai_generation: true,
      scheduling: true,
      basic_analytics: true,
      multi_platform: true,
      growth_coach: false,
      pro_analytics: false,
      competitor_tracking: false,
      team_members: false,
      priority_support: false,
      custom_branding: false,
      api_access: false,
      weekly_reports: false,
    },
    limits: {
      ai_daily: 10,
      scheduled_posts: 10,
      connected_accounts: 2,
      team_members: 0,
      competitors: 0,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceYearly: 290,
    description: 'For serious creators ready to grow',
    badge: 'POPULAR',
    features: {
      ai_generation: true,
      scheduling: true,
      basic_analytics: true,
      multi_platform: true,
      growth_coach: true,
      pro_analytics: true,
      competitor_tracking: true,
      team_members: false,
      priority_support: false,
      custom_branding: false,
      api_access: false,
      weekly_reports: true,
    },
    limits: {
      ai_daily: 100,
      scheduled_posts: 100,
      connected_accounts: 5,
      team_members: 0,
      competitors: 3,
    },
  },
  promax: {
    name: 'Pro Max',
    price: 59,
    priceYearly: 590,
    description: 'Maximum power for power creators',
    badge: 'NEW',
    features: {
      ai_generation: true,
      scheduling: true,
      basic_analytics: true,
      multi_platform: true,
      growth_coach: true,
      pro_analytics: true,
      competitor_tracking: true,
      team_members: true,
      priority_support: true,
      custom_branding: true,
      api_access: false,
      weekly_reports: true,
    },
    limits: {
      ai_daily: 500,
      scheduled_posts: 500,
      connected_accounts: 10,
      team_members: 5,
      competitors: 5,
    },
  },
  business: {
    name: 'Business',
    price: 149,
    priceYearly: 1490,
    description: 'For agencies and large teams',
    badge: 'ENTERPRISE',
    features: {
      ai_generation: true,
      scheduling: true,
      basic_analytics: true,
      multi_platform: true,
      growth_coach: true,
      pro_analytics: true,
      competitor_tracking: true,
      team_members: true,
      priority_support: true,
      custom_branding: true,
      api_access: true,
      weekly_reports: true,
    },
    limits: {
      ai_daily: 9999,
      scheduled_posts: 9999,
      connected_accounts: 25,
      team_members: 25,
      competitors: 10,
    },
  },
};

// ── GET /api/pricing/plans — Public plan listing ────────────
pricing.get('/plans', async (c) => {
  const plans = Object.entries(PLAN_CONFIG).map(([key, plan]) => ({
    id: key,
    ...plan,
  }));
  return c.json(apiSuccess({ plans }));
});

// ── GET /api/pricing/my-plan — Current user's plan ──────────
pricing.get('/my-plan', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const user = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
  const planKey = user?.plan || 'free';
  const plan = PLAN_CONFIG[planKey] || PLAN_CONFIG.free;

  // Get current usage
  const [aiUsage, postCount, accountCount] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as c FROM ai_requests WHERE user_id = ? AND created_at >= date('now')").bind(userId).first(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM posts WHERE user_id = ? AND status = 'scheduled'").bind(userId).first(),
    c.env.DB.prepare('SELECT COUNT(*) as c FROM accounts WHERE user_id = ?').bind(userId).first(),
  ]);

  return c.json(apiSuccess({
    plan: { id: planKey, ...plan },
    usage: {
      ai_today: { used: (aiUsage as any)?.c || 0, limit: plan.limits.ai_daily },
      scheduled_posts: { used: (postCount as any)?.c || 0, limit: plan.limits.scheduled_posts },
      connected_accounts: { used: (accountCount as any)?.c || 0, limit: plan.limits.connected_accounts },
    },
  }));
});

// ── POST /api/pricing/upgrade — Upgrade plan ────────────────
pricing.post('/upgrade', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const { plan, billing_cycle } = await c.req.json();

  if (!PLAN_CONFIG[plan]) {
    return c.json(apiError('Invalid plan'), 400);
  }

  const currentUser = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
  if (currentUser?.plan === plan) {
    return c.json(apiError('Already on this plan'), 400);
  }

  // Update user plan
  await c.env.DB.prepare("UPDATE users SET plan = ?, updated_at = datetime('now') WHERE id = ?").bind(plan, userId).run();

  // Update subscription
  const config = PLAN_CONFIG[plan];
  const price = billing_cycle === 'yearly' ? config.priceYearly : config.price;
  await c.env.DB.prepare(`
    INSERT INTO subscriptions (id, user_id, plan, status, current_period_start, current_period_end)
    VALUES (?, ?, ?, 'active', datetime('now'), datetime('now', '+30 days'))
    ON CONFLICT(user_id) DO UPDATE SET plan = ?, status = 'active', current_period_start = datetime('now'), current_period_end = datetime('now', '+30 days'), updated_at = datetime('now')
  `).bind(generateId('sub'), userId, plan, plan).run();

  // Log payment
  await c.env.DB.prepare(
    'INSERT INTO payments (id, user_id, amount, currency, status, description) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(generateId('pay'), userId, price * 100, 'usd', 'succeeded', `Upgrade to ${config.name}`).run();

  // Create notification
  await c.env.DB.prepare(
    'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)'
  ).bind(generateId('notif'), userId, 'Plan Upgraded! 🎉', `Welcome to ${config.name}! All ${config.name} features are now unlocked.`, 'success').run();

  return c.json(apiSuccess({
    plan: { id: plan, ...config },
    message: `Upgraded to ${config.name}`,
  }));
});

// ── Feature gating middleware (exported for other routes) ────
export function requireFeature(feature: string) {
  return async (c: any, next: any) => {
    const userId = c.get('userId');
    const user = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
    const planKey = user?.plan || 'free';
    const plan = PLAN_CONFIG[planKey];

    if (!plan?.features[feature]) {
      const requiredPlan = Object.entries(PLAN_CONFIG).find(([_, p]) => p.features[feature]);
      return c.json({
        success: false,
        message: `This feature requires ${requiredPlan?.[1]?.name || 'a paid'} plan.`,
        upgrade_required: true,
        required_plan: requiredPlan?.[0] || 'pro',
        feature,
      }, 403);
    }
    await next();
  };
}

export function requireLimit(limitKey: string) {
  return async (c: any, next: any) => {
    const userId = c.get('userId');
    const user = await c.env.DB.prepare('SELECT plan FROM users WHERE id = ?').bind(userId).first() as any;
    const planKey = user?.plan || 'free';
    const plan = PLAN_CONFIG[planKey];
    const limit = plan?.limits[limitKey] || 0;

    // Check current usage based on limit type
    let currentUsage = 0;
    if (limitKey === 'ai_daily') {
      const result = await c.env.DB.prepare("SELECT COUNT(*) as c FROM ai_requests WHERE user_id = ? AND created_at >= date('now')").bind(userId).first() as any;
      currentUsage = result?.c || 0;
    } else if (limitKey === 'connected_accounts') {
      const result = await c.env.DB.prepare('SELECT COUNT(*) as c FROM accounts WHERE user_id = ?').bind(userId).first() as any;
      currentUsage = result?.c || 0;
    } else if (limitKey === 'competitors') {
      const result = await c.env.DB.prepare('SELECT COUNT(*) as c FROM competitor_profiles WHERE user_id = ?').bind(userId).first() as any;
      currentUsage = result?.c || 0;
    }

    if (currentUsage >= limit) {
      return c.json({
        success: false,
        message: `Limit reached (${currentUsage}/${limit}). Upgrade for more.`,
        upgrade_required: true,
        current_usage: currentUsage,
        limit,
      }, 429);
    }
    await next();
  };
}

// ── GET /api/pricing/nudge — Context-aware upgrade nudges ───
pricing.get('/nudge', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const context = c.req.query('context') || 'general';
  const user = await c.env.DB.prepare('SELECT plan, name FROM users WHERE id = ?').bind(userId).first() as any;
  const planKey = user?.plan || 'free';

  if (['promax', 'business'].includes(planKey)) {
    return c.json(apiSuccess({ nudge: null }));
  }

  const nudges: Record<string, Record<string, { title: string; message: string; cta: string; plan: string }>> = {
    free: {
      ai_limit: { title: 'Unlock unlimited AI', message: 'You\'ve hit your daily AI limit. Pro gives you 100 AI generations per day.', cta: 'Upgrade to Pro', plan: 'pro' },
      analytics: { title: 'See the full picture', message: 'Pro Analytics shows engagement rates, CTR, and competitor tracking.', cta: 'Try Pro Analytics', plan: 'pro' },
      growth_coach: { title: 'Get personalized growth tips', message: 'AI Growth Coach gives you daily, actionable recommendations.', cta: 'Unlock Growth Coach', plan: 'pro' },
      general: { title: 'Level up your content game', message: 'Pro users grow 3x faster with advanced AI and analytics.', cta: 'Go Pro', plan: 'pro' },
    },
    pro: {
      team: { title: 'Bring your team', message: 'Pro Max lets you add up to 5 team members with role-based access.', cta: 'Upgrade to Pro Max', plan: 'promax' },
      branding: { title: 'Make it yours', message: 'Custom branding removes Zynovexa branding and adds your logo.', cta: 'Get Pro Max', plan: 'promax' },
      general: { title: 'More power, more growth', message: 'Pro Max gives 500 daily AI generations and 5 team seats.', cta: 'Upgrade to Pro Max', plan: 'promax' },
    },
  };

  const planNudges = nudges[planKey] || nudges.free;
  const nudge = planNudges[context] || planNudges.general;

  return c.json(apiSuccess({ nudge }));
});

export default pricing;
