import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

const PLAN_PRICES = {
  PRO: {
    monthly: 2900,          // $29/mo
    yearly: 23200,          // $232/yr (save $116 - 33% off)
    priceIdMonthly: 'price_pro_monthly',
    priceIdYearly: 'price_pro_yearly',
  },
  BUSINESS: {
    monthly: 7900,          // $79/mo
    yearly: 63200,          // $632/yr (save $316 - 33% off)
    priceIdMonthly: 'price_business_monthly',
    priceIdYearly: 'price_business_yearly',
  },
  CUSTOM: {
    // Custom pricing — calculated dynamically: $10/mo per 10 posts + $5/mo per 100 AI credits
    baseMonthly: 1500,      // $15/mo base custom
    perPostBlock: 500,      // $5/mo per 10 posts block
    perAiBlock: 300,        // $3/mo per 100 AI credits block
    priceIdMonthly: 'price_custom_monthly',
    priceIdYearly: 'price_custom_yearly',
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

  async createCheckoutSession(userId: string, plan: 'PRO' | 'BUSINESS' | 'CUSTOM', billingCycle: 'monthly' | 'yearly' = 'monthly', customOpts?: { customPosts?: number; customAiCredits?: number }) {
    if (this.isDemoMode) {
      return { url: null, sessionId: 'demo', demoMode: true, message: 'Stripe not configured. Add STRIPE_SECRET_KEY to .env to enable payments.' };
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
    if (!user) throw new NotFoundException('User not found');

    const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3001';

    // Determine price ID
    let priceId: string;
    let unitAmount: number | undefined;

    if (plan === 'CUSTOM') {
      priceId = billingCycle === 'yearly' ? PLAN_PRICES.CUSTOM.priceIdYearly : PLAN_PRICES.CUSTOM.priceIdMonthly;
      // Calculate custom price
      const postBlocks = Math.ceil((customOpts?.customPosts || 50) / 10);
      const aiBlocks = Math.ceil((customOpts?.customAiCredits || 200) / 100);
      unitAmount = PLAN_PRICES.CUSTOM.baseMonthly + (postBlocks * PLAN_PRICES.CUSTOM.perPostBlock) + (aiBlocks * PLAN_PRICES.CUSTOM.perAiBlock);
      if (billingCycle === 'yearly') unitAmount = Math.round(unitAmount * 10); // 2 months free
    } else {
      const priceInfo = PLAN_PRICES[plan];
      priceId = billingCycle === 'yearly' ? priceInfo.priceIdYearly : priceInfo.priceIdMonthly;
    }

    // Create or retrieve Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({ email: user.email, name: user.name });
      customerId = customer.id;
      await this.prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customerId } });
    }

    const lineItem: any = unitAmount
      ? {
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            recurring: { interval: billingCycle === 'yearly' ? 'year' : 'month' },
            product_data: { name: `Zynovexa Custom Plan (${billingCycle})` },
          },
          quantity: 1,
        }
      : { price: priceId, quantity: 1 };

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
        name: 'Free', price: { monthly: 0, yearly: 0 },
        posts: 5, ai: 20, platforms: 2, analytics: '7 days', support: 'Community',
        features: ['5 posts/month', '20 AI credits', '2 platforms', 'Basic analytics'],
      },
      PRO: {
        name: 'Pro', price: { monthly: 29, yearly: 232 }, badge: 'Most Popular', savings: '33%',
        posts: 100, ai: 500, platforms: 5, analytics: '90 days', support: 'Email',
        features: ['100 posts/month', '500 AI credits', '5 platforms', '90-day analytics', 'Email support', 'AI hashtags', 'Video Studio'],
      },
      BUSINESS: {
        name: 'Business', price: { monthly: 79, yearly: 632 }, badge: 'Best Value', savings: '33%',
        posts: -1, ai: -1, platforms: -1, analytics: '1 year', support: '24/7 Priority',
        features: ['Unlimited posts', 'Unlimited AI', 'All platforms', '1-year analytics', '24/7 priority support', 'Custom branding', 'Team collaboration', 'API access'],
      },
      CUSTOM: {
        name: 'Custom', price: { monthly: 'from $15', yearly: 'from $150' }, badge: 'Tailored',
        posts: 'choose', ai: 'choose', platforms: -1, analytics: '1 year', support: 'Dedicated',
        features: ['Choose your post quota', 'Choose AI credits', 'All platforms', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
        baseMonthly: 15,
        pricePerPostBlock: 5,   // per 10 posts
        pricePerAiBlock: 3,     // per 100 AI credits
      },
    };
  }
}
