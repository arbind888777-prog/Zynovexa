import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

const PLAN_PRICES = {
  STARTER: {
    usd: { monthly: 500, yearly: 4800 },       // $5/mo, $48/yr (20% off)
    inr: { monthly: 29900, yearly: 28680 },     // ₹299/mo, ₹239/mo yearly
    priceIdMonthly: 'price_starter_monthly',
    priceIdYearly: 'price_starter_yearly',
  },
  PRO: {
    usd: { monthly: 900, yearly: 8400 },        // $9/mo, $84/yr (20% off)
    inr: { monthly: 69900, yearly: 67080 },      // ₹699/mo, ₹559/mo yearly
    priceIdMonthly: 'price_pro_monthly',
    priceIdYearly: 'price_pro_yearly',
  },
  GROWTH: {
    usd: { monthly: 1900, yearly: 18000 },      // $19/mo, $180/yr (20% off)
    inr: { monthly: 129900, yearly: 124680 },    // ₹1299/mo, ₹1039/mo yearly
    priceIdMonthly: 'price_growth_monthly',
    priceIdYearly: 'price_growth_yearly',
  },
};

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe | null = null;
  private isDemoMode: boolean;

  constructor(private config: ConfigService, private prisma: PrismaService) {
    const stripeKey = this.config.get('STRIPE_SECRET_KEY') || '';
    this.isDemoMode = !stripeKey || stripeKey.includes('your_stripe') || stripeKey === 'sk_test_placeholder';
    if (!this.isDemoMode) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });
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

  async createCheckoutSession(userId: string, plan: 'STARTER' | 'PRO' | 'GROWTH', billingCycle: 'monthly' | 'yearly' = 'monthly', customOpts?: { customPosts?: number; customAiCredits?: number }) {
    if (this.isDemoMode) {
      return { url: null, sessionId: 'demo', demoMode: true, message: 'Payment gateway not configured. Add STRIPE_SECRET_KEY or RAZORPAY_KEY to .env to enable payments.' };
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
    if (!user) throw new NotFoundException('User not found');

    const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3001';

    // Determine price ID and currency
    const priceInfo = PLAN_PRICES[plan];
    if (!priceInfo) throw new BadRequestException('Invalid plan');
    const priceId = billingCycle === 'yearly' ? priceInfo.priceIdYearly : priceInfo.priceIdMonthly;

    // Create or retrieve Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({ email: user.email, name: user.name });
      customerId = customer.id;
      await this.prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customerId } });
    }

    const lineItem: any = { price: priceId, quantity: 1 };

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'subscription',
      success_url: `${frontendUrl}/settings?tab=billing&success=true`,
      cancel_url: `${frontendUrl}/settings?tab=billing&canceled=true`,
      metadata: { userId, plan, billingCycle },
    });

    return { url: session.url, sessionId: session.id };
  }

  async createPortalSession(userId: string) {
    if (this.isDemoMode) {
      return { url: null, demoMode: true, message: 'Stripe not configured.' };
    }
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub?.stripeCustomerId) throw new BadRequestException('No active Stripe subscription');
    const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3001';
    const session = await this.stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${frontendUrl}/settings/billing`,
    });
    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    if (this.isDemoMode) return { received: true };
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, plan } = session.metadata!;
        const subId = session.subscription as string;
        const stripeSub = await this.stripe.subscriptions.retrieve(subId);
        await this.prisma.subscription.update({
          where: { userId },
          data: { plan: plan as any, status: 'ACTIVE', stripeSubscriptionId: subId, currentPeriodEnd: new Date(stripeSub.current_period_end * 1000) },
        });
        await this.prisma.user.update({ where: { id: userId }, data: { plan: plan as any } });
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.prisma.invoice.create({
          data: {
            userId: (invoice.metadata as any)?.userId || '',
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            status: 'PAID',
            invoiceUrl: invoice.hosted_invoice_url,
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
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
        price: { usd: { monthly: 0, yearly: 0 }, inr: { monthly: 0, yearly: 0 } },
        posts: 5, ai: 20, platforms: 2, analytics: '7 days', support: 'Community',
        features: ['5 posts/month', '20 AI credits', '2 platforms', 'Basic analytics'],
      },
      STARTER: {
        name: 'Starter',
        price: { usd: { monthly: 5, yearly: 48 }, inr: { monthly: 299, yearly: 2868 } },
        savings: '20%',
        posts: 30, ai: 100, platforms: 3, analytics: '30 days', support: 'Email',
        features: ['30 posts/month', '100 AI credits', '3 platforms', '30-day analytics', 'AI captions & hashtags', 'Video script generator', 'Email support'],
      },
      PRO: {
        name: 'Pro',
        price: { usd: { monthly: 9, yearly: 84 }, inr: { monthly: 699, yearly: 6708 } },
        badge: 'Most Popular', savings: '20%',
        posts: 100, ai: 500, platforms: 5, analytics: '90 days', support: 'Priority Email',
        features: ['100 posts/month', '500 AI credits', '5 platforms', '90-day analytics', 'All AI tools', 'AI Image Generator', 'Video Studio', 'Start Page', 'Priority email support'],
      },
      GROWTH: {
        name: 'Growth',
        price: { usd: { monthly: 19, yearly: 180 }, inr: { monthly: 1299, yearly: 12468 } },
        badge: 'Best Value', savings: '20%',
        posts: -1, ai: -1, platforms: -1, analytics: '1 year', support: '24/7 Priority',
        features: ['Unlimited posts', 'Unlimited AI', 'All 7 platforms', '1-year analytics', 'Team collaboration', 'Approval workflows', 'Client workspaces', 'White-label reports', 'API access', '24/7 priority support'],
      },
    };
  }
}
