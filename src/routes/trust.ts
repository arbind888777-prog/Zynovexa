// ============================================================
// Zynovexa - Testimonials & Case Studies API Routes
// Trust & credibility system
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware, adminMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const trust = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ── PUBLIC: Get approved testimonials ────────────────────────
trust.get('/testimonials', async (c) => {
  const featured = c.req.query('featured');
  let query = 'SELECT id, name, avatar_url, role, company, platform, result_text, before_followers, after_followers, before_engagement, after_engagement, growth_percentage, video_url, rating FROM testimonials WHERE approved = 1';
  const params: any[] = [];
  if (featured === '1') { query += ' AND featured = 1'; }
  query += ' ORDER BY created_at DESC LIMIT 20';
  const result = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(apiSuccess({ testimonials: result.results }));
});

// ── PUBLIC: Get published case studies ───────────────────────
trust.get('/case-studies', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT id, title, niche, duration_days, before_metrics, after_metrics, strategy_used, tools_used, growth_followers, growth_engagement, growth_revenue FROM case_studies WHERE published = 1 ORDER BY created_at DESC LIMIT 10'
  ).all();
  const studies = (result.results || []).map((s: any) => ({
    ...s,
    before_metrics: JSON.parse(s.before_metrics || '{}'),
    after_metrics: JSON.parse(s.after_metrics || '{}'),
    tools_used: JSON.parse(s.tools_used || '[]'),
    growth_percentage: s.before_metrics ? calculateGrowth(
      JSON.parse(s.before_metrics || '{}'),
      JSON.parse(s.after_metrics || '{}')
    ) : null,
  }));
  return c.json(apiSuccess({ case_studies: studies }));
});

// ── PUBLIC: Get roadmap ─────────────────────────────────────
trust.get('/roadmap', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT id, title, description, category, status, votes, target_date, released_at FROM roadmap_items ORDER BY priority DESC, votes DESC'
  ).all();
  const items = result.results || [];
  const roadmap = {
    planned: items.filter((i: any) => i.status === 'planned'),
    in_progress: items.filter((i: any) => i.status === 'in_progress'),
    released: items.filter((i: any) => i.status === 'released'),
  };
  return c.json(apiSuccess({ roadmap }));
});

// ── PUBLIC: Vote on roadmap item ────────────────────────────
trust.post('/roadmap/:id/vote', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE roadmap_items SET votes = votes + 1 WHERE id = ?').bind(id).run();
  return c.json(apiSuccess(null, 'Vote recorded'));
});

// ── ADMIN: Create testimonial ───────────────────────────────
trust.post('/testimonials', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();
  const id = generateId('test');
  const growth = body.before_followers > 0
    ? ((body.after_followers - body.before_followers) / body.before_followers * 100).toFixed(1)
    : 0;
  await c.env.DB.prepare(`
    INSERT INTO testimonials (id, name, avatar_url, role, company, platform, result_text, before_followers, after_followers, before_engagement, after_engagement, growth_percentage, video_url, rating, featured, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, body.name, body.avatar_url || '', body.role || '', body.company || '', body.platform || '', body.result_text || '', body.before_followers || 0, body.after_followers || 0, body.before_engagement || 0, body.after_engagement || 0, growth, body.video_url || '', body.rating || 5, body.featured ? 1 : 0, body.approved ? 1 : 0).run();
  return c.json(apiSuccess({ id }, 'Testimonial created'), 201);
});

// ── ADMIN: Create case study ────────────────────────────────
trust.post('/case-studies', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();
  const id = generateId('cs');
  await c.env.DB.prepare(`
    INSERT INTO case_studies (id, title, niche, duration_days, before_metrics, after_metrics, strategy_used, tools_used, growth_followers, growth_engagement, growth_revenue, featured, published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, body.title, body.niche || '', body.duration_days || 30, JSON.stringify(body.before_metrics || {}), JSON.stringify(body.after_metrics || {}), body.strategy_used || '', JSON.stringify(body.tools_used || []), body.growth_followers || 0, body.growth_engagement || 0, body.growth_revenue || 0, body.featured ? 1 : 0, body.published ? 1 : 0).run();
  return c.json(apiSuccess({ id }, 'Case study created'), 201);
});

// ── ADMIN: Manage roadmap ───────────────────────────────────
trust.post('/roadmap', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();
  const id = generateId('rm');
  await c.env.DB.prepare(`
    INSERT INTO roadmap_items (id, title, description, category, status, priority, target_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, body.title, body.description || '', body.category || 'feature', body.status || 'planned', body.priority || 0, body.target_date || '').run();
  return c.json(apiSuccess({ id }, 'Roadmap item created'), 201);
});

trust.put('/roadmap/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const released = body.status === 'released' ? new Date().toISOString() : '';
  await c.env.DB.prepare(`
    UPDATE roadmap_items SET title = ?, description = ?, status = ?, priority = ?, released_at = ?, updated_at = datetime('now') WHERE id = ?
  `).bind(body.title || '', body.description || '', body.status || 'planned', body.priority || 0, released, id).run();
  return c.json(apiSuccess(null, 'Roadmap item updated'));
});

// ── Helper: Calculate growth metrics ────────────────────────
function calculateGrowth(before: Record<string, number>, after: Record<string, number>) {
  const metrics: Record<string, string> = {};
  for (const key of Object.keys(after)) {
    if (before[key] && before[key] > 0) {
      metrics[key] = ((after[key] - before[key]) / before[key] * 100).toFixed(1) + '%';
    }
  }
  return metrics;
}

export default trust;
