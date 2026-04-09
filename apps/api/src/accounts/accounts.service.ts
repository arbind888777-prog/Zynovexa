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
import { buildApiCallbackUrl, sanitizeFrontendUrl } from '../common/utils/frontend-url';

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

type InstagramGraphProfile = {
  id: string;
  username?: string;
  account_type?: string;
  media_count?: number;
};

type FacebookGraphPage = {
  id: string;
  name?: string;
  access_token?: string;
  category?: string;
  instagram_business_account?: {
    id: string;
    username?: string;
    profile_picture_url?: string;
  };
};

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

  async getYoutubeInsights(userId: string, accountId?: string) {
    const account = accountId
      ? await this.prisma.socialAccount.findFirst({
          where: { id: accountId, userId, platform: 'YOUTUBE', isActive: true },
        })
      : await this.prisma.socialAccount.findFirst({
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

  /**
   * Deep analytics for any connected account (YouTube supported).
   * Returns overview, content, audience data for the 3-tab analytics panel.
   */
  async getAccountInsights(userId: string, accountId: string) {
    const account = await this.prisma.socialAccount.findFirst({
      where: { id: accountId, userId, isActive: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.platform === 'YOUTUBE') {
      return this.getYoutubeDeepInsights(account);
    }

    // For other platforms, return basic data from DB
    return {
      account: safeAccount(account),
      platform: account.platform,
      overview: {
        followers: account.followersCount || 0,
        posts: account.postsCount || 0,
      },
      content: { topVideos: [], trafficSources: [] },
      audience: { demographics: { ageGroups: [], genderBreakdown: [] }, countries: [], devices: [] },
      analyticsAvailable: false,
      message: `${account.platform} deep analytics coming soon. Currently only YouTube has full analytics support.`,
    };
  }

  private async getYoutubeDeepInsights(account: any) {
    let accessToken: string | null = null;
    try {
      accessToken = await this.getValidYoutubeAccessToken(account);
    } catch (e) {
      this.logger.warn(`Failed to get valid YouTube access token for deep insights: ${e}`);
    }

    // Get basic channel insights (Data API)
    let channelInsights: any = null;
    try {
      if (accessToken) {
        channelInsights = await this.youtubeService.getMyChannelInsights(accessToken);
      }
    } catch (e) {
      this.logger.warn(`Falling back to API-key fetch for channel insights`);
    }

    if (!channelInsights) {
      const channelRef = account.platformUserId || account.handle?.replace(/^@/, '');
      if (channelRef) {
        try {
          channelInsights = await this.youtubeService.getChannelInsights(channelRef);
        } catch (e) {
          this.logger.warn(`Channel insights fetch failed: ${e}`);
        }
      }
    }

    // Get YouTube Analytics API data (requires yt-analytics.readonly scope)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate28 = new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0];
    const startDate90 = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];

    let analyticsOverview: any = null;
    let timeSeries: any[] = [];
    let topVideos: any[] = [];
    let trafficSources: any[] = [];
    let demographics: any = { ageGroups: [], genderBreakdown: [] };
    let countries: any[] = [];
    let devices: any[] = [];
    let analyticsAvailable = false;

    if (accessToken) {
      try {
        [analyticsOverview, timeSeries, topVideos, trafficSources, demographics, countries, devices] = await Promise.all([
          this.youtubeService.getAnalyticsOverview(accessToken, startDate28, endDate).catch(() => null),
          this.youtubeService.getAnalyticsTimeSeries(accessToken, startDate28, endDate).catch(() => []),
          this.youtubeService.getAnalyticsTopVideos(accessToken, startDate90, endDate).catch(() => []),
          this.youtubeService.getAnalyticsTrafficSources(accessToken, startDate28, endDate).catch(() => []),
          this.youtubeService.getAnalyticsDemographics(accessToken, startDate28, endDate).catch(() => ({ ageGroups: [], genderBreakdown: [] })),
          this.youtubeService.getAnalyticsCountries(accessToken, startDate28, endDate).catch(() => []),
          this.youtubeService.getAnalyticsDevices(accessToken, startDate28, endDate).catch(() => []),
        ]);
        analyticsAvailable = !!analyticsOverview;
      } catch (e) {
        this.logger.warn(`YouTube Analytics API not available: ${e}`);
      }
    }

    // Enrich top videos with titles/thumbnails from Data API
    if (topVideos.length > 0 && accessToken) {
      try {
        const videoIds = topVideos.map(v => v.videoId).join(',');
        const videoDetails = await this.youtubeService.getVideoStats(videoIds);
        const detailMap = new Map(videoDetails.map((v: any) => [v.videoId, v]));
        topVideos = topVideos.map(v => ({
          ...v,
          title: detailMap.get(v.videoId)?.title || v.videoId,
          thumbnail: detailMap.get(v.videoId)?.thumbnail || null,
          publishedAt: detailMap.get(v.videoId)?.publishedAt || null,
        }));
      } catch (e) {
        // Fine — continue with videoIds only
      }
    }

    return {
      account: safeAccount(account),
      platform: 'YOUTUBE',
      analyticsAvailable,
      overview: {
        channel: channelInsights?.channel || null,
        totals: channelInsights?.totals || null,
        analytics: analyticsOverview,
        timeSeries,
      },
      content: {
        recentVideos: channelInsights?.recentVideos || [],
        topVideos,
        trafficSources,
      },
      audience: {
        demographics,
        countries,
        devices,
      },
    };
  }

  async connectInstagramWithConfiguredToken(userId: string) {
    const configuredToken = this.getConfiguredMetaGraphToken();

    if (!configuredToken) {
      throw new NotFoundException('INSTAGRAM_GRAPH_API_TOKEN is not configured on the API server');
    }

    const profile = await this.fetchInstagramGraphProfile(configuredToken);
    const hasFacebookPages = !profile ? await this.hasFacebookPages(configuredToken) : false;
    const fallbackPage = !profile ? await this.fetchInstagramBusinessPage(configuredToken) : null;

    if (!profile && !fallbackPage) {
      throw new NotFoundException(hasFacebookPages
        ? 'Configured token is valid for Facebook Pages, but no linked Instagram business account was found.'
        : 'Configured Instagram token could not fetch an Instagram profile. Verify token scopes and account access.');
    }

    const username = profile?.username || fallbackPage?.instagram_business_account?.username || fallbackPage?.name;
    const handle = username ? `@${username.replace(/^@/, '')}` : '@instagram';

    const connectedAccount = await this.connect(userId, {
      platform: 'INSTAGRAM' as Platform,
      accessToken: fallbackPage?.access_token || configuredToken,
      handle,
      displayName: username || 'Instagram Account',
      avatarUrl: fallbackPage?.instagram_business_account?.profile_picture_url,
      followersCount: 0,
      platformUserId: profile?.id || fallbackPage?.instagram_business_account?.id || fallbackPage?.id,
      scopes: profile ? ['instagram_basic'] : ['pages_show_list', 'instagram_basic'],
    });

    return {
      account: connectedAccount,
      source: profile ? 'instagram-graph' : 'facebook-graph',
      profile: profile || {
        id: fallbackPage?.instagram_business_account?.id || fallbackPage?.id,
        username,
      },
    };
  }

  async connectFacebookWithConfiguredToken(userId: string) {
    const configuredToken = this.getConfiguredMetaGraphToken();

    if (!configuredToken) {
      throw new NotFoundException('FACEBOOK_GRAPH_API_TOKEN or INSTAGRAM_GRAPH_API_TOKEN is not configured on the API server');
    }

    const pages = await this.fetchFacebookPages(configuredToken);
    const page = pages.find((item) => item.access_token) || pages[0];

    if (!page) {
      throw new NotFoundException('Configured token could not fetch any Facebook Pages');
    }

    const connectedAccount = await this.connect(userId, {
      platform: 'FACEBOOK' as Platform,
      accessToken: page.access_token || configuredToken,
      handle: page.name || 'Facebook Page',
      displayName: page.name || 'Facebook Page',
      avatarUrl: `https://graph.facebook.com/v18.0/${page.id}/picture?type=large`,
      followersCount: 0,
      platformUserId: page.id,
      scopes: ['pages_show_list'],
    });

    return {
      account: connectedAccount,
      page: {
        id: page.id,
        name: page.name,
        category: page.category,
      },
      source: 'facebook-graph',
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
  generateYoutubeConnectUrl(userId: string, frontendUrl?: string): { url: string } {
    const secret   = this.config.get<string>('JWT_ACCESS_SECRET')!;
    const safeFrontendUrl = sanitizeFrontendUrl(frontendUrl, this.config.get<string>('FRONTEND_URL'));
    // YOUTUBE_CONNECT_CALLBACK_URL explicitly overrides the auto-generated callback URL.
    // This ensures the registered redirect URI in Google Cloud Console is always used.
    const explicitCallback = this.config.get<string>('YOUTUBE_CONNECT_CALLBACK_URL')?.trim();
    const callback = explicitCallback || buildApiCallbackUrl(
      safeFrontendUrl,
      '/api/accounts/connect/youtube/callback',
      this.config.get<string>('API_URL') || this.config.get<string>('BACKEND_URL') || undefined,
    );
    const state = jwt.sign({ userId, purpose: 'yt-connect', frontendUrl: safeFrontendUrl, callbackUrl: callback }, secret, { expiresIn: '5m' });

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
      'https://www.googleapis.com/auth/yt-analytics.readonly',
    ].join(' '));
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt',       'consent'); // forces refresh_token
    url.searchParams.set('state',        state);

    return { url: url.toString() };
  }

  private getConfiguredMetaGraphToken() {
    return this.config.get<string>('FACEBOOK_GRAPH_API_TOKEN')?.trim()
      || this.config.get<string>('INSTAGRAM_GRAPH_API_TOKEN')?.trim()
      || '';
  }

  private async fetchInstagramGraphProfile(accessToken: string): Promise<InstagramGraphProfile | null> {
    const response = await fetch(
      `https://graph.instagram.com/me?${new URLSearchParams({
        fields: 'id,username,account_type,media_count',
        access_token: accessToken,
      }).toString()}`,
    );

    const payload: any = await response.json().catch(() => null);
    if (!response.ok || payload?.error || !payload?.id) {
      this.logger.warn(
        `Instagram Graph profile lookup failed: ${payload?.error?.message || response.statusText || 'unknown error'}`,
      );
      return null;
    }

    return payload as InstagramGraphProfile;
  }

  private async hasFacebookPages(accessToken: string): Promise<boolean> {
    const pages = await this.fetchFacebookPages(accessToken);
    return pages.length > 0;
  }

  private async fetchFacebookPages(accessToken: string): Promise<FacebookGraphPage[]> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?${new URLSearchParams({
        fields: 'id,name,category,access_token',
        access_token: accessToken,
      }).toString()}`,
    );

    const payload: any = await response.json().catch(() => null);
    if (!response.ok || payload?.error || !Array.isArray(payload?.data)) {
      this.logger.warn(
        `Facebook page list lookup failed: ${payload?.error?.message || response.statusText || 'unknown error'}`,
      );
      return [];
    }

    return payload.data as FacebookGraphPage[];
  }

  private async fetchInstagramBusinessPage(accessToken: string): Promise<FacebookGraphPage | null> {
    const pages = await this.fetchFacebookPages(accessToken);

    if (pages.length === 0) {
      this.logger.warn(
        'Facebook page lookup for Instagram fallback failed: no Facebook pages found',
      );
      return null;
    }

    for (const page of pages) {
      if (!page.access_token) {
        continue;
      }

      const pageResponse = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?${new URLSearchParams({
          fields: 'instagram_business_account{id,username,profile_picture_url}',
          access_token: page.access_token,
        }).toString()}`,
      );
      const pagePayload: any = await pageResponse.json().catch(() => null);

      if (pageResponse.ok && pagePayload?.instagram_business_account?.id) {
        return {
          ...page,
          instagram_business_account: pagePayload.instagram_business_account,
        };
      }
    }

    this.logger.warn('Facebook pages found, but none expose a linked Instagram business account');
    return null;
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
    const frontendUrl = sanitizeFrontendUrl(payload.frontendUrl, this.config.get<string>('FRONTEND_URL'));
    const explicitCallback = this.config.get<string>('YOUTUBE_CONNECT_CALLBACK_URL')?.trim();
    const callback = (typeof payload.callbackUrl === 'string' && payload.callbackUrl.trim())
      ? payload.callbackUrl
      : (explicitCallback || buildApiCallbackUrl(
          frontendUrl,
          '/api/accounts/connect/youtube/callback',
          this.config.get<string>('API_URL') || this.config.get<string>('BACKEND_URL') || undefined,
        ));

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

    const account = await this.connect(userId, {
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

    return {
      account,
      frontendUrl,
    };
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
