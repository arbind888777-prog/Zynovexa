import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { envValidationSchema } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AccountsModule } from './accounts/accounts.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { UploadsModule } from './uploads/uploads.module';
import { EventsModule } from './events/events.module';
import { MonetizationModule } from './monetization/monetization.module';
import { VideoAnalyticsModule } from './video-analytics/video-analytics.module';
import { SeoModule } from './seo/seo.module';
import { CommerceModule } from './commerce/commerce.module';
import * as net from 'net';

const appLogger = new Logger('AppModule');

// Check Redis before loading QueueModule to avoid unhandled ioredis ECONNREFUSED crashes
async function isRedisAvailable(host = 'localhost', port = 6379): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    sock.setTimeout(2000);
    sock.once('connect', () => { sock.destroy(); resolve(true); });
    sock.once('error', () => { sock.destroy(); resolve(false); });
    sock.once('timeout', () => { sock.destroy(); resolve(false); });
    sock.connect(port, host);
  });
}

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),

    // Rate Limiting: 100 req/min per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Cron/Scheduled Tasks
    ScheduleModule.forRoot(),

    // Core
    PrismaModule,

    // Infrastructure (QueueModule loaded dynamically — see onModuleInit)
    MailModule,
    UploadsModule,
    EventsModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    PostsModule,
    AccountsModule,
    AnalyticsModule,
    AiModule,
    SubscriptionsModule,
    NotificationsModule,
    MonetizationModule,
    CommerceModule,
    VideoAnalyticsModule,
    SeoModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  async onModuleInit() {
    const redisUp = await isRedisAvailable();
    if (redisUp) {
      appLogger.log('Redis is available — queue features enabled.');
    } else {
      appLogger.warn('Redis not available — queue features (scheduled posts, email queues) are disabled. App runs normally without them.');
    }
  }
}
