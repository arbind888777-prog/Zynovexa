const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const env = {};

  if (!fs.existsSync(envPath)) {
    return env;
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const rawValue = trimmed.slice(eq + 1).trim();
    env[key] = rawValue.replace(/^"|"$/g, '');
  }

  return env;
}

const env = { ...loadEnvFile(), ...process.env };

function decryptToken(encryptedBase64) {
  if (!encryptedBase64) return null;

  const keyBase64 = env.TOKEN_ENCRYPTION_KEY;
  if (!keyBase64) return encryptedBase64;

  const key = Buffer.from(keyBase64, 'base64');
  const buf = Buffer.from(encryptedBase64, 'base64');
  const iv = buf.subarray(0, 16);
  const tag = buf.subarray(16, 32);
  const ciphertext = buf.subarray(32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

async function refreshYoutubeAccessToken(refreshToken) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID || '',
      client_secret: env.GOOGLE_CLIENT_SECRET || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const payload = await tokenRes.json();
  if (!tokenRes.ok || payload.error) {
    throw new Error(payload.error_description || payload.error || `Refresh failed with ${tokenRes.status}`);
  }

  return {
    accessToken: payload.access_token,
    expiresIn: payload.expires_in || 3600,
  };
}

async function createSample() {
  const stamp = Date.now();
  const email = `scheduler.verify.${stamp}@example.com`;

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Scheduler Verify User',
      password: 'not-used',
    },
  });

  const post = await prisma.post.create({
    data: {
      userId: user.id,
      title: 'YouTube Manual Schedule Check',
      caption: `Manual schedule verification ${stamp}`,
      mediaUrls: [],
      mediaType: 'TEXT',
      platforms: ['YOUTUBE'],
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() - 60_000),
      hashtags: ['verify'],
      viralScore: 0,
    },
  });

  console.log(JSON.stringify({ userId: user.id, postId: post.id, email }, null, 2));
}

async function inspectSample(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: true,
    },
  });

  if (!post) {
    console.error(`Post not found: ${postId}`);
    process.exit(1);
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: post.userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  console.log(JSON.stringify({
    post: {
      id: post.id,
      status: post.status,
      scheduledAt: post.scheduledAt,
      publishedAt: post.publishedAt,
      publishResults: post.publishResults,
    },
    notifications,
  }, null, 2));
}

async function cleanupSample(userId) {
  await prisma.user.delete({
    where: { id: userId },
  });

  console.log(JSON.stringify({ cleanedUpUserId: userId }, null, 2));
}

async function inspectYoutubeAccounts() {
  const accounts = await prisma.socialAccount.findMany({
    where: { platform: 'YOUTUBE' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      handle: true,
      displayName: true,
      isActive: true,
      reconnectRequired: true,
      scopes: true,
      tokenExpiresAt: true,
      accessToken: true,
      refreshToken: true,
      createdAt: true,
    },
  });

  console.log(JSON.stringify(accounts.map((account) => ({
    id: account.id,
    userId: account.userId,
    handle: account.handle,
    displayName: account.displayName,
    isActive: account.isActive,
    reconnectRequired: account.reconnectRequired,
    scopes: account.scopes,
    tokenExpiresAt: account.tokenExpiresAt,
    hasAccessToken: Boolean(account.accessToken),
    hasRefreshToken: Boolean(account.refreshToken),
    createdAt: account.createdAt,
  })), null, 2));
}

async function checkYoutubeVideoPrereqs(userId) {
  const account = await prisma.socialAccount.findFirst({
    where: { userId, platform: 'YOUTUBE', isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!account) {
    console.log(JSON.stringify({ userId, ready: false, reason: 'No active YouTube account connected' }, null, 2));
    return;
  }

  const decryptedAccessToken = decryptToken(account.accessToken);
  const decryptedRefreshToken = decryptToken(account.refreshToken);
  const tokenExpired = !!account.tokenExpiresAt && account.tokenExpiresAt.getTime() <= Date.now() + 30_000;

  let accessToken = decryptedAccessToken;
  let refreshWorked = false;
  let refreshError = null;

  if ((!accessToken || tokenExpired) && decryptedRefreshToken) {
    try {
      const refreshed = await refreshYoutubeAccessToken(decryptedRefreshToken);
      accessToken = refreshed.accessToken;
      refreshWorked = true;
    } catch (error) {
      refreshError = error instanceof Error ? error.message : String(error);
    }
  }

  let channelCheck = null;
  let channelError = null;

  if (accessToken) {
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id,snippet&mine=true', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payload = await response.json().catch(() => null);

    if (response.ok) {
      const channel = payload?.items?.[0];
      channelCheck = channel
        ? { id: channel.id, title: channel.snippet?.title || null }
        : { id: null, title: null };
    } else {
      channelError = payload?.error?.message || `Channel check failed with ${response.status}`;
    }
  }

  const videoDir = path.join(__dirname, '..', 'uploads', 'videos');
  const videoFiles = fs.existsSync(videoDir)
    ? fs.readdirSync(videoDir).filter((file) => /\.(mp4|mov|avi|webm|mkv|m4v)$/i.test(file))
    : [];

  console.log(JSON.stringify({
    userId,
    account: {
      id: account.id,
      handle: account.handle,
      displayName: account.displayName,
      isActive: account.isActive,
      reconnectRequired: account.reconnectRequired,
      tokenExpiresAt: account.tokenExpiresAt,
      hasUploadScope: account.scopes.includes('https://www.googleapis.com/auth/youtube.upload'),
      hasAccessToken: Boolean(account.accessToken),
      hasRefreshToken: Boolean(account.refreshToken),
    },
    tokenCheck: {
      hadExpiredToken: tokenExpired,
      refreshWorked,
      refreshError,
      hasUsableAccessToken: Boolean(accessToken),
    },
    channelCheck,
    channelError,
    localVideoFiles: videoFiles,
    readyForLiveVideoPublish: Boolean(
      account.isActive
      && !account.reconnectRequired
      && account.scopes.includes('https://www.googleapis.com/auth/youtube.upload')
      && accessToken
      && channelCheck?.id
      && videoFiles.length > 0
    ),
  }, null, 2));
}

async function main() {
  const mode = process.argv[2];
  const postId = process.argv[3];

  if (mode === 'create') {
    await createSample();
    return;
  }

  if (mode === 'inspect' && postId) {
    await inspectSample(postId);
    return;
  }

  if (mode === 'cleanup' && postId) {
    await cleanupSample(postId);
    return;
  }

  if (mode === 'inspect-youtube-accounts') {
    await inspectYoutubeAccounts();
    return;
  }

  if (mode === 'check-youtube-video-prereqs' && postId) {
    await checkYoutubeVideoPrereqs(postId);
    return;
  }

  console.error('Usage: node scripts/verify-youtube-manual-schedule.js <create|inspect|cleanup|inspect-youtube-accounts|check-youtube-video-prereqs> [id]');
  process.exit(1);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });