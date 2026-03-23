import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Platform } from '@prisma/client';
import * as crypto from 'crypto';

interface PlatformConfig {
  name: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  apiBase: string;
  clientIdEnv: string;
  clientSecretEnv?: string;
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  INSTAGRAM: {
    name: 'Instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    apiBase: 'https://graph.instagram.com/v18.0',
    clientIdEnv: 'INSTAGRAM_CLIENT_ID',
  },
  YOUTUBE: {
    name: 'YouTube',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
    apiBase: 'https://www.googleapis.com/youtube/v3',
    clientIdEnv: 'GOOGLE_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_CLIENT_SECRET',
  },
  TIKTOK: {
    name: 'TikTok',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['user.info.basic', 'video.publish', 'video.list'],
    apiBase: 'https://open.tiktokapis.com/v2',
    clientIdEnv: 'TIKTOK_CLIENT_ID',
    clientSecretEnv: 'TIKTOK_CLIENT_SECRET',
  },
  LINKEDIN: {
    name: 'LinkedIn',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['r_liteprofile', 'w_member_social'],
    apiBase: 'https://api.linkedin.com/v2',
    clientIdEnv: 'LINKEDIN_CLIENT_ID',
    clientSecretEnv: 'LINKEDIN_CLIENT_SECRET',
  },
  TWITTER: {
    name: 'Twitter / X',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    apiBase: 'https://api.twitter.com/2',
    clientIdEnv: 'TWITTER_CLIENT_ID',
    clientSecretEnv: 'TWITTER_CLIENT_SECRET',
  },
};

