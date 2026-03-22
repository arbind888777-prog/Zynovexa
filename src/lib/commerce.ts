import { createToken, generateId, verifyToken } from './utils';

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function slugifyUsername(input: string): string {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  return normalized || `creator-${Math.random().toString(36).slice(2, 8)}`;
}

export function getClientIdentifier(headers: Headers): string {
  return headers.get('cf-connecting-ip') || headers.get('x-forwarded-for') || 'anonymous';
}

export async function checkRateLimit(
  db: D1Database,
  scope: string,
  identifier: string,
  limit: number,
  windowMinutes: number,
): Promise<RateLimitResult> {
  const now = new Date();
  const bucketStart = new Date(now.getTime() - (now.getTime() % (windowMinutes * 60 * 1000)));
  const bucketKey = `${scope}:${identifier}:${bucketStart.toISOString()}`;

  const existing = await db.prepare(
    'SELECT id, hits FROM rate_limit_buckets WHERE id = ?'
  ).bind(bucketKey).first() as { id: string; hits: number } | null;

  if (!existing) {
    await db.prepare(
      'INSERT INTO rate_limit_buckets (id, scope, identifier, window_start, hits) VALUES (?, ?, ?, ?, 1)'
    ).bind(bucketKey, scope, identifier, bucketStart.toISOString(), bucketStart.toISOString()).run();

    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }

  if (existing.hits >= limit) {
    const retryAt = new Date(bucketStart.getTime() + windowMinutes * 60 * 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(0, Math.ceil((retryAt.getTime() - now.getTime()) / 1000)),
    };
  }

  await db.prepare(
    'UPDATE rate_limit_buckets SET hits = hits + 1, updated_at = datetime(\'now\') WHERE id = ?'
  ).bind(bucketKey).run();

  return { allowed: true, remaining: Math.max(0, limit - existing.hits - 1), retryAfterSeconds: 0 };
}

export async function createDownloadToken(
  payload: Record<string, any>,
  secret: string,
  expiresMinutes = 60,
): Promise<{ token: string; tokenHash: string; expiresAt: string }> {
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000).toISOString();
  const token = await createToken({ ...payload, scope: 'product_download', exp: Date.now() + expiresMinutes * 60 * 1000 }, secret);
  const tokenHash = await sha256Hex(token);
  return { token, tokenHash, expiresAt };
}

export async function verifyDownloadToken(token: string, secret: string): Promise<Record<string, any> | null> {
  const payload = await verifyToken(token, secret);
  if (!payload || payload.scope !== 'product_download') {
    return null;
  }
  return payload;
}

export async function verifyWebhookSignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expected = Array.from(new Uint8Array(signed)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return expected === signature;
}

export async function ensureStorefront(
  db: D1Database,
  userId: string,
  userName: string,
): Promise<{ storefrontId: string; username: string }> {
  const existing = await db.prepare(
    'SELECT id, username FROM creator_storefronts WHERE user_id = ?'
  ).bind(userId).first() as { id: string; username: string } | null;

  if (existing) {
    return { storefrontId: existing.id, username: existing.username };
  }

  let username = slugifyUsername(userName);
  let suffix = 1;
  while (await db.prepare('SELECT id FROM creator_storefronts WHERE username = ?').bind(username).first()) {
    suffix += 1;
    username = `${slugifyUsername(userName)}-${suffix}`;
  }

  const storefrontId = generateId('store');
  await db.prepare(
    'INSERT INTO creator_storefronts (id, user_id, username, headline) VALUES (?, ?, ?, ?)'
  ).bind(storefrontId, userId, username, 'Digital products, templates, and creator resources').run();

  return { storefrontId, username };
}

export async function queueEmail(
  db: D1Database,
  recipientEmail: string,
  subject: string,
  htmlBody: string,
  userId = '',
): Promise<void> {
  await db.prepare(
    'INSERT INTO email_jobs (id, user_id, recipient_email, subject, html_body) VALUES (?, ?, ?, ?, ?)'
  ).bind(generateId('email'), userId, recipientEmail, subject, htmlBody).run();
}

export function formatCurrency(amount: number, currency = 'usd'): string {
  const normalized = currency.toUpperCase();
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: normalized,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}