import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RetentionService } from './retention.service';

@Injectable()
export class RetentionCron {
  private readonly logger = new Logger(RetentionCron.name);

  constructor(private retention: RetentionService) {}

  /** Daily at 10:00 AM — streak reminders */
  @Cron('0 10 * * *')
  async handleStreakReminders() {
    this.logger.log('Running daily streak reminders...');
    await this.retention.sendStreakReminders();
  }

  /** Every Monday at 9:00 AM — weekly reports */
  @Cron('0 9 * * 1')
  async handleWeeklyReports() {
    this.logger.log('Running weekly reports...');
    await this.retention.sendWeeklyReports();
  }

  /** Daily at 6:00 PM — re-engage dormant users */
  @Cron('0 18 * * *')
  async handleReEngagement() {
    this.logger.log('Running re-engagement emails...');
    await this.retention.sendReEngagementEmails();
  }
}
