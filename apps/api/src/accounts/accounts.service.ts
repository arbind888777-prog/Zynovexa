// ============================================================
// Zynovexa — Accounts Service (Production)
// Manages social account connections with encrypted token storage
// and real YouTube OAuth connect flow.
// ============================================================
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TokenEncryptionService } from './token-encryption.service';
import { ConnectAccountDto, UpdateAccountDto } from './dto/account.dto';
import { YoutubeService } from '../video-analytics/youtube.service';
import * as jwt from 'jsonwebtoken';

function normalizeYoutubeHandle(handle?: string | null) {
  if (!handle) return '';
  const trimmed = handle.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

/** Strip raw tokens from public API responses — tokens are internal only */
function safeAccount(a: any) {
  const { accessToken, refreshToken, ...safe } = a;
  return safe;
}

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private prisma: PrismaService,
    private encryption: TokenEncryptionService,
    private config: ConfigService,
    private youtubeService: YoutubeService,
  ) {}

  // ─── Public API methods ───────────────────────────────────────────────────

  async getAll(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return accounts.map(safeAccount);
  }

  async connect(userId: string, dto: ConnectAccountDto) {
    const encAccessToken  = this.encryption.encrypt(dto.accessToken  ?? null);
    const encRefreshToken = this.encryption.encrypt(dto.refreshToken ?? null);

    const whereClause = dto.platformUserId
      ? { userId_platform_platformUserId: { userId, platform: dto.platform, platformUserId: dto.platformUserId } }
      : undefined;

    if (whereClause) {
      return safeAccount(
        await this.prisma.socialAccount.upsert({
          where: whereClause,
          update: {
            accessToken:       encAccessToken,
            refreshToken:      encRefreshToken,
            handle:            dto.handle,
            displayName:       dto.displayName,
            avatarUrl:         dto.avatarUrl,
            followersCount:    dto.followersCount || 0,
            scopes:            dto.scopes || [],
            tokenExpiresAt:    dto.tokenExpiresAt ? new Date(dto.tokenExpiresAt) : null,
            reconnectRequired: false,
            isActive:          true,
          },
          create: {
            userId,
            platform:        dto.platform,
            platformUserId:  dto.platformUserId,
            accessToken:     encAccessToken,
            refreshToken:    encRefreshToken,
            handle:          dto.handle,
            displayName:     dto.displayName,
            avatarUrl:       dto.avatarUrl,
            followersCount:  dto.followersCount || 0,
            scopes:          dto.scopes || [],
            tokenExpiresAt:  dto.tokenExpiresAt ? new Date(dto.tokenExpiresAt) : null,
          },
        }),
      );
    }

    // Manual connect — no platformUserId
    const existing = await this.prisma.socialAccount.findFirst({
      where: { userId, platform: dto.platform, platformUserId: null },
    });
    if (existing) {
      return safeAccount(
        await this.prisma.socialAccount.update({
          where: { id: existing.id },
          data: {
            accessToken:       encAccessToken,
            refreshToken:      encRefreshToken,
            handle:            dto.handle,
            displayName:       dto.displayName,
            avatarUrl:         dto.avatarUrl,
            followersCount:    dto.followersCount || 0,
            reconnectRequired: false,
            isActive:          true,
          },
        }),
      );
    }
    return safeAccount(
      await this.prisma.socialAccount.create({
        data: {
          userId,
          platform:       dto.platform,
          accessToken:    encAccessToken,
          refreshToken:   encRefreshToken,
          handle:         dto.handle,
          displayName:    dto.displayName,
          avatarUrl:      dto.avatarUrl,
          followersCount: dto.followersCount || 0,
        },
      }),
    );
  }

  async disconnect(userId: string, id: string) {
    const account = await this.prisma.socialAccount.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Account not found');
    await this.prisma.socialAccount.delete({ where: { id } });
    return { message: 'Account disconnected' };
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    const account = await this.prisma.socialAccount.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Account not found');

    const updateData: any = { ...dto };
    if (dto.accessToken  !== undefined) updateData.accessToken  = this.encryption.encrypt(dto.accessToken);
    if (dto.refreshToken !== undefined) updateData.refreshToken = this.encryption.encrypt(dto.refreshToken);
    return safeAccount(await this.prisma.socialAccount.update({ where: { id }, data: updateData }));
  }

  async getStats(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({ where: { userId, isActive: true } });
    const totalFollowers = accounts.reduce((s, a) => s + (a.followersCount || 0), 0);
    return {
      connected: accounts.length,
      totalFollowers,
      platforms: accounts.map(a => ({
        id:                a.id,
        platform:          a.platform,
        handle:            a.handle,
        displayName:       a.displayName,
        avatarUrl:         a.avatarUrl,
        followers:         a.followersCount,
        reconnectRequired: a.reconnectRequired,
        isActive:          a.isActive,
        tokenExpiresAt:    a.tokenExpiresAt,
      })),
    };
  }

  async getYoutubeInsights(userId: string) {
    const account = await this.prisma.socialAccount.findFirst({
      where: { userId, platform: 'YOUTUBE', isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!account) {
      throw new NotFoundException('YouTube account not connected');
    }

    let insights: any;
    try {
      const accessToken = await this.getValidYoutubeAccessToken(account);
      if (accessToken) {
        insights = await this.youtubeService.getMyChannelInsights(accessToken);
      }
    } catch (error: any) {
      this.logger.warn(`Falling back to API-key YouTube insights fetch: ${error?.message || 'unknown error'}`);
    }

    if (!insights) {
      const channelRef = account.platformUserId || normalizeYoutubeHandle(account.handle);
      if (!channelRef) {
        throw new NotFoundException('YouTube channel reference not available');
      }
      insights = await this.youtubeService.getChannelInsights(channelRef);
    }

    if (typeof insights?.channel?.subscriberCount === 'number' && insights.channel.subscriberCount !== account.followersCount) {
      await this.prisma.socialAccount.update({
        where: { id: account.id },
        data: { followersCount: insights.channel.subscriberCount },
      });
      account.followersCount = insights.channel.subscriberCount;
    }

    return {
      account: safeAccount(account),
      ...insights,
    };
  }

  private async getValidYoutubeAccessToken(account: {
    id: string;
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: Date | null;
  }) {
    const decryptedAccessToken = this.encryption.decrypt(account.accessToken);
    const decryptedRefreshToken = this.encryption.decrypt(account.refreshToken);
    const tokenExpired = !!account.tokenExpiresAt && account.tokenExpiresAt.getTime() <= Date.now() + 30_000;

    if (decryptedAccessToken && !tokenExpired) {
      return decryptedAccessToken;
    }

    if (!decryptedRefreshToken) {
      return decryptedAccessToken;
    }

    const refreshed = await this.refreshYoutubeAccessToken(decryptedRefreshToken);
    await this.prisma.socialAccount.update({
      where: { id: account.id },
      data: {
        accessToken: this.encryption.encrypt(refreshed.accessToken),
        tokenExpiresAt: refreshed.tokenExpiresAt,
        reconnectRequired: false,
        isActive: true,
      },
    });

    return refreshed.accessToken;
  }

  private async refreshYoutubeAccessToken(refreshToken: string) {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.config.get('GOOGLE_CLIENT_ID') || '',
        client_secret: this.config.get('GOOGLE_CLIENT_SECRET') || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });

    const tokens: any = await tokenRes.json();
    if (!tokenRes.ok || tokens.error) {
      this.logger.warn(`YouTube token refresh failed: ${tokens.error_description || tokens.error || tokenRes.status}`);
      throw new Error(tokens.error_description || tokens.error || 'Failed to refresh YouTube access token');
    }

    return {
      accessToken: tokens.access_token as string,
      tokenExpiresAt: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
    };
  }

  async getConnectedAccountWithTokens(userId: string, platform: Platform) {
    const account = await this.prisma.socialAccount.findFirst({
      where: { userId, platform, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!account) {
      throw new NotFoundException(`${platform} account not connected`);
    }

    return {
      account,
      accessToken: this.encryption.decrypt(account.accessToken),
      refreshToken: this.encryption.decrypt(account.refreshToken),
    };
  }

  // ─── YouTube OAuth Connect Flow ────────────────────────────────────────────

  /**
   * Step 1: Generate Google OAuth URL with YouTube scopes.
   * Frontend receives this URL and does window.location.href = url.
   */
  generateYoutubeConnectUrl(userId: string): { url: string } {
    const secret   = this.config.get<string>('JWT_ACCESS_SECRET')!;
    const state    = jwt.sign({ userId, purpose: 'yt-connect' }, secret, { expiresIn: '5m' });
    const callback = this.config.get('YOUTUBE_CONNECT_CALLBACK_URL')
      || 'http://localhost:4000/api/accounts/connect/youtube/callback';

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id',     this.config.get('GOOGLE_CLIENT_ID') || '');
    url.searchParams.set('redirect_uri',  callback);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload',
    ].join(' '));
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt',       'consent'); // forces refresh_token
    url.searchParams.set('state',        state);

    return { url: url.toString() };
  }

  /**
   * Step 2: Handle Google OAuth callback.
   * Validates state → exchanges code → fetches YouTube channel → saves SocialAccount.
   */
  async handleYoutubeCallback(code: string, stateToken: string): Promise<any> {
    // Validate state JWT
    const secret = this.config.get<string>('JWT_ACCESS_SECRET')!;
    let payload: any;
    try {
      payload = jwt.verify(stateToken, secret);
    } catch {
      throw new Error('Invalid or expired state token');
    }
    if (payload.purpose !== 'yt-connect') throw new Error('Invalid state purpose');
    const userId = payload.userId as string;

    const callback = this.config.get('YOUTUBE_CONNECT_CALLBACK_URL')
      || 'http://localhost:4000/api/accounts/connect/youtube/callback';

    // Exchange auth code for access + refresh tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     this.config.get('GOOGLE_CLIENT_ID') || '',
        client_secret: this.config.get('GOOGLE_CLIENT_SECRET') || '',
        redirect_uri:  callback,
        grant_type:    'authorization_code',
      }).toString(),
    });

    const tokens: any = await tokenRes.json();
    if (tokens.error) {
      this.logger.error(`Token exchange error: ${tokens.error_description || tokens.error}`);
      throw new Error(tokens.error_description || tokens.error);
    }

    // Fetch YouTube channel linked to this Google account
    const ytRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );
    const ytData: any = await ytRes.json();
    const channel = ytData.items?.[0];
    if (!channel) throw new Error('No YouTube channel found on this Google account');

    const tokenExpiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString();

    return this.connect(userId, {
      platform:       'YOUTUBE' as any,
      accessToken:    tokens.access_token,
      refreshToken:   tokens.refresh_token || undefined,
      handle:         normalizeYoutubeHandle(channel.snippet.customUrl) || `${channel.snippet.title}`,
      displayName:    channel.snippet.title,
      avatarUrl:      channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
      followersCount: parseInt(channel.statistics?.subscriberCount || '0', 10),
      platformUserId: channel.id,
      scopes:         (tokens.scope || '').split(' ').filter(Boolean),
      tokenExpiresAt,
    });
  }

  // ─── Internal use only (post scheduler, analytics sync) ────────────────────

  /** Get decrypted tokens for an account — NEVER expose via HTTP response */
  async getDecryptedTokens(id: string, userId: string): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    const account = await this.prisma.socialAccount.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Account not found');
    return {
      accessToken:  this.encryption.decrypt(account.accessToken),
      refreshToken: this.encryption.decrypt(account.refreshToken),
    };
  }

  /** Mark account as needing reconnect (called when token is rejected by platform API) */
  async markReconnectRequired(id: string) {
    return this.prisma.socialAccount.update({
      where: { id },
      data:  { reconnectRequired: true, isActive: false },
    });
  }
}
