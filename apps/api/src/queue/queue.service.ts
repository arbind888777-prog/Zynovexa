import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, JobOptions } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('post-scheduler') private postQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('analytics-sync') private analyticsQueue: Queue,
    private prisma: PrismaService,
  ) {}

  /** Schedule a post for future publishing */
  async schedulePost(postId: string, userId: string, publishAt: Date) {
    const delay = publishAt.getTime() - Date.now();
    if (delay <= 0) {
      // Publish immediately
      return this.postQueue.add('publish', { postId, userId }, { priority: 1 });
    }

    const job = await this.postQueue.add(
      'publish',
      { postId, userId },
      { delay, jobId: `post-${postId}`, priority: 2 },
    );

    // Track the scheduled job in DB
    await this.prisma.scheduledJob.create({
      data: {
        userId,
        type: 'POST_PUBLISH',
        status: 'PENDING',
        payload: { postId, jobId: job.id },
        scheduledAt: publishAt,
      },
    });

    this.logger.log(`Post ${postId} scheduled for ${publishAt.toISOString()}`);
    return { jobId: job.id, scheduledAt: publishAt };
  }

  /** Cancel a scheduled post */
  async cancelScheduledPost(postId: string) {
    const job = await this.postQueue.getJob(`post-${postId}`);
    if (job) {
      await job.remove();
      this.logger.log(`Cancelled scheduled post ${postId}`);
    }

    await this.prisma.scheduledJob.updateMany({
      where: { payload: { path: ['postId'], equals: postId }, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });

    return { cancelled: true };
  }

  /** Queue an email for sending */
  async queueEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
    options?: JobOptions,
  ) {
    const job = await this.emailQueue.add(
      'send',
      { to, subject, template, context },
      { priority: 1, ...options },
    );
    this.logger.log(`Email queued: ${subject} -> ${to}`);
    return { jobId: job.id };
  }

  /** Queue analytics sync for a user */
  async queueAnalyticsSync(userId: string, platforms: string[]) {
    const job = await this.analyticsQueue.add(
      'sync',
      { userId, platforms },
      { priority: 3 },
    );
    this.logger.log(`Analytics sync queued for user ${userId}`);
    return { jobId: job.id };
  }

  /** Get queue health/stats */
  async getQueueStats() {
    const [postStats, emailStats, analyticsStats] = await Promise.all([
      this.getStats(this.postQueue),
      this.getStats(this.emailQueue),
      this.getStats(this.analyticsQueue),
    ]);

    return {
      postScheduler: postStats,
      email: emailStats,
      analyticsSync: analyticsStats,
    };
  }

  private async getStats(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);
    return { waiting, active, completed, failed, delayed };
  }
}
