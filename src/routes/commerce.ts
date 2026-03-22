import { Hono } from 'hono';
import { authMiddleware, optionalAuth, JWT_SECRET } from '../lib/auth';
import {
  checkRateLimit,
  createDownloadToken,
  ensureStorefront,
  formatCurrency,
  getClientIdentifier,
  queueEmail,
  sha256Hex,
  verifyDownloadToken,
  verifyWebhookSignature,
} from '../lib/commerce';
import { apiError, apiSuccess, generateId } from '../lib/utils';

type Bindings = { DB: D1Database; PLATFORM_FEE_PERCENT?: string };
type Variables = { userId: string; userRole: string };

const commerce = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const PRODUCT_LIMITS: Record<string, number> = {
  free: 1,
  pro: 25,
  promax: 100,
  business: 1000,
};

function getPlatformFeePercent(value?: string): number {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.min(5, Math.max(0, parsed));
}

commerce.post('/products/create', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const title = (body.title || '').trim();
    const description = (body.description || '').trim();
    const price = Number(body.price || 0);
    const thumbnailUrl = (body.thumbnail_url || '').trim();
    const deliveryType = body.delivery_type === 'link' ? 'link' : 'file';
    const deliveryLink = (body.delivery_link || '').trim();
    const fileDataBase64 = body.file_data_base64 || '';
    const fileName = (body.file_name || '').trim();
    const fileType = (body.file_type || 'application/octet-stream').trim();

    if (!title || !description || !price) {
      return c.json(apiError('title, description, and price are required'), 400);
    }

    if (deliveryType === 'file' && !fileDataBase64) {
      return c.json(apiError('A PDF or ZIP file is required for file products'), 400);
    }

    if (deliveryType === 'link' && !deliveryLink) {
      return c.json(apiError('A secure delivery link is required for link products'), 400);
    }

    const user = await c.env.DB.prepare(
      'SELECT id, name, plan FROM users WHERE id = ?'
    ).bind(userId).first() as { id: string; name: string; plan: string } | null;
    if (!user) {
      return c.json(apiError('User not found'), 404);
    }

    const count = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM digital_products WHERE user_id = ?'
    ).bind(userId).first() as { total: number } | null;
    const productLimit = PRODUCT_LIMITS[user.plan || 'free'] || PRODUCT_LIMITS.free;
    if ((count?.total || 0) >= productLimit) {
      return c.json(apiError(`Plan limit reached. ${user.plan || 'free'} plan allows ${productLimit} products.`), 403);
    }

    const storefront = await ensureStorefront(c.env.DB, userId, user.name || 'creator');
    const productId = generateId('prod');
    await c.env.DB.prepare(
      `INSERT INTO digital_products (id, user_id, storefront_id, title, description, price, currency, delivery_type, thumbnail_url, delivery_link)
       VALUES (?, ?, ?, ?, ?, ?, 'usd', ?, ?, ?)`
    ).bind(productId, userId, storefront.storefrontId, title, description, price, deliveryType, thumbnailUrl, deliveryLink).run();

    if (deliveryType === 'file') {
      await c.env.DB.prepare(
        'INSERT INTO product_assets (id, product_id, file_name, mime_type, file_size, file_data_base64) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(generateId('asset'), productId, fileName || `${title}.pdf`, fileType, Number(body.file_size || 0), fileDataBase64).run();
    }

    await c.env.DB.prepare(
      'INSERT INTO notifications (id, user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(generateId('notif'), userId, 'Product created', `${title} is live in your storefront.`, 'success', '/app/products').run();

    return c.json(apiSuccess({
      id: productId,
      storefront_url: `/${storefront.username}`,
      checkout_url: `/checkout/${productId}`,
    }, 'Product created'), 201);
  } catch (error: any) {
    return c.json(apiError(error.message || 'Failed to create product'), 500);
  }
});

commerce.get('/products/mine', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const products = await c.env.DB.prepare(
    `SELECT p.*, s.username,
      COALESCE((SELECT COUNT(*) FROM commerce_orders o WHERE o.product_id = p.id AND o.payment_status = 'paid'), 0) as sales_count,
      COALESCE((SELECT SUM(amount) FROM commerce_orders o WHERE o.product_id = p.id AND o.payment_status = 'paid'), 0) as revenue_total
     FROM digital_products p
     LEFT JOIN creator_storefronts s ON p.storefront_id = s.id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`
  ).bind(userId).all();

  return c.json(apiSuccess({ products: products.results || [] }));
});

