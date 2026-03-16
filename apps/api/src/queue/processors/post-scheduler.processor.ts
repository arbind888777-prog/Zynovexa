import { Process, Processor, OnQueueFailed, OnQueueCompleted } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('post-scheduler')
export class PostSchedulerProcessor {
  private readonly logger = new Logger(PostSchedulerProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('publish')
  async handlePublish(job: Job<{ postId: string; userId: string }>) {
    const { postId, userId } = job.data;
    this.logger.log(`Publishing post ${postId} for user ${userId}`);

    const post = await this.prisma.post.findFirst({
      where: { id: postId, userId },
      include: { accounts: { include: { socialAccount: true } } },
    });

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.status === 'PUBLISHED') {
      this.logger.warn(`Post ${postId} is already published, skipping`);
      return { skipped: true };
    }

    // Build publish results per platform
    const publishResults: Record<string, any> = {};
    for (const platform of post.platforms) {
      // In production, each platform adapter would handle the actual API call
      // For now, we mark as published with simulated data
      publishResults[platform] = {
        success: true,
        publishedAt: new Date().toISOString(),
        platformPostId: `sim_${platform.toLowerCase()}_${Date.now()}`,
      };
    }

    // Update post status
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        publishResults,
      },
    });

    // Update PostAccount records
    for (const pa of post.accounts) {
      await this.prisma.postAccount.update({
        where: { id: pa.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          publishedUrl: `https://${pa.socialAccount.platform.toLowerCase()}.com/p/sim_${Date.now()}`,
        },
      });
    }

    // Create notification
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Post Published',
        message: `Your post "${post.title || post.caption.slice(0, 40)}..." has been published to ${post.platforms.join(', ')}.`,
        type: 'SUCCESS',
      },
    });

    // Update scheduled job record
    await this.prisma.scheduledJob.updateMany({
      where: { payload: { path: ['postId'], equals: postId }, status: 'PENDING' },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    this.logger.log(`Post ${postId} published successfully`);
    return { postId, platforms: post.platforms, publishResults };
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);

    const { postId, userId } = job.data;

    // Mark post as failed
    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'FAILED' },
    });

    // Update scheduled job
    await this.prisma.scheduledJob.updateMany({
      where: { payload: { path: ['postId'], equals: postId }, status: 'PENDING' },
      data: {
        status: 'FAILED',
        error: error.message,
        attempts: job.attemptsMade,
      },
    });

    // Notify user of failure
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Post Publishing Failed',
        message: `Failed to publish your post. Error: ${error.message}. We'll retry automatically.`,
        type: 'ERROR',
      },
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }
}
