import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private mail: MailService,
    private gamification: GamificationService,
  ) {}

  /** Send streak-at-risk reminders (in-app + email) */
  async sendStreakReminders() {
    const reminders = await this.gamification.getStreakReminders();
    let sent = 0;

    for (const r of reminders) {
      // In-app notification
      await this.notifications.create(
        r.userId,
        '🔥 Streak at risk!',
        r.message,
        'STREAK_REMINDER',
      );

      // Email
      await this.mail.send({
        to: r.email,
        subject: `🔥 Your ${r.currentStreak}-day streak is at risk!`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#6366f1;">Hey ${this.escapeHtml(r.name)}! 🔥</h2>
            <p>You've been crushing it with a <strong>${r.currentStreak}-day streak</strong> on Zynovexa.</p>
            <p>Don't lose it — post something today to keep your streak alive!</p>
            <a href="${process.env.FRONTEND_URL || 'https://zynovexa.com'}/create"
               style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
              Create a Post →
            </a>
            <p style="color:#999;font-size:12px;margin-top:24px;">You're receiving this because you have an active streak on Zynovexa.</p>
          </div>
        `,
      });

      sent++;
    }

    this.logger.log(`Sent ${sent} streak reminders`);
    return { sent };
  }

  /** Generate and send weekly performance reports */
  async sendWeeklyReports() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get all active users with at least 1 post this week
    const activeUsers = await this.prisma.user.findMany({
      where: {
        isActive: true,
        posts: { some: { createdAt: { gte: oneWeekAgo } } },
      },
      select: { id: true, name: true, email: true },
    });

    let sent = 0;

    for (const user of activeUsers) {
      const [postsThisWeek, publishedThisWeek, aiUsageCount] = await Promise.all([
        this.prisma.post.count({ where: { userId: user.id, createdAt: { gte: oneWeekAgo } } }),
        this.prisma.post.count({ where: { userId: user.id, status: 'PUBLISHED', createdAt: { gte: oneWeekAgo } } }),
        this.prisma.aiRequest.count({ where: { userId: user.id, createdAt: { gte: oneWeekAgo } } }),
      ]);

      const streak = await this.prisma.userStreak.findUnique({ where: { userId: user.id } });

      // Create in-app notification
      await this.notifications.create(
        user.id,
        '📊 Weekly Report Ready',
        `You created ${postsThisWeek} posts and published ${publishedThisWeek} this week.`,
        'WEEKLY_REPORT',
      );

      // Send email report
      await this.mail.send({
        to: user.email,
        subject: '📊 Your Weekly Zynovexa Report',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#6366f1;">Weekly Report for ${this.escapeHtml(user.name)} 📊</h2>
            <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin:16px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Posts Created</strong></td>
                  <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${postsThisWeek}</td>
                </tr>
                <tr>
                  <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Posts Published</strong></td>
                  <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${publishedThisWeek}</td>
                </tr>
                <tr>
                  <td style="padding:8px;border-bottom:1px solid #eee;"><strong>AI Generations</strong></td>
                  <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${aiUsageCount}</td>
                </tr>
                <tr>
                  <td style="padding:8px;"><strong>Current Streak</strong></td>
                  <td style="padding:8px;text-align:right;">${streak?.currentStreak ?? 0} days 🔥</td>
                </tr>
              </table>
            </div>
            <a href="${process.env.FRONTEND_URL || 'https://zynovexa.com'}/dashboard"
               style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
              View Dashboard →
            </a>
          </div>
        `,
      });

      sent++;
    }

    this.logger.log(`Sent ${sent} weekly reports`);
    return { sent };
  }

  /** Re-engage dormant users (inactive for 3+ days with history) */
  async sendReEngagementEmails() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const dormant = await this.prisma.userStreak.findMany({
      where: {
        lastActiveDate: { lt: threeDaysAgo },
        currentStreak: { gte: 1 }, // had an active streak
      },
      include: { user: { select: { id: true, name: true, email: true, isActive: true } } },
    });

    let sent = 0;

    for (const s of dormant) {
      if (!s.user.isActive) continue;

      await this.notifications.create(
        s.user.id,
        '👋 We miss you!',
        `You had a ${s.longestStreak}-day streak! Come back and start a new one.`,
        'RE_ENGAGEMENT',
      );

      await this.mail.send({
        to: s.user.email,
        subject: `👋 ${s.user.name}, we miss you on Zynovexa!`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#6366f1;">Hey ${this.escapeHtml(s.user.name)}! 👋</h2>
            <p>We noticed you've been away. You had an impressive <strong>${s.longestStreak}-day streak</strong>!</p>
            <p>Come back and post today — we've added new AI templates and features since your last visit.</p>
            <a href="${process.env.FRONTEND_URL || 'https://zynovexa.com'}/create"
               style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
              Start Creating →
            </a>
          </div>
        `,
      });

      sent++;
    }

    this.logger.log(`Sent ${sent} re-engagement emails`);
    return { sent };
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
