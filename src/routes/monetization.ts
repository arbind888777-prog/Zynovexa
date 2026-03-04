// ============================================================
// Zynovexa - Monetization API Routes
// Brand deals, earnings, rate calculator, media kit
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const monetization = new Hono<{ Bindings: Bindings; Variables: Variables }>();

monetization.use('*', authMiddleware);

// GET /api/monetization/overview - Earnings overview
monetization.get('/overview', async (c) => {
  const userId = c.get('userId');
  
  const deals = await c.env.DB.prepare(
    'SELECT * FROM brand_deals WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all();

  const totalEarnings = await c.env.DB.prepare(
    "SELECT SUM(deal_value) as total FROM brand_deals WHERE user_id = ? AND status IN ('completed', 'in_progress')"
  ).bind(userId).first();

  const pendingDeals = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM brand_deals WHERE user_id = ? AND status IN ('negotiating', 'confirmed')"
  ).bind(userId).first();

  const accounts = await c.env.DB.prepare(
    'SELECT platform, followers_count FROM accounts WHERE user_id = ?'
  ).bind(userId).all();

  const totalFollowers = (accounts.results || []).reduce((sum: number, a: any) => sum + a.followers_count, 0);
  
  // Rate calculator: CPM-based estimation
  const estimatedCPM = 15; // $15 CPM average
  const avgEngagementRate = 4.5; // 4.5% average
  const estimatedPostRate = Math.round(totalFollowers * (avgEngagementRate / 100) * estimatedCPM / 10);

  return c.json(apiSuccess({
    total_earnings: (totalEarnings as any)?.total || 0,
    pending_deals: (pendingDeals as any)?.count || 0,
    deals: deals.results,
    rate_estimate: {
      per_post: estimatedPostRate,
      per_story: Math.round(estimatedPostRate * 0.3),
      per_video: Math.round(estimatedPostRate * 2.5),
      total_followers: totalFollowers,
      engagement_rate: avgEngagementRate
    }
  }));
});

// POST /api/monetization/deals - Create brand deal
monetization.post('/deals', async (c) => {
  try {
    const userId = c.get('userId');
    const { brand_name, deal_value, platform, status, deliverables, deadline, notes } = await c.req.json();
    if (!brand_name) return c.json(apiError('Brand name is required'), 400);
    
    const dealId = generateId('deal');
    await c.env.DB.prepare(`
      INSERT INTO brand_deals (id, user_id, brand_name, deal_value, platform, status, deliverables, deadline, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(dealId, userId, brand_name, deal_value || 0, platform || '', status || 'negotiating', deliverables || '', deadline || '', notes || '').run();

    return c.json(apiSuccess({ id: dealId }, 'Deal created'), 201);
  } catch (e: any) {
    return c.json(apiError(e.message || 'Failed to create deal'), 500);
  }
});

// PUT /api/monetization/deals/:id - Update deal
monetization.put('/deals/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const dealId = c.req.param('id');
    const updates = await c.req.json();
    
    await c.env.DB.prepare(`
      UPDATE brand_deals SET brand_name = COALESCE(?, brand_name), deal_value = COALESCE(?, deal_value),
      platform = COALESCE(?, platform), status = COALESCE(?, status), deliverables = COALESCE(?, deliverables),
      deadline = COALESCE(?, deadline), notes = COALESCE(?, notes), updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).bind(updates.brand_name, updates.deal_value, updates.platform, updates.status, updates.deliverables, updates.deadline, updates.notes, dealId, userId).run();

    return c.json(apiSuccess(null, 'Deal updated'));
  } catch (e: any) {
    return c.json(apiError(e.message || 'Failed to update deal'), 500);
  }
});

// DELETE /api/monetization/deals/:id
monetization.delete('/deals/:id', async (c) => {
  const userId = c.get('userId');
  await c.env.DB.prepare('DELETE FROM brand_deals WHERE id = ? AND user_id = ?').bind(c.req.param('id'), userId).run();
  return c.json(apiSuccess(null, 'Deal deleted'));
});

// GET /api/monetization/media-kit - Generate media kit data
monetization.get('/media-kit', async (c) => {
  const userId = c.get('userId');
  
  const user: any = await c.env.DB.prepare('SELECT name, niche, avatar_url FROM users WHERE id = ?').bind(userId).first();
  const accounts = await c.env.DB.prepare('SELECT platform, platform_username, followers_count FROM accounts WHERE user_id = ?').bind(userId).all();
  const completedDeals = await c.env.DB.prepare("SELECT COUNT(*) as count FROM brand_deals WHERE user_id = ? AND status = 'completed'").bind(userId).first();
  
  const totalFollowers = (accounts.results || []).reduce((sum: number, a: any) => sum + a.followers_count, 0);

  return c.json(apiSuccess({
    creator: {
      name: user?.name || 'Creator',
      niche: user?.niche || 'General',
      avatar: user?.avatar_url || ''
    },
    stats: {
      total_followers: totalFollowers,
      platforms: accounts.results,
      completed_partnerships: (completedDeals as any)?.count || 0,
      avg_engagement_rate: '4.5%',
      audience_demographics: {
        age: { '18-24': 35, '25-34': 40, '35-44': 15, '45+': 10 },
        gender: { female: 55, male: 42, other: 3 },
        top_locations: ['United States', 'United Kingdom', 'Canada', 'Australia']
      }
    }
  }));
});

export default monetization;
