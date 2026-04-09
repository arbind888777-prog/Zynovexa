// ============================================================
// Zynovexa - YouTube Data API v3 Service
// Fetches real channel stats, video details, and trending data
// Also: YouTube Analytics API for watch time, demographics, etc.
// ============================================================
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';
const YT_ANALYTICS_BASE = 'https://youtubeanalytics.googleapis.com/v2';

type YoutubeChannelDetails = {
  id: string;
  snippet: any;
  statistics: any;
  contentDetails?: any;
  brandingSettings?: any;
};

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('YOUTUBE_DATA_API_KEY', '');
  }

  private ensureKey() {
    if (!this.apiKey) {
      throw new HttpException(
        'YOUTUBE_DATA_API_KEY is not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async ytFetchWithAuth<T>(path: string, params: Record<string, string>, accessToken: string): Promise<T> {
    const url = new URL(`${YT_BASE}/${path}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as any;
      const msg = err?.error?.message || `YouTube API error ${res.status}`;
      this.logger.error(`YouTube OAuth API failure: ${msg}`);
      throw new HttpException(msg, res.status);
    }

    return res.json() as Promise<T>;
  }

  private mapVideoStats(items: any[]): any[] {
    return (items || []).map((v: any) => ({
      videoId: v.id,
      title: v.snippet.title,
      description: v.snippet.description?.slice(0, 300),
      publishedAt: v.snippet.publishedAt,
      channelTitle: v.snippet.channelTitle,
      thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
      duration: v.contentDetails.duration,
      tags: v.snippet.tags?.slice(0, 15) || [],
      viewCount: parseInt(v.statistics.viewCount || '0'),
      likeCount: parseInt(v.statistics.likeCount || '0'),
      commentCount: parseInt(v.statistics.commentCount || '0'),
      favoriteCount: parseInt(v.statistics.favoriteCount || '0'),
    }));
  }

  private async ytFetch<T>(path: string, params: Record<string, string>): Promise<T> {
    this.ensureKey();
    const url = new URL(`${YT_BASE}/${path}`);
    url.searchParams.set('key', this.apiKey);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as any;
      const msg = err?.error?.message || `YouTube API error ${res.status}`;
      this.logger.error(`YouTube API failure: ${msg}`);
      throw new HttpException(msg, res.status);
    }
    return res.json() as Promise<T>;
  }

  private async resolveChannel(channelIdOrHandle: string, includeContentDetails = false): Promise<YoutubeChannelDetails> {
    const isHandle = channelIdOrHandle.startsWith('@');
    const params: Record<string, string> = {
      part: includeContentDetails
        ? 'snippet,statistics,brandingSettings,contentDetails'
        : 'snippet,statistics,brandingSettings',
      maxResults: '1',
    };

    if (isHandle) {
      params.forHandle = channelIdOrHandle.replace('@', '');
    } else {
      params.id = channelIdOrHandle;
    }

    const data = await this.ytFetch<any>('channels', params);
    if (!data.items?.length) {
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    }

    return data.items[0] as YoutubeChannelDetails;
  }

  // ─── Channel stats by channel ID or handle (@handle) ──────────────────────
  async getChannelStats(channelId: string): Promise<any> {
    const ch = await this.resolveChannel(channelId);
    return {
      channelId: ch.id,
      title: ch.snippet.title,
      description: ch.snippet.description,
      customUrl: ch.snippet.customUrl,
      publishedAt: ch.snippet.publishedAt,
      thumbnail: ch.snippet.thumbnails?.high?.url || ch.snippet.thumbnails?.default?.url,
      country: ch.snippet.country,
      subscriberCount: parseInt(ch.statistics.subscriberCount || '0'),
      videoCount: parseInt(ch.statistics.videoCount || '0'),
      viewCount: parseInt(ch.statistics.viewCount || '0'),
      hiddenSubscriberCount: ch.statistics.hiddenSubscriberCount,
    };
  }

  async getChannelInsights(channelIdOrHandle: string, maxResults = 6): Promise<any> {
    const channel = await this.resolveChannel(channelIdOrHandle, true);
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    let recentVideos: any[] = [];
    let totals = {
      totalLikes: 0,
      totalComments: 0,
      totalVideoViews: 0,
    };

    if (uploadsPlaylistId) {
      const playlist = await this.ytFetch<any>('playlistItems', {
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: String(Math.min(maxResults, 10)),
      });

      const videoIds = (playlist.items || [])
        .map((item: any) => item.contentDetails?.videoId)
        .filter(Boolean)
        .join(',');

      if (videoIds) {
        recentVideos = await this.getVideoStats(videoIds);
        totals = recentVideos.reduce((acc, video) => ({
          totalLikes: acc.totalLikes + (video.likeCount || 0),
          totalComments: acc.totalComments + (video.commentCount || 0),
          totalVideoViews: acc.totalVideoViews + (video.viewCount || 0),
        }), totals);
      }
    }

    return {
      channel: {
        channelId: channel.id,
        title: channel.snippet.title,
        handle: channel.snippet.customUrl || null,
        description: channel.snippet.description,
        publishedAt: channel.snippet.publishedAt,
        thumbnail: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
        country: channel.snippet.country,
        subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics.videoCount || '0'),
        viewCount: parseInt(channel.statistics.viewCount || '0'),
      },
      totals,
      recentVideos,
    };
  }

  async getMyChannelInsights(accessToken: string, maxResults = 6): Promise<any> {
    const data = await this.ytFetchWithAuth<any>(
      'channels',
      {
        part: 'snippet,statistics,brandingSettings,contentDetails',
        mine: 'true',
        maxResults: '1',
      },
      accessToken,
    );

    const channel = data.items?.[0];
    if (!channel) {
      throw new HttpException('No YouTube channel found on this account', HttpStatus.NOT_FOUND);
    }

    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let recentVideos: any[] = [];
    let totals = {
      totalLikes: 0,
      totalComments: 0,
      totalVideoViews: 0,
    };

    if (uploadsPlaylistId) {
      const playlist = await this.ytFetchWithAuth<any>(
        'playlistItems',
        {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: String(Math.min(maxResults, 10)),
        },
        accessToken,
      );

      const videoIds = (playlist.items || [])
        .map((item: any) => item.contentDetails?.videoId)
        .filter(Boolean)
        .join(',');

      if (videoIds) {
        const videos = await this.ytFetchWithAuth<any>(
          'videos',
          {
            part: 'snippet,statistics,contentDetails',
            id: videoIds,
            maxResults: '50',
          },
          accessToken,
        );

        recentVideos = this.mapVideoStats(videos.items || []);
        totals = recentVideos.reduce((acc, video) => ({
          totalLikes: acc.totalLikes + (video.likeCount || 0),
          totalComments: acc.totalComments + (video.commentCount || 0),
          totalVideoViews: acc.totalVideoViews + (video.viewCount || 0),
        }), totals);
      }
    }

    return {
      channel: {
        channelId: channel.id,
        title: channel.snippet.title,
        handle: channel.snippet.customUrl ? `@${channel.snippet.customUrl.replace(/^@/, '')}` : null,
        description: channel.snippet.description,
        publishedAt: channel.snippet.publishedAt,
        thumbnail: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
        country: channel.snippet.country,
        subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics.videoCount || '0'),
        viewCount: parseInt(channel.statistics.viewCount || '0'),
      },
      totals,
      recentVideos,
    };
  }

  // ─── Video stats by video ID(s) (comma-separated) ─────────────────────────
  async getVideoStats(videoIds: string): Promise<any[]> {
    const data = await this.ytFetch<any>('videos', {
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
      maxResults: '50',
    });

    return this.mapVideoStats(data.items || []);
  }

  // ─── Search videos by keyword ──────────────────────────────────────────────
  async searchVideos(query: string, maxResults = 10): Promise<any[]> {
    const data = await this.ytFetch<any>('search', {
      part: 'snippet',
      q: query,
      type: 'video',
      order: 'relevance',
      maxResults: String(Math.min(maxResults, 50)),
    });

    return (data.items || []).map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description?.slice(0, 200),
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    }));
  }

  // ─── Trending videos (by region) ──────────────────────────────────────────
  async getTrendingVideos(regionCode = 'IN', maxResults = 10): Promise<any[]> {
    const data = await this.ytFetch<any>('videos', {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode,
      maxResults: String(Math.min(maxResults, 50)),
    });

    return (data.items || []).map((v: any) => ({
      videoId: v.id,
      title: v.snippet.title,
      channelTitle: v.snippet.channelTitle,
      publishedAt: v.snippet.publishedAt,
      thumbnail: v.snippet.thumbnails?.high?.url,
      viewCount: parseInt(v.statistics.viewCount || '0'),
      likeCount: parseInt(v.statistics.likeCount || '0'),
      commentCount: parseInt(v.statistics.commentCount || '0'),
      tags: v.snippet.tags?.slice(0, 10) || [],
    }));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // YouTube Analytics API (requires yt-analytics.readonly scope)
  // ═══════════════════════════════════════════════════════════════════════════

  private async ytAnalyticsFetch(params: Record<string, string>, accessToken: string): Promise<any> {
    const url = new URL(`${YT_ANALYTICS_BASE}/reports`);
    url.searchParams.set('ids', 'channel==MINE');
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as any;
      const msg = err?.error?.message || `YouTube Analytics API error ${res.status}`;
      this.logger.warn(`YouTube Analytics API failure: ${msg}`);
      throw new HttpException(msg, res.status);
    }

    return res.json();
  }

  /**
   * Overview analytics: views, watch time, subscribers gained/lost over a date range
   */
  async getAnalyticsOverview(accessToken: string, startDate: string, endDate: string): Promise<any> {
    const data = await this.ytAnalyticsFetch({
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,dislikes,comments,shares',
      dimensions: '',
    }, accessToken);

    const row = data.rows?.[0] || [];
    return {
      views: row[0] || 0,
      estimatedMinutesWatched: row[1] || 0,
      averageViewDuration: row[2] || 0,
      subscribersGained: row[3] || 0,
      subscribersLost: row[4] || 0,
      likes: row[5] || 0,
      dislikes: row[6] || 0,
      comments: row[7] || 0,
      shares: row[8] || 0,
    };
  }

  /**
   * Daily time series for views, watch time, subs over a date range
   */
  async getAnalyticsTimeSeries(accessToken: string, startDate: string, endDate: string): Promise<any[]> {
    const data = await this.ytAnalyticsFetch({
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched,subscribersGained,likes,comments',
      dimensions: 'day',
      sort: 'day',
    }, accessToken);

    return (data.rows || []).map((row: any[]) => ({
      date: row[0],
      views: row[1] || 0,
      estimatedMinutesWatched: row[2] || 0,
      subscribersGained: row[3] || 0,
      likes: row[4] || 0,
      comments: row[5] || 0,
    }));
  }

  /**
   * Content-level: per-video metrics (top videos by views)
   */
  async getAnalyticsTopVideos(accessToken: string, startDate: string, endDate: string, maxResults = 10): Promise<any[]> {
    const data = await this.ytAnalyticsFetch({
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,likes,comments,shares',
      dimensions: 'video',
      sort: '-views',
      maxResults: String(maxResults),
    }, accessToken);

    return (data.rows || []).map((row: any[]) => ({
      videoId: row[0],
      views: row[1] || 0,
      estimatedMinutesWatched: row[2] || 0,
      averageViewDuration: row[3] || 0,
      likes: row[4] || 0,
      comments: row[5] || 0,
      shares: row[6] || 0,
    }));
  }

  /**
   * Traffic sources: where viewers find your videos
   */
  async getAnalyticsTrafficSources(accessToken: string, startDate: string, endDate: string): Promise<any[]> {
    const data = await this.ytAnalyticsFetch({
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched',
      dimensions: 'insightTrafficSourceType',
      sort: '-views',
    }, accessToken);

    return (data.rows || []).map((row: any[]) => ({
      source: row[0],
      views: row[1] || 0,
      estimatedMinutesWatched: row[2] || 0,
    }));
  }

  /**
   * Audience demographics: age group + gender breakdown
   */
  async getAnalyticsDemographics(accessToken: string, startDate: string, endDate: string): Promise<any> {
    // Age groups
    let ageGroups: any[] = [];
    try {
      const ageData = await this.ytAnalyticsFetch({
        startDate,
        endDate,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup',
      }, accessToken);
      ageGroups = (ageData.rows || []).map((row: any[]) => ({
        ageGroup: row[0],
        viewerPercentage: row[1] || 0,
      }));
    } catch (e) {
      this.logger.warn('Age group demographics not available');
    }

    // Gender
    let genderBreakdown: any[] = [];
    try {
      const genderData = await this.ytAnalyticsFetch({
        startDate,
        endDate,
        metrics: 'viewerPercentage',
        dimensions: 'gender',
      }, accessToken);
      genderBreakdown = (genderData.rows || []).map((row: any[]) => ({
        gender: row[0],
        viewerPercentage: row[1] || 0,
      }));
    } catch (e) {
      this.logger.warn('Gender demographics not available');
    }

    return { ageGroups, genderBreakdown };
  }

  /**
   * Audience by country
   */
  async getAnalyticsCountries(accessToken: string, startDate: string, endDate: string): Promise<any[]> {
    const data = await this.ytAnalyticsFetch({
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched',
      dimensions: 'country',
      sort: '-views',
      maxResults: '25',
    }, accessToken);

    return (data.rows || []).map((row: any[]) => ({
      country: row[0],
      views: row[1] || 0,
      estimatedMinutesWatched: row[2] || 0,
    }));
  }

  /**
   * Audience by device type (MOBILE, DESKTOP, TV, TABLET, etc.)
   */
  async getAnalyticsDevices(accessToken: string, startDate: string, endDate: string): Promise<any[]> {
    const data = await this.ytAnalyticsFetch({
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched',
      dimensions: 'deviceType',
      sort: '-views',
    }, accessToken);

    return (data.rows || []).map((row: any[]) => ({
      device: row[0],
      views: row[1] || 0,
      estimatedMinutesWatched: row[2] || 0,
    }));
  }
}
