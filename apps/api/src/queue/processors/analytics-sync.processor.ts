import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountsService } from '../../accounts/accounts.service';
import { YoutubeService } from '../../video-analytics/youtube.service';

@Processor('analytics-sync')
export class AnalyticsSyncProcessor {
  private readonly logger = new Logger(AnalyticsSyncProcessor.name);

  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
    private youtubeService: YoutubeService,
  ) {}

  @Process('sync')
  async handleSync(job: Job<{ userId: string; platforms: string[] }>) {
    const { userId, platforms } = job.data;
    this.logger.log(`Syncing analytics for user ${userId} on ${platforms.join(', ')}`);

    const accounts = await this.prisma.socialAccount.findMany({
      where: {
        userId,
        isActive: true,
        ...(platforms.length > 0 && { platform: { in: platforms as any } }),
      },
    });

    const results: Record<string, any> = {};

    for (const account of accounts) {
      try {
        if (account.platform === 'YOUTUBE') {
          const metrics = await this.fetchYoutubeMetrics(userId, account);
          results[account.platform] = { synced: true, metrics };
        } else {
          // Other platforms: no real API integration yet — skip silently
          results[account.platform] = { synced: false, reason: 'Platform API not integrated yet' };
        }
      } catch (error: any) {
        this.logger.warn(`Failed to sync ${account.platform} for user ${userId}: ${error.message}`);
        results[account.platform] = { synced: false, error: error.message };
      }
    }

    this.logger.log(`Analytics sync completed for user ${userId}`);
    return results;
  }

  private async fetchYoutubeMetrics(userId: string, account: any) {
    // Get decrypted access token
    const { accessToken } = await this.accountsService.getConnectedAccountWithTokens(userId, 'YOUTUBE');

    if (!accessToken) {
      throw new Error('YouTube access token not available — reconnect account');
    }

    // Fetch real channel insights (subscribers, views, recent videos)
    const insights = await this.youtubeService.getMyChannelInsights(accessToken);
    const channel = insights.channel;
    const totals = insights.totals;

    // Update real subscriber count on the account
    if (typeof channel.subscriberCount === 'number') {
      await this.prisma.socialAccount.update({
        where: { id: account.id },
        data: { followersCount: channel.subscriberCount },
      });
    }

    // Record real metrics from YouTube API
    const metrics: Record<string, number> = {
      impressions: channel.viewCount || 0,
      engagements: (totals.totalLikes || 0) + (totals.totalComments || 0),
      reach: channel.viewCount || 0,
      subscribers: channel.subscriberCount || 0,
      video_views: totals.totalVideoViews || 0,
      likes: totals.totalLikes || 0,
      comments: totals.totalComments || 0,
    };

    for (const [metricName, metricValue] of Object.entries(metrics)) {
      await this.prisma.analytics.create({
        data: {
          userId,
          platform: account.platform,
          metricName,
          metricValue,
        },
      });
    }

    return metrics;
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Analytics sync job ${job.id} failed: ${error.message}`);
  }
}
