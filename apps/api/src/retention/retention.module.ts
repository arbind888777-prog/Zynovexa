import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';
import { GamificationModule } from '../gamification/gamification.module';
import { RetentionService } from './retention.service';
import { RetentionCron } from './retention.cron';

@Module({
  imports: [PrismaModule, NotificationsModule, MailModule, GamificationModule],
  providers: [RetentionService, RetentionCron],
  exports: [RetentionService],
})
export class RetentionModule {}
