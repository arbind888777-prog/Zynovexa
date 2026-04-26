import { Process, Processor, OnQueueFailed, OnQueueCompleted } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { PostsService } from '../../posts/posts.service';

@Processor('post-scheduler')
export class PostSchedulerProcessor {
  private readonly logger = new Logger(PostSchedulerProcessor.name);

  constructor(
    private prisma: PrismaService,
    private postsService: PostsService,
  ) {}

  @Process({ name: 'publish', concurrency: 3 })
  async handlePublish(job: Job<{ postId: string; userId: string }>) {
    const { postId, userId } = job.data;
    this.logger.log(`Publishing post ${postId} for user ${userId}`);

    const post = await this.prisma.post.findFirst({
      where: { id: postId, userId },
    });

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.status === 'PUBLISHED') {
      this.logger.warn(`Post ${postId} is already published, skipping`);
      return { skipped: true };
    }

    // Delegate to PostsService which handles real platform API calls (YouTube upload, etc.)
    const updatedPost = await this.postsService.publish(postId, userId, { suppressRecoverableError: true });

    // Update scheduled job record
    await this.prisma.scheduledJob.updateMany({
      where: { payload: { path: ['postId'], equals: postId }, status: 'PENDING' },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    this.logger.log(`Post ${postId} published successfully`);
    return { postId, platforms: post.platforms, publishResults: updatedPost.publishResults };
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
