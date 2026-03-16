import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PostsService } from './posts.service';

@Injectable()
export class PostSchedulerCron {
  private readonly logger = new Logger(PostSchedulerCron.name);
  private isRunning = false;

  constructor(
    private prisma: PrismaService,
    private postsService: PostsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPosts() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const duePosts = await this.prisma.post.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledAt: { lte: new Date() },
        },
        take: 20,
        orderBy: { scheduledAt: 'asc' },
      });

      if (!duePosts.length) return;

      this.logger.log(`Found ${duePosts.length} scheduled post(s) due for publishing`);

      for (const post of duePosts) {
        try {
          const result = await this.postsService.publish(post.id, post.userId, {
            suppressRecoverableError: true,
          });

          if (result.status === 'PUBLISHED') {
            this.logger.log(`Published scheduled post ${post.id}`);
            continue;
          }

          this.logger.warn(`Scheduled post ${post.id} still needs action before it can publish.`);
        } catch (err) {
          this.logger.error(`Failed to publish scheduled post ${post.id}: ${err.message}`);
          // Mark as FAILED so it doesn't retry forever
          await this.prisma.post.update({
            where: { id: post.id },
            data: { status: 'FAILED' },
          }).catch(() => {});
        }
      }
    } catch (err) {
      this.logger.error(`Scheduler error: ${err.message}`);
    } finally {
      this.isRunning = false;
    }
  }
}
