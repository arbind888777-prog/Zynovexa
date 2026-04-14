import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

// Razorpay plan IDs — create these in the Razorpay dashboard and add to .env
// RAZORPAY_PLAN_STARTER_MONTHLY, RAZORPAY_PLAN_STARTER_YEARLY, etc.
const PLAN_INR_PRICES = {
  STARTER: { monthly: 299, yearly: 2868 },   // ₹299/mo, ₹2868/yr
  PRO:     { monthly: 699, yearly: 6708 },   // ₹699/mo, ₹6708/yr
  GROWTH:  { monthly: 1299, yearly: 12468 }, // ₹1299/mo, ₹12468/yr
};

@Injectable()
export class SubscriptionsService {
  private rzp: any;
  private isDemoMode: boolean;

  constructor(private config: ConfigService, private prisma: PrismaService) {
    const keyId = this.config.get('RAZORPAY_KEY_ID') || '';
    const keySecret = this.config.get('RAZORPAY_KEY_SECRET') || '';
    this.isDemoMode = !keyId || !keySecret || keyId.includes('your_razorpay');
    if (!this.isDemoMode) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Razorpay = require('razorpay');
      this.rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
  }

  async getSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { invoices: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async createCheckoutSession(userId: string, plan: 'STARTER' | 'PRO' | 'GROWTH', billingCycle: 'monthly' | 'yearly' = 'monthly') {
    if (this.isDemoMode) {
      return { url: null, demoMode: true, message: 'Payment gateway not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env to enable payments.' };
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
    if (!user) throw new NotFoundException('User not found');
    if (!PLAN_INR_PRICES[plan]) throw new BadRequestException('Invalid plan');

    // Razorpay plan IDs must be created in your Razorpay dashboard and set in .env
    const planIdEnvKey = `RAZORPAY_PLAN_${plan}_${billingCycle.toUpperCase()}`;
    const razorpayPlanId = this.config.get<string>(planIdEnvKey);
    if (!razorpayPlanId) {
      throw new BadRequestException(
        `Razorpay plan ID not configured. Add ${planIdEnvKey} to .env (create the plan in your Razorpay dashboard first).`,
      );
    }

    // total_count: yearly billing = 1 cycle, monthly = 12 cycles (1 year auto-renew)
    const totalCount = billingCycle === 'yearly' ? 1 : 12;

    const subscription = await this.rzp.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: totalCount,
      quantity: 1,
      customer_notify: 0,
      notes: { userId, plan, billingCycle },
    });

    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        stripeSubscriptionId: subscription.id,
        status: 'PENDING',
      },
      create: {
        userId,
        plan: user.subscription?.plan || 'FREE',
        status: 'PENDING',
        stripeSubscriptionId: subscription.id,
      },
    });

    // subscription.short_url is Razorpay's hosted payment page
    return { url: subscription.short_url, sessionId: subscription.id };
  }

  async createPortalSession(_userId: string) {
    // Razorpay has no billing portal — user manages subscriptions via Razorpay dashboard/email links
    return {
      url: null,
      razorpayMode: true,
      message: 'To manage your subscription, please check the email from Razorpay or contact support.',
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    if (this.isDemoMode) return { received: true };
    const webhookSecret = this.config.get('RAZORPAY_WEBHOOK_SECRET');
    if (!webhookSecret) throw new BadRequestException('Razorpay webhook secret not configured');

    const expectedSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    if (expectedSig !== signature) throw new BadRequestException('Invalid webhook signature');

    const event = JSON.parse(rawBody.toString());

    switch (event.event) {
      case 'subscription.activated': {
        const sub = event.payload?.subscription?.entity;
        if (!sub) break;
        const { userId, plan, billingCycle } = sub.notes || {};
        if (!userId || !plan) break;
        const daysToAdd = billingCycle === 'yearly' ? 365 : 30;
        const periodEnd = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
        await this.prisma.subscription.upsert({
          where: { userId },
          update: { plan: plan as any, status: 'ACTIVE', stripeSubscriptionId: sub.id, currentPeriodEnd: periodEnd },
          create: {
            userId,
            plan: plan as any,
            status: 'ACTIVE',
            stripeSubscriptionId: sub.id,
            currentPeriodEnd: periodEnd,
          },
        });
        await this.prisma.user.update({ where: { id: userId }, data: { plan: plan as any } });
        break;
      }
      case 'invoice.paid': {
        const invoice = event.payload?.invoice?.entity;
        if (!invoice) break;
        const dbSub = invoice.subscription_id
          ? await this.prisma.subscription.findFirst({ where: { stripeSubscriptionId: invoice.subscription_id } })
          : null;
        if (dbSub) {
          await this.prisma.invoice.create({
          data: {
            userId: dbSub.userId,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            status: 'PAID',
            invoiceUrl: invoice.short_url || null,
          },
        });
        }
        break;
      }
      case 'subscription.cancelled':
      case 'subscription.completed': {
        const sub = event.payload?.subscription?.entity;
        if (!sub) break;
        const dbSub = await this.prisma.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } });
        if (dbSub) {
          await this.prisma.subscription.update({ where: { id: dbSub.id }, data: { plan: 'FREE', status: 'CANCELED' } });
          await this.prisma.user.update({ where: { id: dbSub.userId }, data: { plan: 'FREE' } });
        }
        break;
      }
    }

    return { received: true };
  }

  async getInvoices(userId: string) {
    return this.prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async getPlanFeatures() {
    return {
      FREE: {
        name: 'Free',
        price: { inr: { monthly: 0, yearly: 0 } },
        posts: 5, ai: 20, platforms: 2, analytics: '7 days', support: 'Community',
        features: ['5 posts/month', '20 AI credits', '2 platforms', 'Basic analytics'],
      },
      STARTER: {
        name: 'Starter',
        price: { inr: { monthly: 299, yearly: 2868 } },
        savings: '20%',
        posts: 30, ai: 100, platforms: 3, analytics: '30 days', support: 'Email',
        features: ['30 posts/month', '100 AI credits', '3 platforms', '30-day analytics', 'AI captions & hashtags', 'Video script generator', 'Email support'],
      },
      PRO: {
        name: 'Pro',
        price: { inr: { monthly: 699, yearly: 6708 } },
        badge: 'Most Popular', savings: '20%',
        posts: 100, ai: 500, platforms: 5, analytics: '90 days', support: 'Priority Email',
        features: ['100 posts/month', '500 AI credits', '5 platforms', '90-day analytics', 'All AI tools', 'AI Image Generator', 'Video Studio', 'Start Page', 'Priority email support'],
      },
      GROWTH: {
        name: 'Growth',
        price: { inr: { monthly: 1299, yearly: 12468 } },
        badge: 'Best Value', savings: '20%',
        posts: -1, ai: -1, platforms: -1, analytics: '1 year', support: '24/7 Priority',
        features: ['Unlimited posts', 'Unlimited AI', 'All 7 platforms', '1-year analytics', 'Team collaboration', 'Approval workflows', 'Client workspaces', 'White-label reports', 'API access', '24/7 priority support'],
      },
    };
  }
}
