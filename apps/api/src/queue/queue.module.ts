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

// Parse Redis URL into host/port/password for ioredis
function parseRedisUrl(redisUrl: string) {
  try {
    const url = new URL(redisUrl);
    return {
      host: url.hostname || 'localhost',
      port: parseInt(url.port, 10) || 6379,
      password: url.password || undefined,
    };
  } catch {
    return { host: 'localhost', port: 6379, password: undefined };
  }
}

@Module({
  imports: [
    PostsModule,
    AccountsModule,
    VideoAnalyticsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL', 'redis://localhost:6379');
        const { host, port, password } = parseRedisUrl(redisUrl);

        return {
          redis: {
            host,
            port,
            password,
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
        };
      },
      inject: [ConfigService],
    }),
    // Per-queue concurrency: controls how many jobs run in parallel
    // post-scheduler: 3 (social API calls, moderate load)
    // email: 5 (I/O bound, nodemailer handles parallel sends well)
    // analytics-sync: 2 (external API rate-limit sensitive)
    BullModule.registerQueue(
      { name: 'post-scheduler', settings: { lockDuration: 30000, stalledInterval: 10000, maxStalledCount: 3 } },
      { name: 'email', settings: { lockDuration: 15000, stalledInterval: 5000, maxStalledCount: 2 } },
      { name: 'analytics-sync', settings: { lockDuration: 60000, stalledInterval: 15000, maxStalledCount: 2 } },
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