commerce.get('/products/:id', optionalAuth, async (c) => {
  const userId = c.get('userId') || '';
  const productId = c.req.param('id');
  const product = await c.env.DB.prepare(
    `SELECT p.*, u.name as seller_name, u.avatar_url, u.niche, s.username,
      COALESCE((SELECT file_name FROM product_assets a WHERE a.product_id = p.id), '') as file_name
     FROM digital_products p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN creator_storefronts s ON p.storefront_id = s.id
     WHERE p.id = ?`
  ).bind(productId).first() as any;

  if (!product) {
    return c.json(apiError('Product not found'), 404);
  }

  if (!product.is_published && product.user_id !== userId) {
    return c.json(apiError('Product not found'), 404);
  }

  return c.json(apiSuccess({ product }));
});

commerce.get('/users/:id/products', async (c) => {
  const userId = c.req.param('id');
  const products = await c.env.DB.prepare(
    `SELECT id, title, description, price, currency, delivery_type, thumbnail_url, created_at
     FROM digital_products
     WHERE user_id = ? AND is_published = 1
     ORDER BY created_at DESC`
  ).bind(userId).all();
  return c.json(apiSuccess({ products: products.results || [] }));
});

commerce.put('/products/:id', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const productId = c.req.param('id');
  const existing = await c.env.DB.prepare(
    'SELECT id, user_id, delivery_type FROM digital_products WHERE id = ? AND user_id = ?'
  ).bind(productId, userId).first() as any;
  if (!existing) {
    return c.json(apiError('Product not found'), 404);
  }

  const body = await c.req.json();
  await c.env.DB.prepare(
    `UPDATE digital_products SET title = ?, description = ?, price = ?, thumbnail_url = ?, delivery_link = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).bind(
    body.title || '',
    body.description || '',
    Number(body.price || 0),
    body.thumbnail_url || '',
    body.delivery_link || '',
    productId,
    userId,
  ).run();

  if (existing.delivery_type === 'file' && body.file_data_base64) {
    await c.env.DB.prepare(
      `UPDATE product_assets SET file_name = ?, mime_type = ?, file_size = ?, file_data_base64 = ? WHERE product_id = ?`
    ).bind(
      body.file_name || '',
      body.file_type || 'application/octet-stream',
      Number(body.file_size || 0),
      body.file_data_base64,
      productId,
    ).run();
  }

  return c.json(apiSuccess({ id: productId }, 'Product updated'));
});

commerce.delete('/products/:id', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const productId = c.req.param('id');
  const result = await c.env.DB.prepare(
    'DELETE FROM digital_products WHERE id = ? AND user_id = ?'
  ).bind(productId, userId).run();
  if (!result.meta.changes) {
    return c.json(apiError('Product not found'), 404);
  }
  return c.json(apiSuccess(null, 'Product deleted'));
});

commerce.post('/products/:id/track', async (c) => {
  const productId = c.req.param('id');
  const rateLimit = await checkRateLimit(c.env.DB, 'product-track', `${productId}:${getClientIdentifier(c.req.raw.headers)}`, 30, 1);
  if (!rateLimit.allowed) {
    return c.json(apiError('Too many requests'), 429);
  }

  const body = await c.req.json().catch(() => ({}));
  const eventType = body.event_type || 'view';
  if (!['view', 'click', 'purchase', 'download'].includes(eventType)) {
    return c.json(apiError('Invalid event type'), 400);
  }

  const product = await c.env.DB.prepare(
    'SELECT id, user_id, title FROM digital_products WHERE id = ? AND is_published = 1'
  ).bind(productId).first() as any;
  if (!product) {
    return c.json(apiError('Product not found'), 404);
  }

  await c.env.DB.prepare(
    `INSERT INTO product_events (id, product_id, seller_user_id, event_type, session_id, source_platform, source_post_id, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    generateId('pev'),
    productId,
    product.user_id,
    eventType,
    body.session_id || generateId('sess'),
    body.source_platform || '',
    body.source_post_id || '',
    JSON.stringify(body.metadata || {}),
  ).run();

  if (eventType === 'view') {
    const views = await c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM product_events WHERE product_id = ? AND event_type = 'view'`
    ).bind(productId).first() as any;
    if ([25, 100].includes(Number(views?.total || 0))) {
      await c.env.DB.prepare(
        'INSERT INTO notifications (id, user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(generateId('notif'), product.user_id, 'Your product is trending', `${product.title} crossed ${views.total} views. Push it with a fresh post today.`, 'info', '/app/products').run();
    }
  }

  return c.json(apiSuccess({ tracked: true }));
});

commerce.get('/analytics/product/:id', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const productId = c.req.param('id');
  const product = await c.env.DB.prepare(
    'SELECT id, title FROM digital_products WHERE id = ? AND user_id = ?'
  ).bind(productId, userId).first() as any;
  if (!product) {
    return c.json(apiError('Product not found'), 404);
  }

  const [events, paidOrders, topProducts, weeklyOrders] = await Promise.all([
    c.env.DB.prepare(
      `SELECT event_type, COUNT(*) as total FROM product_events WHERE product_id = ? GROUP BY event_type`
    ).bind(productId).all(),
    c.env.DB.prepare(
      `SELECT COUNT(*) as purchases, COALESCE(SUM(amount), 0) as revenue FROM commerce_orders WHERE product_id = ? AND payment_status = 'paid'`
    ).bind(productId).first(),
    c.env.DB.prepare(
      `SELECT p.id, p.title, COUNT(o.id) as sales_count, COALESCE(SUM(o.amount), 0) as revenue
       FROM digital_products p
       LEFT JOIN commerce_orders o ON p.id = o.product_id AND o.payment_status = 'paid'
       WHERE p.user_id = ?
       GROUP BY p.id
       ORDER BY revenue DESC, sales_count DESC
       LIMIT 5`
    ).bind(userId).all(),
    c.env.DB.prepare(
      `SELECT DATE(created_at) as day, COUNT(*) as sales, COALESCE(SUM(amount), 0) as revenue
       FROM commerce_orders
       WHERE seller_user_id = ? AND payment_status = 'paid' AND created_at >= datetime('now', '-7 days')
       GROUP BY DATE(created_at)
       ORDER BY day ASC`
    ).bind(userId).all(),
  ]);

  const counts = Object.fromEntries((events.results || []).map((row: any) => [row.event_type, Number(row.total || 0)]));
  const purchases = Number((paidOrders as any)?.purchases || 0);
  const views = Number(counts.view || 0);
  const clicks = Number(counts.click || 0);
  const conversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;

  return c.json(apiSuccess({
    product: {
      id: productId,
      title: product.title,
      views,
      clicks,
      purchases,
      revenue: Number((paidOrders as any)?.revenue || 0),
      conversion_rate: Number(conversionRate.toFixed(2)),
    },
    top_products: topProducts.results || [],
    weekly_revenue: weeklyOrders.results || [],
  }));
});

commerce.get('/reports/weekly-revenue', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const [orders, topProduct] = await Promise.all([
    c.env.DB.prepare(
      `SELECT COUNT(*) as sales, COALESCE(SUM(amount), 0) as revenue
       FROM commerce_orders
       WHERE seller_user_id = ? AND payment_status = 'paid' AND created_at >= datetime('now', '-7 days')`
    ).bind(userId).first(),
    c.env.DB.prepare(
      `SELECT p.title, COUNT(o.id) as sales_count, COALESCE(SUM(o.amount), 0) as revenue
       FROM digital_products p
       LEFT JOIN commerce_orders o ON p.id = o.product_id AND o.payment_status = 'paid' AND o.created_at >= datetime('now', '-7 days')
       WHERE p.user_id = ?
       GROUP BY p.id
       ORDER BY revenue DESC, sales_count DESC
       LIMIT 1`
    ).bind(userId).first(),
  ]);

  const revenue = Number((orders as any)?.revenue || 0);
  const sales = Number((orders as any)?.sales || 0);
  const suggestions = [
    revenue === 0 ? 'Post a quick CTA-driven reel for your best product today.' : 'Turn your best seller into a pinned post and story highlight.',
    sales < 3 ? 'Offer a limited-time bonus to improve checkout conversion.' : 'Bundle your top product with a smaller upsell to lift AOV.',
  ];

  return c.json(apiSuccess({
    sales,
    revenue,
    top_product: topProduct || null,
    summary: sales > 0
      ? `You made ${sales} sale${sales === 1 ? '' : 's'} this week for ${formatCurrency(revenue)}.`
      : 'No sales this week yet. One strong CTA post can restart momentum quickly.',
    suggestions,
  }));
});

commerce.get('/ai/sales-suggestions', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const topProduct = await c.env.DB.prepare(
    `SELECT p.id, p.title,
      COALESCE((SELECT COUNT(*) FROM product_events e WHERE e.product_id = p.id AND e.event_type = 'click'), 0) as clicks,
      COALESCE((SELECT COUNT(*) FROM commerce_orders o WHERE o.product_id = p.id AND o.payment_status = 'paid'), 0) as purchases
     FROM digital_products p
     WHERE p.user_id = ?
     ORDER BY purchases DESC, clicks DESC, created_at DESC
     LIMIT 1`
  ).bind(userId).first() as any;

  if (!topProduct) {
    return c.json(apiSuccess({ suggestions: ['Create your first digital product to unlock AI sales suggestions.'] }));
  }

  const clicks = Number(topProduct.clicks || 0);
  const purchases = Number(topProduct.purchases || 0);
  const conversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;

  const suggestions = [
    `Post a results-focused teaser for ${topProduct.title} with a direct CTA to /checkout/${topProduct.id}.`,
    conversionRate < 3
      ? 'Your clicks are not converting fast enough. Tighten the product promise and add one urgent bonus.'
      : 'Your conversion rate is healthy. Repackage this product into a carousel or reel thread for more reach.',
    'Add the product to your next three posts to connect content directly to sales.',
  ];

  return c.json(apiSuccess({ suggestions, top_product: topProduct }));
});

commerce.get('/storefront/:username', async (c) => {
  const username = c.req.param('username');
  const store = await c.env.DB.prepare(
    `SELECT s.id, s.username, s.headline, s.bio, s.accent_color, u.id as user_id, u.name, u.avatar_url, u.niche
     FROM creator_storefronts s
     JOIN users u ON s.user_id = u.id
     WHERE s.username = ?`
  ).bind(username).first() as any;
  if (!store) {
    return c.json(apiError('Storefront not found'), 404);
  }

  const products = await c.env.DB.prepare(
    `SELECT id, title, description, price, currency, thumbnail_url, delivery_type
     FROM digital_products
     WHERE user_id = ? AND is_published = 1
     ORDER BY created_at DESC`
  ).bind(store.user_id).all();

  return c.json(apiSuccess({ storefront: store, products: products.results || [] }));
});

commerce.post('/payments/checkout', async (c) => {
  const body = await c.req.json();
  const productId = body.product_id;
  const buyerEmail = (body.buyer_email || '').trim().toLowerCase();
  const buyerName = (body.buyer_name || '').trim();
  const sourcePlatform = (body.source_platform || '').trim();
  const sourcePostId = (body.source_post_id || '').trim();
  const requestedProvider = (body.payment_provider || '').trim().toLowerCase();
  if (!productId || !buyerEmail) {
    return c.json(apiError('product_id and buyer_email are required'), 400);
  }

  const limiter = await checkRateLimit(c.env.DB, 'checkout', `${productId}:${getClientIdentifier(c.req.raw.headers)}`, 8, 10);
  if (!limiter.allowed) {
    return c.json(apiError('Too many checkout attempts. Try again shortly.'), 429);
  }

  const product = await c.env.DB.prepare(
    'SELECT id, user_id, title, price, currency, is_published FROM digital_products WHERE id = ?'
  ).bind(productId).first() as any;
  if (!product || !product.is_published) {
    return c.json(apiError('Product not found'), 404);
  }

  const provider = requestedProvider || (product.currency === 'inr' ? 'razorpay' : 'stripe');
  const platformFeePercent = getPlatformFeePercent(c.env.PLATFORM_FEE_PERCENT);
  const platformFeeAmount = Math.round(Number(product.price || 0) * (platformFeePercent / 100));
  const sellerNetAmount = Math.max(0, Number(product.price || 0) - platformFeeAmount);
  const orderId = generateId('ord');
  await c.env.DB.prepare(
    `INSERT INTO commerce_orders (id, seller_user_id, product_id, buyer_name, buyer_email, amount, platform_fee_percent, platform_fee_amount, seller_net_amount, currency, payment_provider, external_order_id, source_platform, source_post_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(orderId, product.user_id, productId, buyerName, buyerEmail, product.price, platformFeePercent, platformFeeAmount, sellerNetAmount, product.currency || 'usd', provider, `${provider}_${orderId}`, sourcePlatform, sourcePostId).run();

  await c.env.DB.prepare(
    `INSERT INTO product_events (id, product_id, seller_user_id, order_id, event_type, visitor_email, source_platform, source_post_id, metadata)
     VALUES (?, ?, ?, ?, 'click', ?, ?, ?, ?)`
  ).bind(generateId('pev'), productId, product.user_id, orderId, buyerEmail, sourcePlatform, sourcePostId, JSON.stringify({ provider })).run();

  const stripeConfigured = false;
  const razorpayConfigured = false;
  const isConfigured = provider === 'stripe' ? stripeConfigured : razorpayConfigured;

  return c.json(apiSuccess({
    order_id: orderId,
    provider,
    amount: product.price,
    platform_fee_percent: platformFeePercent,
    platform_fee_amount: platformFeeAmount,
    seller_net_amount: sellerNetAmount,
    currency: product.currency || 'usd',
    mode: isConfigured ? 'provider' : 'demo',
    checkout_url: `/checkout/${productId}?order=${orderId}`,
  }, 'Checkout initialized'));
});

commerce.post('/payments/orders/:id/mark-paid', async (c) => {
  const orderId = c.req.param('id');
  const limiter = await checkRateLimit(c.env.DB, 'mark-paid', `${orderId}:${getClientIdentifier(c.req.raw.headers)}`, 5, 5);
  if (!limiter.allowed) {
    return c.json(apiError('Too many requests'), 429);
  }

  const order = await c.env.DB.prepare(
    `SELECT o.*, p.title, p.delivery_type, p.delivery_link, p.user_id as seller_id, u.name as seller_name
     FROM commerce_orders o
     JOIN digital_products p ON o.product_id = p.id
     JOIN users u ON p.user_id = u.id
     WHERE o.id = ?`
  ).bind(orderId).first() as any;
  if (!order) {
    return c.json(apiError('Order not found'), 404);
  }
  if (order.payment_status === 'paid') {
    return c.json(apiSuccess({ order_id: orderId }, 'Order already completed'));
  }

  const tokenBundle = await createDownloadToken({ orderId, productId: order.product_id, buyerEmail: order.buyer_email }, JWT_SECRET, 24 * 60);
  await c.env.DB.prepare(
    `UPDATE commerce_orders SET payment_status = 'paid', delivery_status = 'ready', external_payment_id = ?, paid_at = datetime('now') WHERE id = ?`
  ).bind(`demo_${orderId}`, orderId).run();
  await c.env.DB.prepare(
    `INSERT INTO product_download_tokens (id, order_id, product_id, token_hash, expires_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(generateId('dl'), orderId, order.product_id, tokenBundle.tokenHash, tokenBundle.expiresAt).run();
  await c.env.DB.prepare(
    `INSERT INTO product_events (id, product_id, seller_user_id, order_id, event_type, visitor_email, source_platform, source_post_id)
     VALUES (?, ?, ?, ?, 'purchase', ?, ?, ?)`
  ).bind(generateId('pev'), order.product_id, order.seller_id, orderId, order.buyer_email, order.source_platform || '', order.source_post_id || '').run();
  await c.env.DB.prepare(
    'INSERT INTO notifications (id, user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(generateId('notif'), order.seller_id, 'You made a sale', `${order.title} sold for ${formatCurrency(order.amount, order.currency)}.`, 'success', '/app/products').run();

  const downloadUrl = `/downloads/${tokenBundle.token}`;
  await queueEmail(
    c.env.DB,
    order.buyer_email,
    `Your purchase: ${order.title}`,
    `<h2>Thanks for your purchase</h2><p>You bought <strong>${order.title}</strong>.</p><p><a href="${downloadUrl}">Download your file</a></p><p>This link expires in 24 hours.</p>`,
    order.seller_id,
  );
  await queueEmail(
    c.env.DB,
    order.buyer_email,
    `Receipt for ${order.title}`,
    `<p>Receipt</p><p>Amount: ${formatCurrency(order.amount, order.currency)}</p><p>Order ID: ${orderId}</p>`,
    order.seller_id,
  );

  return c.json(apiSuccess({ order_id: orderId, download_url: downloadUrl, success_url: `/success/${orderId}?download=${encodeURIComponent(downloadUrl)}` }, 'Payment confirmed'));
});

commerce.post('/payments/webhooks/stripe', async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header('stripe-signature') || '';
  if (signature && !(await verifyWebhookSignature(rawBody, signature, JWT_SECRET))) {
    return c.json(apiError('Invalid webhook signature'), 401);
  }
  return c.json(apiSuccess({ received: true }));
});

commerce.post('/payments/webhooks/razorpay', async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header('x-razorpay-signature') || '';
  if (signature && !(await verifyWebhookSignature(rawBody, signature, JWT_SECRET))) {
    return c.json(apiError('Invalid webhook signature'), 401);
  }
  return c.json(apiSuccess({ received: true }));
});

commerce.get('/orders/:id', async (c) => {
  const orderId = c.req.param('id');
  const order = await c.env.DB.prepare(
    `SELECT o.id, o.buyer_email, o.amount, o.platform_fee_percent, o.platform_fee_amount, o.seller_net_amount, o.currency, o.payment_status, o.paid_at,
      p.title, p.thumbnail_url
     FROM commerce_orders o
     JOIN digital_products p ON o.product_id = p.id
     WHERE o.id = ?`
  ).bind(orderId).first();
  if (!order) {
    return c.json(apiError('Order not found'), 404);
  }
  return c.json(apiSuccess({ order }));
});

commerce.get('/downloads/:token', async (c) => {
  const token = c.req.param('token');
  const payload = await verifyDownloadToken(token, JWT_SECRET);
  if (!payload) {
    return c.text('Invalid or expired download link', 401);
  }

  const tokenHash = await sha256Hex(token);
  const dbToken = await c.env.DB.prepare(
    `SELECT d.*, o.payment_status, p.title, p.delivery_type, p.delivery_link,
      a.file_name, a.mime_type, a.file_data_base64
     FROM product_download_tokens d
     JOIN commerce_orders o ON d.order_id = o.id
     JOIN digital_products p ON d.product_id = p.id
     LEFT JOIN product_assets a ON a.product_id = p.id
     WHERE d.token_hash = ?`
  ).bind(tokenHash).first() as any;
  if (!dbToken || dbToken.payment_status !== 'paid') {
    return c.text('Download not available', 404);
  }

  const limiter = await checkRateLimit(c.env.DB, 'download', `${dbToken.id}:${getClientIdentifier(c.req.raw.headers)}`, 10, 10);
  if (!limiter.allowed) {
    return c.text('Too many download attempts', 429);
  }

  if (Number(dbToken.download_count || 0) >= Number(dbToken.max_downloads || 3)) {
    return c.text('Download limit reached', 403);
  }

  await c.env.DB.prepare(
    `UPDATE product_download_tokens SET download_count = download_count + 1, last_downloaded_at = datetime('now') WHERE id = ?`
  ).bind(dbToken.id).run();

  await c.env.DB.prepare(
    `INSERT INTO product_events (id, product_id, seller_user_id, order_id, event_type, visitor_email)
     VALUES (?, ?, (SELECT seller_user_id FROM commerce_orders WHERE id = ?), ?, 'download', (SELECT buyer_email FROM commerce_orders WHERE id = ?))`
  ).bind(generateId('pev'), dbToken.product_id, dbToken.order_id, dbToken.order_id, dbToken.order_id).run();

  if (dbToken.delivery_type === 'link' && dbToken.delivery_link) {
    return c.redirect(dbToken.delivery_link, 302);
  }

  if (!dbToken.file_data_base64) {
    return c.text('File asset missing', 404);
  }

  const bytes = Uint8Array.from(atob(dbToken.file_data_base64), (char) => char.charCodeAt(0));
  c.header('Content-Type', dbToken.mime_type || 'application/octet-stream');
  c.header('Content-Disposition', `attachment; filename="${dbToken.file_name || 'download'}"`);
  return c.body(bytes);
});

export default commerce;