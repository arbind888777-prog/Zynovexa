import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sanitizeFrontendUrl } from '../common/utils/frontend-url';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly fromAddress: string;
  private readonly isConfigured: boolean;

  constructor(private config: ConfigService) {
    const smtpHost = this.config.get('SMTP_HOST');
    const smtpUser = this.config.get('SMTP_USER');
    this.isConfigured = !!(smtpHost && smtpUser);
    this.fromAddress = this.config.get('SMTP_FROM', 'Zynovexa <noreply@zynovexa.com>');

    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: this.config.get<number>('SMTP_PORT', 587),
        secure: this.config.get<number>('SMTP_PORT', 587) === 465,
        auth: { user: smtpUser, pass: this.config.get('SMTP_PASS') },
      });
      this.logger.log('Mail service configured');
    } else {
      this.logger.warn('Mail service not configured — emails will be logged only');
    }
  }

  async send(options: SendMailOptions): Promise<{ sent: boolean; messageId?: string }> {
    if (!this.isConfigured) {
      this.logger.log(`[DRY RUN] Email to=${options.to} subject="${options.subject}"`);
      return { sent: false };
    }

    const info = await this.transporter.sendMail({
      from: this.fromAddress,
      ...options,
    });
    this.logger.log(`Email sent: ${options.subject} -> ${options.to} (${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  }

  /** Welcome email after signup */
  async sendWelcome(to: string, name: string) {
    return this.send({
      to,
      subject: 'Welcome to Zynovexa! 🚀',
      html: this.layout(`
        <h1 style="color:#6C5CE7;">Welcome, ${this.escapeHtml(name)}! 🚀</h1>
        <p>Your Zynovexa account is ready. Start creating, scheduling, and analyzing your content today.</p>
        ${this.button('Go to Dashboard', `${this.appUrl()}/dashboard`)}
        <p style="margin-top:20px;">Here's what you can do:</p>
        <ul>
          <li>📝 Create & schedule posts across platforms</li>
          <li>🤖 Use AI to generate captions, scripts & hashtags</li>
          <li>📊 Track analytics & engagement in real-time</li>
          <li>💰 Manage brand deals & monetization</li>
        </ul>
      `),
    });
  }

  /** Email verification */
  async sendVerification(to: string, name: string, token: string) {
    const verifyUrl = `${this.appUrl()}/verify?token=${token}`;
    return this.send({
      to,
      subject: 'Verify your email — Zynovexa',
      html: this.layout(`
        <h2>Verify your email ✉️</h2>
        <p>Hi ${this.escapeHtml(name)}, click the button below to verify your email address.</p>
        ${this.button('Verify Email', verifyUrl)}
        <p style="color:#888;font-size:13px;margin-top:16px;">This link expires in 24 hours. If you didn't create this account, ignore this email.</p>
      `),
    });
  }

  /** Password reset */
  async sendPasswordReset(to: string, name: string, token: string) {
    const resetUrl = `${this.appUrl()}/reset-password?token=${token}`;
    return this.send({
      to,
      subject: 'Reset your password — Zynovexa',
      html: this.layout(`
        <h2>Password Reset 🔑</h2>
        <p>Hi ${this.escapeHtml(name)}, click below to reset your password. This link expires in 1 hour.</p>
        ${this.button('Reset Password', resetUrl)}
        <p style="color:#888;font-size:13px;margin-top:16px;">If you didn't request this, no action is needed.</p>
      `),
    });
  }

  /** Post published notification */
  async sendPostPublished(to: string, name: string, postTitle: string, platforms: string[]) {
    return this.send({
      to,
      subject: `Post Published: ${postTitle} ✅`,
      html: this.layout(`
        <h2 style="color:#00B894;">Post Published! ✅</h2>
        <p>Hi ${this.escapeHtml(name)}, your post <strong>"${this.escapeHtml(postTitle)}"</strong> is now live on <strong>${platforms.join(', ')}</strong>.</p>
        ${this.button('View Analytics', `${this.appUrl()}/dashboard/analytics`)}
      `),
    });
  }

  /** Weekly analytics report */
  async sendWeeklyReport(to: string, name: string, stats: {
    newFollowers: number; postsPublished: number;
    totalEngagement: number; topPlatform: string;
  }) {
    return this.send({
      to,
      subject: 'Your Weekly Report 📊 — Zynovexa',
      html: this.layout(`
        <h2 style="color:#0984E3;">Weekly Report 📊</h2>
        <p>Hi ${this.escapeHtml(name)}, here's your content performance this week:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">New Followers</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">+${stats.newFollowers}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Posts Published</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${stats.postsPublished}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;">Total Engagement</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${stats.totalEngagement.toLocaleString()}</td></tr>
          <tr><td style="padding:8px;">Top Platform</td><td style="padding:8px;font-weight:600;">${stats.topPlatform}</td></tr>
        </table>
        ${this.button('View Full Analytics', `${this.appUrl()}/dashboard/analytics`)}
      `),
    });
  }

  /** Brand deal status update */
  async sendBrandDealUpdate(to: string, name: string, brandName: string, status: string, dealValue: number) {
    return this.send({
      to,
      subject: `Brand Deal Update: ${brandName} — ${status}`,
      html: this.layout(`
        <h2 style="color:#FDCB6E;">Brand Deal Update 💰</h2>
        <p>Hi ${this.escapeHtml(name)}, your deal with <strong>${this.escapeHtml(brandName)}</strong> is now <strong>${status}</strong>.</p>
        <p style="font-size:24px;font-weight:700;color:#6C5CE7;">$${dealValue.toLocaleString()}</p>
        ${this.button('View Deal', `${this.appUrl()}/dashboard/monetization`)}
      `),
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private appUrl(): string {
    return sanitizeFrontendUrl(this.config.get<string>('FRONTEND_URL'));
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private button(text: string, url: string): string {
    return `<a href="${url}" style="display:inline-block;background:#6C5CE7;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">${text}</a>`;
  }

  private layout(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      ${content}
    </div>
    <div style="text-align:center;padding:24px 0;color:#999;font-size:12px;">
      <p>© ${new Date().getFullYear()} Zynovexa. All rights reserved.</p>
      <p><a href="${this.appUrl()}/settings" style="color:#999;">Notification Settings</a> · <a href="${this.appUrl()}/privacy" style="color:#999;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`;
  }
}
