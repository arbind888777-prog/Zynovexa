// ============================================================
// Zynovexa - Posts API Routes
// CRUD operations for content posts, scheduling, publishing
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError, getPagination } from '../lib/utils';
import { authMiddleware } from '../lib/auth';
const posts = new Hono();
posts.use('*', authMiddleware);
// GET /api/posts - List user's posts with pagination and filters
posts.get('/', async (c) => {
    const userId = c.get('userId');
    const url = new URL(c.req.url);
    const { limit, offset } = getPagination(url);
    const status = url.searchParams.get('status') || '';
    let query = `SELECT p.*, (
      SELECT product_id FROM post_product_links ppl WHERE ppl.post_id = p.id LIMIT 1
    ) as attached_product_id
    FROM posts p WHERE user_id = ?`;
    const params = [userId];
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const result = await c.env.DB.prepare(query).bind(...params).all();
    const countResult = await c.env.DB.prepare('SELECT COUNT(*) as total FROM posts WHERE user_id = ?' + (status ? ' AND status = ?' : '')).bind(...(status ? [userId, status] : [userId])).first();
    return c.json(apiSuccess({ posts: result.results, total: countResult?.total || 0 }));
});
// GET /api/posts/:id - Get single post
posts.get('/:id', async (c) => {
    const userId = c.get('userId');
    const post = await c.env.DB.prepare(`
    SELECT p.*, (
      SELECT product_id FROM post_product_links ppl WHERE ppl.post_id = p.id LIMIT 1
    ) as attached_product_id
    FROM posts p WHERE p.id = ? AND p.user_id = ?
  `).bind(c.req.param('id'), userId).first();
    if (!post)
        return c.json(apiError('Post not found'), 404);
    return c.json(apiSuccess({ post }));
});
// POST /api/posts - Create new post
posts.post('/', async (c) => {
    try {
        const userId = c.get('userId');
        const { caption, media_urls, media_type, platforms, status, scheduled_at, hashtags, attached_product_id } = await c.req.json();
        let finalCaption = caption || '';
        let attachedProduct = null;
        if (attached_product_id) {
            attachedProduct = await c.env.DB.prepare(`SELECT p.id, p.title, s.username
         FROM digital_products p
         LEFT JOIN creator_storefronts s ON p.storefront_id = s.id
         WHERE p.id = ? AND p.user_id = ?`).bind(attached_product_id, userId).first();
            if (!attachedProduct) {
                return c.json(apiError('Attached product not found'), 404);
            }
            const ctaUrl = attachedProduct.username ? `/${attachedProduct.username}` : `/checkout/${attached_product_id}`;
            if (!finalCaption.includes('Buy here:')) {
                finalCaption = `${finalCaption.trim()}\n\nBuy here: ${ctaUrl}`.trim();
            }
        }
        const postId = generateId('post');
        const viralScore = Math.floor(Math.random() * 40) + 40; // Simulated AI score 40-80
        await c.env.DB.prepare(`
      INSERT INTO posts (id, user_id, caption, media_urls, media_type, platforms, status, scheduled_at, viral_score, hashtags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(postId, userId, finalCaption, JSON.stringify(media_urls || []), media_type || 'text', JSON.stringify(platforms || []), status || 'draft', scheduled_at || '', viralScore, JSON.stringify(hashtags || [])).run();
        if (attachedProduct) {
            await c.env.DB.prepare('INSERT INTO post_product_links (id, post_id, user_id, product_id, cta_text) VALUES (?, ?, ?, ?, ?)').bind(generateId('ppl'), postId, userId, attachedProduct.id, 'Buy here').run();
        }
        // If scheduled, create job entries per platform
        if (status === 'scheduled' && scheduled_at) {
            const targetPlatforms = platforms || [];
            for (const platform of targetPlatforms) {
                await c.env.DB.prepare(`
          INSERT INTO scheduled_jobs (id, post_id, user_id, platform, scheduled_at, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `).bind(generateId('job'), postId, userId, platform, scheduled_at).run();
            }
        }
        await c.env.DB.prepare('INSERT INTO activity_logs (id, user_id, action, resource_type, resource_id) VALUES (?, ?, ?, ?, ?)')
            .bind(generateId('log'), userId, 'create_post', 'post', postId).run();
        return c.json(apiSuccess({ id: postId, viral_score: viralScore }, 'Post created'), 201);
    }
    catch (e) {
        return c.json(apiError(e.message || 'Failed to create post'), 500);
    }
});
// PUT /api/posts/:id - Update post
posts.put('/:id', async (c) => {
    try {
        const userId = c.get('userId');
        const postId = c.req.param('id');
        const existing = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').bind(postId, userId).first();
        if (!existing)
            return c.json(apiError('Post not found'), 404);
        const { caption, media_urls, media_type, platforms, status, scheduled_at, hashtags, attached_product_id } = await c.req.json();
        let finalCaption = caption ?? existing.caption;
        await c.env.DB.prepare('DELETE FROM post_product_links WHERE post_id = ? AND user_id = ?').bind(postId, userId).run();
        if (attached_product_id) {
            const attachedProduct = await c.env.DB.prepare(`SELECT p.id, s.username
         FROM digital_products p
         LEFT JOIN creator_storefronts s ON p.storefront_id = s.id
         WHERE p.id = ? AND p.user_id = ?`).bind(attached_product_id, userId).first();
            if (!attachedProduct) {
                return c.json(apiError('Attached product not found'), 404);
            }
            const ctaUrl = attachedProduct.username ? `/${attachedProduct.username}` : `/checkout/${attached_product_id}`;
            if (finalCaption && !String(finalCaption).includes('Buy here:')) {
                finalCaption = `${String(finalCaption).trim()}\n\nBuy here: ${ctaUrl}`.trim();
            }
            await c.env.DB.prepare('INSERT INTO post_product_links (id, post_id, user_id, product_id, cta_text) VALUES (?, ?, ?, ?, ?)').bind(generateId('ppl'), postId, userId, attachedProduct.id, 'Buy here').run();
        }
        await c.env.DB.prepare(`
      UPDATE posts SET caption = ?, media_urls = ?, media_type = ?, platforms = ?, status = ?, scheduled_at = ?, hashtags = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?
    `).bind(finalCaption, media_urls ? JSON.stringify(media_urls) : existing.media_urls, media_type ?? existing.media_type, platforms ? JSON.stringify(platforms) : existing.platforms, status ?? existing.status, scheduled_at ?? existing.scheduled_at, hashtags ? JSON.stringify(hashtags) : existing.hashtags, postId, userId).run();
        return c.json(apiSuccess({ id: postId }, 'Post updated'));
    }
    catch (e) {
        return c.json(apiError(e.message || 'Failed to update post'), 500);
    }
});
// DELETE /api/posts/:id - Delete post
posts.delete('/:id', async (c) => {
    const userId = c.get('userId');
    const postId = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM scheduled_jobs WHERE post_id = ? AND user_id = ?').bind(postId, userId).run();
    const result = await c.env.DB.prepare('DELETE FROM posts WHERE id = ? AND user_id = ?').bind(postId, userId).run();
    if (!result.meta.changes)
        return c.json(apiError('Post not found'), 404);
    return c.json(apiSuccess(null, 'Post deleted'));
});
// POST /api/posts/:id/publish - Publish post immediately
posts.post('/:id/publish', async (c) => {
    const userId = c.get('userId');
    const postId = c.req.param('id');
    const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').bind(postId, userId).first();
    if (!post)
        return c.json(apiError('Post not found'), 404);
    // Simulate publishing to each platform
    const platforms = JSON.parse(post.platforms || '[]');
    const results = {};
    for (const p of platforms) {
        results[p] = { status: 'published', published_at: new Date().toISOString(), post_url: `https://${p}.com/p/${postId}` };
    }
    await c.env.DB.prepare("UPDATE posts SET status = 'published', published_at = datetime('now'), publish_results = ?, updated_at = datetime('now') WHERE id = ?").bind(JSON.stringify(results), postId).run();
    // Generate mock analytics
    for (const p of platforms) {
        const metrics = ['impressions', 'likes', 'comments', 'shares'];
        for (const m of metrics) {
            await c.env.DB.prepare('INSERT INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(generateId('an'), userId, postId, p, m, Math.floor(Math.random() * 1000) + 100, new Date().toISOString().split('T')[0]).run();
        }
    }
    return c.json(apiSuccess({ publish_results: results }, 'Post published'));
});
export default posts;
