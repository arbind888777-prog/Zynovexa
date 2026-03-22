import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface Recommendation {
  type: string;
  icon: string;
  title: string;
  description: string;
  action?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

@Injectable()
export class GrowthCoachService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async getDailyRecommendations(userId: string) {
    const [user, recentPosts, accounts] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { niche: true, plan: true, timezone: true } }),
      this.prisma.post.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, caption: true, viralScore: true, status: true, createdAt: true, platforms: true } }),
      this.prisma.socialAccount.findMany({ where: { userId, isActive: true }, select: { platform: true, followersCount: true } }),
    ]);

    const niche = user?.niche || 'general';
    const connectedPlatforms = accounts.map((a) => a.platform.toLowerCase());
    const recommendations: Recommendation[] = [];

    // What to post
    const contentIdea = this.getContentIdea(niche, connectedPlatforms);
    recommendations.push({
      type: 'what_to_post',
      icon: '📝',
      title: contentIdea.title,
      description: contentIdea.description,
      action: contentIdea.action,
      priority: 'high',
    });

    // When to post
    const bestTime = this.getBestPostingTime(niche);
    recommendations.push({
      type: 'when_to_post',
      icon: '⏰',
      title: `Best time to post today: ${bestTime.time}`,
      description: bestTime.reason,
      action: 'Schedule a post for this time slot',
      priority: 'high',
    });

    // Why it works (algorithm insight)
    recommendations.push({
      type: 'why_it_works',
      icon: '💡',
      title: 'Algorithm insight for today',
      description: this.getAlgorithmInsight(connectedPlatforms),
      priority: 'medium',
    });

    // Posting consistency check
    const lastPost = recentPosts[0];
    if (lastPost) {
      const daysSince = Math.floor((Date.now() - new Date(lastPost.createdAt).getTime()) / 86400000);
      if (daysSince >= 2) {
        recommendations.unshift({
          type: 'streak_warning',
          icon: '🔥',
          title: daysSince >= 7
            ? `You haven't posted in ${daysSince} days! Get back on track.`
            : 'Post today to maintain your streak!',
          description: 'Consistent posting is the #1 growth driver. Even a simple story counts.',
          action: 'Create a quick post now',
          priority: 'critical',
        });
      }
    }

    // Performance-based suggestion
    if (recentPosts.length > 0) {
      const avgScore = recentPosts.reduce((s, p) => s + (p.viralScore ?? 0), 0) / recentPosts.length;
      if (avgScore < 60) {
        recommendations.push({
          type: 'improvement',
          icon: '📈',
          title: 'Improve your content quality',
          description: `Your average viral score is ${avgScore.toFixed(0)}/100. Try using stronger hooks and asking questions.`,
          priority: 'high',
        });
      }
    }

    return { recommendations, context: { niche, totalPosts: recentPosts.length } };
  }

  async getWeeklyReport(userId: string) {
    const weekAgo = new Date(Date.now() - 7 * 86400000);

    const [postsThisWeek, analytics, user] = await Promise.all([
      this.prisma.post.count({ where: { userId, createdAt: { gte: weekAgo } } }),
      this.prisma.analytics.findMany({ where: { userId, createdAt: { gte: weekAgo } }, select: { metricName: true, metricValue: true } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { niche: true } }),
    ]);

    const metrics: Record<string, number> = {};
    analytics.forEach((a) => { metrics[a.metricName] = (metrics[a.metricName] ?? 0) + a.metricValue; });

    const totalEngagement = (metrics['likes'] ?? 0) + (metrics['comments'] ?? 0) + (metrics['shares'] ?? 0);
    const impressions = metrics['impressions'] ?? 0;
    const engagementRate = impressions > 0 ? (totalEngagement / impressions) * 100 : 0;

    const suggestions: string[] = [];
    if (postsThisWeek < 3) suggestions.push('Post at least 5 times per week for optimal growth');
    if (engagementRate < 3) suggestions.push('Add engaging questions in your captions to boost comments');
    if (!metrics['shares'] || metrics['shares'] < 10) suggestions.push('Create shareable content like tips, quotes, or controversial takes');
    if (impressions < 1000) suggestions.push('Use trending hashtags and post during peak hours (6-8 PM)');
    suggestions.push('Experiment with Reels/Shorts — they get 2-3x more reach');

    const report = {
      period: { start: weekAgo.toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] },
      postsCreated: postsThisWeek,
      totalImpressions: impressions,
      totalEngagement,
      engagementRate: +engagementRate.toFixed(1),
      followerChange: metrics['followers'] ?? 0,
      suggestions,
      summary: this.generateWeeklySummary(postsThisWeek, impressions, totalEngagement, engagementRate),
    };

    return report;
  }

  // ── Helpers ─────────────────────────────────────────────

  private getContentIdea(niche: string, platforms: string[]) {
    const ideas: Record<string, { title: string; description: string; action: string }> = {
      lifestyle: { title: 'Create a "Day in my life" reel', description: 'Behind-the-scenes content sees 3.2x higher engagement.', action: 'Generate AI caption for lifestyle reel' },
      tech: { title: 'Share a quick tech tip or tool review', description: 'Short actionable tech tips get the highest save rate.', action: 'Generate AI script for tech tip video' },
      fitness: { title: 'Post a workout transformation or tip', description: 'Before/after content drives massive engagement in fitness.', action: 'Generate AI caption for fitness post' },
      food: { title: 'Share a recipe reel with close-up shots', description: 'Recipe videos under 60 seconds get 4x more shares.', action: 'Generate AI script for recipe video' },
      general: { title: 'Share your best tip from this week', description: 'Value-driven content consistently outperforms.', action: 'Generate AI caption for value post' },
    };
    return ideas[niche] ?? ideas.general;
  }

  private getBestPostingTime(niche: string) {
    const times: Record<string, { time: string; reason: string }> = {
      lifestyle: { time: '7:00 PM - 9:00 PM', reason: 'Lifestyle audiences scroll most during evening hours.' },
      tech: { time: '8:00 AM - 10:00 AM', reason: 'Tech professionals check social media during morning commute.' },
      fitness: { time: '6:00 AM - 8:00 AM', reason: 'Fitness enthusiasts are most active during morning workout planning.' },
      food: { time: '11:00 AM - 1:00 PM', reason: 'Food content peaks during lunch hour.' },
      general: { time: '6:00 PM - 8:00 PM', reason: 'General audiences are most active during evening leisure.' },
    };
    return times[niche] ?? times.general;
  }

  private getAlgorithmInsight(platforms: string[]) {
    const insights = [
      'Instagram prioritizes Reels over static images — aim for 3+ Reels per week.',
      'YouTube Shorts algorithm favors consistent daily uploads for the first 30 days.',
      'TikTok rewards watch time above all. Front-load your hook in the first 1.5 seconds.',
      'LinkedIn carousel posts get 3x more reach than text-only posts.',
      'Captions with questions get 2x more comments, signaling high engagement to algorithms.',
      'Posting within 30 minutes of peak hours gives a 23% reach boost on average.',
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private generateWeeklySummary(posts: number, impressions: number, engagement: number, rate: number) {
    if (posts === 0) return 'You didn\'t post this week. Try to post at least 3 times next week.';
    if (rate > 5) return `Great week! ${posts} posts with ${rate.toFixed(1)}% engagement rate. Keep experimenting.`;
    if (rate > 2) return `Solid week with ${posts} posts. Try stronger hooks to push past 5% engagement.`;
    return `${posts} posts published with ${impressions} impressions. Focus on caption quality and consistency.`;
  }
}
