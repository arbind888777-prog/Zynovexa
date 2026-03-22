import { Module, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostSchedulerProcessor } from './processors/post-scheduler.processor';
import { EmailProcessor } from './processors/email.processor';
import { AnalyticsSyncProcessor } from './processors/analytics-sync.processor';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { PostsModule } from '../posts/posts.module';
import { AccountsModule } from '../accounts/accounts.module';
import { VideoAnalyticsModule } from '../video-analytics/video-analytics.module';

const logger = new Logger('QueueModule');

@Module({
  imports: [
    PostsModule,
    AccountsModule,
    VideoAnalyticsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD', undefined),
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            if (times > 3) {
              logger.warn('Redis unavailable — queue features disabled. App continues without Redis.');
              return null; // stop retrying
            }
            return Math.min(times * 500, 3000);
          },
          enableOfflineQueue: false,
          lazyConnect: true,
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'post-scheduler' },
      { name: 'email' },
      { name: 'analytics-sync' },
    ),
  ],
  providers: [
    QueueService,
    PostSchedulerProcessor,
    EmailProcessor,
    AnalyticsSyncProcessor,
  ],
  controllers: [QueueController],
  exports: [QueueService],
})
export class QueueModule {}
