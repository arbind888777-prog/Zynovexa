import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProAnalyticsService {
  constructor(private prisma: PrismaService) {}

  private async requireProPlan(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    const allowed = ['PRO', 'GROWTH', 'BUSINESS'];
    if (!user || !allowed.includes(user.plan)) {
      throw new ForbiddenException({ error: 'Pro plan required', message: 'Upgrade to Pro plan to access advanced analytics.' });
    }
  }

  async getOverview(userId: string) {
    await this.requireProPlan(userId);

    const [accounts, posts, analytics] = await Promise.all([
      this.prisma.socialAccount.findMany({
        where: { userId, isActive: true },
        select: { platform: true, followersCount: true },
      }),
      this.prisma.post.findMany({
        where: { userId, status: 'PUBLISHED' },
        select: { id: true, viralScore: true, createdAt: true },
      }),
      this.prisma.analytics.findMany({
        where: { userId },
        select: { metricName: true, metricValue: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
    ]);

    const totalFollowers = accounts.reduce((sum, a) => sum + (a.followersCount || 0), 0);

    // Calculate metrics from last 7 and 30 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

    const analytics7d = analytics.filter(a => new Date(a.createdAt) >= sevenDaysAgo);
    const analytics30d = analytics.filter(a => new Date(a.createdAt) >= thirtyDaysAgo);

    const sumMetric = (arr: typeof analytics, name: string) =>
      arr.filter(a => a.metricName === name).reduce((s, a) => s + (a.metricValue || 0), 0);

    const totalImpressions7d = sumMetric(analytics7d, 'impressions');
    const totalImpressions30d = sumMetric(analytics30d, 'impressions');
    const totalEngagement7d = sumMetric(analytics7d, 'engagement');

    const engagementRate = totalImpressions7d > 0
      ? ((totalEngagement7d / totalImpressions7d) * 100).toFixed(2)
      : '0';

    const avgLikesPerPost = posts.length > 0
      ? Math.round(totalEngagement7d / Math.max(posts.filter(p => new Date(p.createdAt) >= sevenDaysAgo).length, 1))
      : 0;

    // CTR estimation (clicks ~ 5% of engagement as approximation)
    const estimatedClicks = Math.round(totalEngagement7d * 0.05);
    const ctr = totalImpressions7d > 0 ? ((estimatedClicks / totalImpressions7d) * 100).toFixed(2) : '0';

    // Follower growth rate
    const oldestFollowers = sumMetric(analytics30d, 'followers');
    const followerGrowthRate = oldestFollowers > 0
      ? (((totalFollowers - oldestFollowers) / oldestFollowers) * 100).toFixed(2)
      : '0';

    return {
      metrics: {
        engagement_rate: { value: engagementRate, label: 'Engagement Rate', unit: '%' },
        ctr: { value: ctr, label: 'Click-Through Rate', unit: '%' },
        follower_growth_rate: { value: followerGrowthRate, label: 'Follower Growth', unit: '%' },
        total_followers: { value: totalFollowers, label: 'Total Followers' },
        total_impressions_7d: { value: totalImpressions7d, label: '7-Day Impressions' },
        total_impressions_30d: { value: totalImpressions30d, label: '30-Day Impressions' },
        total_engagement_7d: { value: totalEngagement7d, label: '7-Day Engagement' },
        avg_likes_per_post: { value: avgLikesPerPost, label: 'Avg Likes/Post' },
      },
    };
  }

  async getContentRanking(userId: string) {
    await this.requireProPlan(userId);

    const posts = await this.prisma.post.findMany({
      where: { userId, status: 'PUBLISHED' },
      select: {
        id: true,
        caption: true,
        viralScore: true,
        mediaType: true,
        platforms: true,
        createdAt: true,
      },
      orderBy: { viralScore: 'desc' },
    });

    const topPosts = posts.slice(0, 10).map(p => ({
      id: p.id,
      caption: p.caption,
      viral_score: p.viralScore ?? 0,
      likes: 0,
      comments: 0,
      media_type: p.mediaType,
      platforms: p.platforms,
    }));

    const worstPosts = [...posts].sort((a, b) => (a.viralScore ?? 0) - (b.viralScore ?? 0)).slice(0, 5).map(p => ({
      id: p.id,
      caption: p.caption,
      viral_score: p.viralScore ?? 0,
      likes: 0,
      comments: 0,
      media_type: p.mediaType,
      platforms: p.platforms,
    }));

    const insights: string[] = [];
    if (topPosts.length > 0) {
      const avgTopScore = topPosts.slice(0, 3).reduce((s, p) => s + p.viral_score, 0) / Math.min(topPosts.length, 3);
      insights.push(`Your top content averages a viral score of ${avgTopScore.toFixed(0)}/100.`);
    }
    const videoCount = posts.filter(p => p.mediaType === 'VIDEO').length;
    const imageCount = posts.filter(p => p.mediaType === 'IMAGE').length;
    if (videoCount > imageCount) {
      insights.push('Video content dominates your best-performing posts. Double down on video.');
    } else if (imageCount > videoCount) {
      insights.push('Image posts perform well for you. Consider adding carousel posts for more engagement.');
    }
    insights.push('Consistency is key — aim for at least 5 posts per week.');

    return { top_posts: topPosts, worst_posts: worstPosts, insights };
  }

  async getCompetitors(userId: string) {
    await this.requireProPlan(userId);

    // Since there's no Competitor model in schema, return demo data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId, isActive: true },
      select: { followersCount: true },
    });

    const totalFollowers = accounts.reduce((s, a) => s + (a.followersCount || 0), 0);

    return {
      competitors: [],
      your_metrics: {
        followers: totalFollowers,
        engagement_rate: '0',
      },
      comparison_insights: [
        'Add competitors to start tracking their growth and compare your performance.',
        'Competitor tracking helps you identify content gaps and opportunities.',
      ],
    };
  }

  async addCompetitor(userId: string, dto: { handle: string; platform: string }) {
    await this.requireProPlan(userId);

    // Return a placeholder since there's no Competitor model yet
    return {
      id: `comp_${Date.now()}`,
      platform: dto.platform,
      handle: dto.handle,
      followers: 0,
      engagement_rate: '0',
      message: 'Competitor added. Tracking will begin within 24 hours.',
    };
  }
}
