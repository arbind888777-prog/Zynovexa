import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  @Process('send')
  async handleSend(job: Job<EmailJobData>) {
    const { to, subject, template, context } = job.data;
    this.logger.log(`Sending email: ${subject} -> ${to}`);

    const html = this.renderTemplate(template, context);

    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM', 'Zynovexa <noreply@zynovexa.com>'),
      to,
      subject,
      html,
    });

    this.logger.log(`Email sent: ${subject} -> ${to}`);
    return { sent: true, to, subject };
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Email job ${job.id} failed: ${error.message}`);
  }

  private renderTemplate(template: string, context: Record<string, any>): string {
    const templates: Record<string, (ctx: Record<string, any>) => string> = {
      welcome: (ctx) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h1 style="color:#6C5CE7;">Welcome to Zynovexa! 🚀</h1>
          <p>Hi ${ctx.name},</p>
          <p>Your account has been created successfully. Start creating amazing content today!</p>
          <a href="${ctx.dashboardUrl}" style="display:inline-block;background:#6C5CE7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard</a>
          <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
        </div>`,

      'post-published': (ctx) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#00B894;">Post Published! ✅</h2>
          <p>Hi ${ctx.name},</p>
          <p>Your post <strong>"${ctx.postTitle}"</strong> has been published to <strong>${ctx.platforms}</strong>.</p>
          <p>Viral Score: <strong>${ctx.viralScore}/100</strong></p>
          <a href="${ctx.postUrl}" style="display:inline-block;background:#00B894;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Post</a>
          <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
        </div>`,

      'post-failed': (ctx) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#D63031;">Post Publishing Failed ❌</h2>
          <p>Hi ${ctx.name},</p>
          <p>We couldn't publish your post <strong>"${ctx.postTitle}"</strong>.</p>
          <p>Error: ${ctx.error}</p>
          <p>Don't worry — we'll retry automatically, or you can try again manually.</p>
          <a href="${ctx.dashboardUrl}" style="display:inline-block;background:#D63031;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard</a>
          <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
        </div>`,

      'password-reset': (ctx) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#6C5CE7;">Password Reset 🔑</h2>
          <p>Hi ${ctx.name},</p>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${ctx.resetUrl}" style="display:inline-block;background:#6C5CE7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
          <p style="margin-top:16px;color:#888;">If you didn't request this, ignore this email.</p>
          <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
        </div>`,

      'brand-deal': (ctx) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#FDCB6E;">Brand Deal Update 💰</h2>
          <p>Hi ${ctx.name},</p>
          <p>Your brand deal with <strong>${ctx.brandName}</strong> status changed to <strong>${ctx.status}</strong>.</p>
          <p>Deal Value: <strong>$${ctx.dealValue}</strong></p>
          <a href="${ctx.monetizationUrl}" style="display:inline-block;background:#FDCB6E;color:#333;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Deal</a>
          <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
        </div>`,

      'weekly-report': (ctx) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0984E3;">Weekly Report 📊</h2>
          <p>Hi ${ctx.name},</p>
          <h3>This week's highlights:</h3>
          <ul>
            <li>New followers: <strong>+${ctx.newFollowers}</strong></li>
            <li>Posts published: <strong>${ctx.postsPublished}</strong></li>
            <li>Total engagement: <strong>${ctx.engagement}</strong></li>
            <li>Top platform: <strong>${ctx.topPlatform}</strong></li>
          </ul>
          <a href="${ctx.analyticsUrl}" style="display:inline-block;background:#0984E3;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Full Analytics</a>
          <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
        </div>`,
    };

    const templateFn = templates[template];
    if (!templateFn) {
      // Fallback: render context as simple HTML
      return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2>${context.title || 'Notification'}</h2>
        <p>${context.message || JSON.stringify(context)}</p>
        <p style="margin-top:24px;color:#888;">— The Zynovexa Team</p>
      </div>`;
    }

    return templateFn(context);
  }
}