@Injectable()
export class IntegrationsService {
  private encryptionKey: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.encryptionKey = this.config.get('TOKEN_ENCRYPTION_KEY') || 'zynovexa_default_key_32_chars_!!';
  }

  async getAvailablePlatforms(userId: string) {
    const connected = await this.prisma.socialAccount.findMany({
      where: { userId },
      select: { platform: true, isActive: true },
    });

    const connectedMap = new Map(connected.map((a) => [a.platform, a.isActive]));

    return Object.entries(PLATFORM_CONFIGS).map(([key, config]) => ({
      id: key,
      name: config.name,
      connected: connectedMap.has(key as Platform),
      active: connectedMap.get(key as Platform) ?? false,
      scopes: config.scopes,
      oauthSupported: this.isPlatformConfigured(config),
    }));
  }

  async getOAuthUrl(userId: string, platform: string) {
    const platKey = platform.toUpperCase();
    const config = PLATFORM_CONFIGS[platKey];
    if (!config) throw new BadRequestException(`Unsupported platform: ${platform}`);
    if (!this.isPlatformConfigured(config)) {
      throw new BadRequestException(`${config.name} OAuth is not configured yet. Add ${config.clientIdEnv}${config.clientSecretEnv ? ` and ${config.clientSecretEnv}` : ''} in the API env.`);
    }

    const state = this.createSignedState(userId, platKey);
    const clientId = this.config.get(config.clientIdEnv) || `ZYNOVEXA_${platKey}_CLIENT_ID`;
    const redirectUri = `${this.getApiBaseUrl()}/api/integrations/callback/${platform.toLowerCase()}`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: config.scopes.join(' '),
      response_type: 'code',
      state,
    });

    if (platKey === 'TWITTER') {
      const verifier = crypto.randomBytes(32).toString('base64url');
      const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
      params.set('code_challenge', challenge);
      params.set('code_challenge_method', 'S256');
    }

    return {
      authUrl: `${config.authUrl}?${params.toString()}`,
      state,
      platform: config.name,
    };
  }

  async handleOAuthCallback(platform: string, code: string, state: string) {
    if (!code) throw new BadRequestException('Authorization code missing');
    const oauthState = this.parseSignedState(state, platform);
    const userId = oauthState.userId;

    // In production: exchange code for tokens via the platform's token endpoint
    // For now, simulate token storage
    const platKey = platform.toUpperCase() as Platform;
    const accessToken = this.encryptToken(crypto.randomBytes(32).toString('hex'));
    const refreshToken = this.encryptToken(crypto.randomBytes(32).toString('hex'));

    const existing = await this.prisma.socialAccount.findFirst({
      where: { userId, platform: platKey },
    });

    if (existing) {
      await this.prisma.socialAccount.update({
        where: { id: existing.id },
        data: { accessToken, refreshToken, isActive: true },
      });
    } else {
      await this.prisma.socialAccount.create({
        data: {
          userId,
          platform: platKey,
          handle: `@user_${platform}`,
          displayName: `${platform} Account`,
          accessToken,
          refreshToken,
          isActive: true,
          followersCount: 0,
        },
      });
    }

    const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3001';
    return {
      message: `${platform} connected successfully`,
      redirectUrl: `${frontendUrl.replace(/\/$/, '')}/accounts?connected=${platform.toLowerCase()}`,
    };
  }

  async refreshToken(userId: string, platform: string) {
    const platKey = platform.toUpperCase() as Platform;
    const account = await this.prisma.socialAccount.findFirst({
      where: { userId, platform: platKey },
    });

    if (!account) throw new NotFoundException('Account not connected');

    // In production: use refresh_token to get new access_token
    const newToken = this.encryptToken(crypto.randomBytes(32).toString('hex'));

    await this.prisma.socialAccount.update({
      where: { id: account.id },
      data: { accessToken: newToken },
    });

    return { refreshed: true };
  }

  async schedulePost(userId: string, postId: string, platforms: string[], scheduledAt: string) {
    const post = await this.prisma.post.findFirst({ where: { id: postId, userId } });
    if (!post) throw new NotFoundException('Post not found');

    const jobs = [];
    for (const platform of platforms) {
      const job = await this.prisma.scheduledJob.create({
        data: {
          userId,
          type: 'POST_PUBLISH',
          status: 'PENDING',
          scheduledAt: new Date(scheduledAt),
          payload: { postId, platform },
        },
      });
      jobs.push({ id: job.id, platform, scheduledAt, status: 'PENDING' });
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'SCHEDULED', scheduledAt: new Date(scheduledAt) },
    });

    return { jobs, message: `Post scheduled for ${platforms.length} platform(s)` };
  }

  async getScheduledQueue(userId: string) {
    return this.prisma.scheduledJob.findMany({
      where: { userId, status: { in: ['PENDING', 'PROCESSING'] } },
      orderBy: { scheduledAt: 'asc' },
      take: 50,
    });
  }

  // ── Token encryption helpers ──────────────────────────────

  private encryptToken(token: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptToken(encrypted: string): string {
    try {
      const [ivHex, tagHex, dataHex] = encrypted.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      const data = Buffer.from(dataHex, 'hex');
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);
      return decipher.update(data) + decipher.final('utf8');
    } catch {
      return '';
    }
  }

  private isPlatformConfigured(config: PlatformConfig) {
    const clientId = this.config.get(config.clientIdEnv);
    const clientSecret = config.clientSecretEnv ? this.config.get(config.clientSecretEnv) : 'configured';
    return Boolean(clientId && clientSecret);
  }

  private createSignedState(userId: string, platform: string) {
    const payload = JSON.stringify({
      userId,
      platform,
      nonce: crypto.randomBytes(12).toString('hex'),
      issuedAt: Date.now(),
    });
    const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');
    const signature = crypto
      .createHmac('sha256', this.config.get('JWT_ACCESS_SECRET') || this.encryptionKey)
      .update(encodedPayload)
      .digest('base64url');

    return `${encodedPayload}.${signature}`;
  }

  private parseSignedState(state: string, platform: string) {
    const [encodedPayload, signature] = (state || '').split('.');
    if (!encodedPayload || !signature) {
      throw new BadRequestException('OAuth state missing or invalid');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.config.get('JWT_ACCESS_SECRET') || this.encryptionKey)
      .update(encodedPayload)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new BadRequestException('OAuth state verification failed');
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
      userId: string;
      platform: string;
      issuedAt: number;
    };

    if (payload.platform !== platform.toUpperCase()) {
      throw new BadRequestException('OAuth state platform mismatch');
    }

    if (Date.now() - payload.issuedAt > 15 * 60 * 1000) {
      throw new BadRequestException('OAuth session expired. Please reconnect and try again.');
    }

    return payload;
  }

  private getApiBaseUrl() {
    const raw = (this.config.get('API_URL') || this.config.get('BACKEND_URL') || 'http://localhost:4000').replace(/\/$/, '');
    return raw.endsWith('/api') ? raw.slice(0, -4) : raw;
  }
}
