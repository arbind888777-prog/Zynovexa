import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoMetadataDto, UpdateVideoMetricsDto, VideoQueryDto } from './dto/video-analytics.dto';

@Injectable()
export class VideoAnalyticsService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async createVideo(userId: string, dto: CreateVideoMetadataDto) {
    return this.prisma.videoMetadata.create({
      data: {
        userId,
        postId: dto.postId,
        platform: dto.platform as any,
        videoUrl: dto.videoUrl,
        title: dto.title,
        duration: dto.duration,
        thumbnailUrl: dto.thumbnailUrl,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      },
    });
  }

  async getVideos(userId: string, query: VideoQueryDto) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.platform) where.platform = query.platform;

    const orderBy: any = {};
    switch (query.sortBy) {
      case 'views': orderBy.views = 'desc'; break;
      case 'likes': orderBy.likes = 'desc'; break;
      case 'engagement': orderBy.shares = 'desc'; break;
      case 'watchTime': orderBy.watchTime = 'desc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const [videos, total] = await Promise.all([
      this.prisma.videoMetadata.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.videoMetadata.count({ where }),
    ]);

    return {
      videos,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getVideo(id: string, userId: string) {
    const video = await this.prisma.videoMetadata.findFirst({ where: { id, userId } });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async updateMetrics(id: string, userId: string, dto: UpdateVideoMetricsDto) {
    await this.getVideo(id, userId);
    return this.prisma.videoMetadata.update({ where: { id }, data: dto });
  }

  async deleteVideo(id: string, userId: string) {
    await this.getVideo(id, userId);
    await this.prisma.videoMetadata.delete({ where: { id } });
    return { message: 'Video metadata deleted' };
  }

  // ─── Analytics ─────────────────────────────────────────────────────────────

  async getVideoPerformanceOverview(userId: string) {
    const videos = await this.prisma.videoMetadata.findMany({ where: { userId } });

    if (videos.length === 0) {
      return {
        totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0,
        totalShares: 0, totalWatchTime: 0, avgRetentionRate: 0,
        avgClickThroughRate: 0, platformBreakdown: {},
      };
    }

    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
    const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
    const totalComments = videos.reduce((sum, v) => sum + v.comments, 0);
    const totalShares = videos.reduce((sum, v) => sum + v.shares, 0);
    const totalWatchTime = videos.reduce((sum, v) => sum + v.watchTime, 0);
    const avgRetentionRate = +(videos.reduce((sum, v) => sum + v.retentionRate, 0) / videos.length).toFixed(2);
    const avgClickThroughRate = +(videos.reduce((sum, v) => sum + v.clickThroughRate, 0) / videos.length).toFixed(2);

    // Platform breakdown
    const platformBreakdown: Record<string, any> = {};
    for (const video of videos) {
      const p = video.platform;
      if (!platformBreakdown[p]) {
        platformBreakdown[p] = { count: 0, views: 0, likes: 0, watchTime: 0 };
      }
      platformBreakdown[p].count++;
      platformBreakdown[p].views += video.views;
      platformBreakdown[p].likes += video.likes;
      platformBreakdown[p].watchTime += video.watchTime;
    }

    return {
      totalVideos: videos.length,
      totalViews, totalLikes, totalComments, totalShares,
      totalWatchTime: +totalWatchTime.toFixed(2),
      totalWatchTimeHours: +(totalWatchTime / 3600).toFixed(2),
      avgRetentionRate, avgClickThroughRate,
      avgViewsPerVideo: +(totalViews / videos.length).toFixed(0),
      platformBreakdown,
    };
  }

  async getTopPerformingVideos(userId: string, limit = 10) {
    return this.prisma.videoMetadata.findMany({
      where: { userId },
      orderBy: { views: 'desc' },
      take: limit,
      include: { post: { select: { title: true, caption: true, viralScore: true } } },
    });
  }

  async getVideoGrowthTrend(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const videos = await this.prisma.videoMetadata.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, views: true, likes: true, shares: true, platform: true },
    });

    // Group by date
    const trend: Record<string, { views: number; likes: number; shares: number; count: number }> = {};
    for (const v of videos) {
      const date = v.createdAt.toISOString().slice(0, 10);
      if (!trend[date]) trend[date] = { views: 0, likes: 0, shares: 0, count: 0 };
      trend[date].views += v.views;
      trend[date].likes += v.likes;
      trend[date].shares += v.shares;
      trend[date].count++;
    }

    return Object.entries(trend)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getRetentionAnalysis(userId: string) {
    const videos = await this.prisma.videoMetadata.findMany({
      where: { userId, retentionRate: { gt: 0 } },
      select: { platform: true, duration: true, retentionRate: true, avgViewDuration: true, views: true },
    });

    // Group by duration bucket
    const buckets = [
      { label: '0-15s', min: 0, max: 15 },
      { label: '15-30s', min: 15, max: 30 },
      { label: '30-60s', min: 30, max: 60 },
      { label: '1-3min', min: 60, max: 180 },
      { label: '3-10min', min: 180, max: 600 },
      { label: '10min+', min: 600, max: Infinity },
    ];

    const analysis = buckets.map(bucket => {
      const matching = videos.filter(v => v.duration >= bucket.min && v.duration < bucket.max);
      const avgRetention = matching.length > 0
        ? +(matching.reduce((s, v) => s + v.retentionRate, 0) / matching.length).toFixed(2)
        : 0;
      return {
        durationBucket: bucket.label,
        videoCount: matching.length,
        avgRetentionRate: avgRetention,
        avgViews: matching.length > 0
          ? +(matching.reduce((s, v) => s + v.views, 0) / matching.length).toFixed(0)
          : 0,
      };
    });

    return { analysis, totalVideosAnalyzed: videos.length };
  }
}
