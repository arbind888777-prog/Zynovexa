import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string, query: AnalyticsQueryDto) {
    const { from, to } = this.getDateRange(query.period || '30d', query.from, query.to);

    const [posts, accounts, analytics] = await Promise.all([
      this.prisma.post.findMany({ where: { userId, createdAt: { gte: from, lte: to } } }),
      this.prisma.socialAccount.findMany({ where: { userId, isActive: true } }),
      this.prisma.analytics.findMany({ where: { userId, createdAt: { gte: from, lte: to }, ...(query.platform ? { platform: query.platform } : {}) } }),
    ]);

    const totalFollowers = accounts.reduce((s, a) => s + (a.followersCount || 0), 0);
    const totalImpressions = analytics.filter(a => a.metricName === 'impressions').reduce((s, a) => s + a.metricValue, 0);
    const totalEngagements = analytics.filter(a => a.metricName === 'engagements').reduce((s, a) => s + a.metricValue, 0);
    const avgEngagementRate = totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100).toFixed(2) : '0.00';

    return {
      totalFollowers,
      totalImpressions,
      totalEngagements,
      avgEngagementRate: parseFloat(avgEngagementRate),
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.status === 'PUBLISHED').length,
    };
  }

  async getChartData(userId: string, query: AnalyticsQueryDto) {
    const { from, to } = this.getDateRange(query.period || '30d', query.from, query.to);

    const analytics = await this.prisma.analytics.findMany({
      where: { userId, createdAt: { gte: from, lte: to }, ...(query.platform ? { platform: query.platform } : {}) },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const byDate: Record<string, { date: string; impressions: number; engagements: number; reach: number }> = {};
    for (const a of analytics) {
      const date = a.createdAt.toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = { date, impressions: 0, engagements: 0, reach: 0 };
      if (a.metricName === 'impressions') byDate[date].impressions += a.metricValue;
      if (a.metricName === 'engagements') byDate[date].engagements += a.metricValue;
      if (a.metricName === 'reach') byDate[date].reach += a.metricValue;
    }

    return { chartData: Object.values(byDate) };
  }

  async getPlatformBreakdown(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({ where: { userId, isActive: true } });

    const platformStats = await Promise.all(accounts.map(async acc => {
      const analytics = await this.prisma.analytics.findMany({
        where: { userId, platform: acc.platform, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      });
      const impressions = analytics.filter(a => a.metricName === 'impressions').reduce((s, a) => s + a.metricValue, 0);
      const engagements = analytics.filter(a => a.metricName === 'engagements').reduce((s, a) => s + a.metricValue, 0);
      return { platform: acc.platform, handle: acc.handle, followers: acc.followersCount, impressions, engagements };
    }));

    return platformStats;
  }

  async getTopPosts(userId: string, limit = 10) {
    return this.prisma.post.findMany({
      where: { userId, status: 'PUBLISHED' },
      orderBy: { viralScore: 'desc' },
      take: limit,
      select: { id: true, title: true, caption: true, platforms: true, viralScore: true, scheduledAt: true, mediaType: true },
    });
  }

  async recordMetric(userId: string, platform: any, postId: string | null, metricName: string, metricValue: number) {
    return this.prisma.analytics.create({
      data: { userId, platform, postId, metricName, metricValue },
    });
  }

  private getDateRange(period: string, fromStr?: string, toStr?: string) {
    const to = toStr ? new Date(toStr) : new Date();
    let from: Date;
    if (fromStr) { from = new Date(fromStr); }
    else {
      from = new Date();
      if (period === '7d') from.setDate(from.getDate() - 7);
      else if (period === '30d') from.setDate(from.getDate() - 30);
      else if (period === '90d') from.setDate(from.getDate() - 90);
      else if (period === '1y') from.setFullYear(from.getFullYear() - 1);
    }
    return { from, to };
  }
}
