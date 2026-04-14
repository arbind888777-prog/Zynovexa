'use client';

import { useState } from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import PricingCard from '@/components/PricingCard';
import type { PricingPlan } from '@/components/PricingCard';
import FAQItem from '@/components/FAQItem';

const PLANS: PricingPlan[] = [
  {
    plan: 'Free',
    inrMonthly: 0, inrYearly: 0,
    usdMonthly: 0, usdYearly: 0,
    desc: 'Perfect to explore Zynovexa',
    features: [
      '5 posts/month scheduled',
      '20 AI credits per month',
      '2 social platforms',
      '7-day analytics history',
      'AI caption generator',
      'Community support',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    featured: false,
    badge: null,
  },
  {
    plan: 'Starter',
    inrMonthly: 299, inrYearly: 239,
    usdMonthly: 299, usdYearly: 239,
    desc: 'For individual creators',
    features: [
      '30 posts/month scheduled',
      '100 AI credits per month',
      '3 social platforms',
      '30-day analytics history',
      'AI captions & hashtags',
      'Video script generator',
      'Email support',
    ],
    cta: 'Start Starter Plan',
    href: '/signup',
    featured: false,
    badge: null,
  },
  {
    plan: 'Pro',
    inrMonthly: 699, inrYearly: 559,
    usdMonthly: 699, usdYearly: 559,
    desc: 'For serious creators & businesses',
    features: [
      '100 posts/month scheduled',
      '500 AI credits per month',
      '5 social platforms',
      '90-day analytics history',
      'All AI tools (captions, scripts, hashtags)',
      'AI Image Generator (DALL-E 3)',
      'Video Studio',
      'Start Page (link-in-bio)',
      'Priority email support',
    ],
    cta: 'Start Pro Plan',
    href: '/signup',
    featured: true,
    badge: 'Most Popular',
  },
  {
    plan: 'Growth',
    inrMonthly: 1299, inrYearly: 1039,
    usdMonthly: 1299, usdYearly: 1039,
    desc: 'For agencies & growing teams',
    features: [
      'Unlimited posts/month',
      'Unlimited AI credits',
      'All 7 social platforms',
      '1-year analytics history',
      'Team collaboration (unlimited seats)',
      'Approval workflows',
      'Client workspaces',
      'White-label reports',
      'API access',
      '24/7 priority support',
    ],
    cta: 'Start Growth Plan',
    href: '/signup',
    featured: false,
    badge: 'Best Value',
  },
];

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime with no questions asked. Your account downgrades to Free at end of billing period. No hidden charges.' },
  { q: 'What payment methods do you accept?', a: 'All major credit/debit cards (Visa, Mastercard, RuPay), UPI, net banking, and wallets via Razorpay.' },
  { q: 'Is there a free trial?', a: 'The Free plan is free forever. Paid plans come with a 14-day free trial — no credit card required.' },
  { q: 'What counts as an AI credit?', a: 'One AI credit = one generation (caption, hashtag set, image, or script). Credits reset monthly.' },
  { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade at any time. Prorated credits apply immediately.' },
  { q: 'How does yearly billing work?', a: 'Yearly plans are billed once per year at a 20% discount. You can switch between monthly and yearly anytime.' },
  { q: 'Do you offer discounts for non-profits or education?', a: 'Yes — contact us at support@zynovexa.com for special pricing.' },
];

const COMPARISON = [
  ['Scheduled posts/month', '5', '30', '100', 'Unlimited'],
  ['AI credits/month', '20', '100', '500', 'Unlimited'],
  ['Social platforms', '2', '3', '5', '7'],
  ['Analytics history', '7 days', '30 days', '90 days', '1 year'],
  ['AI captions & hashtags', '✓', '✓', '✓', '✓'],
  ['Video script generator', '✗', '✓', '✓', '✓'],
  ['AI Image Generator', '✗', '✗', '✓', '✓'],
  ['Video Studio', '✗', '✗', '✓', '✓'],
  ['Start Page (link-in-bio)', '✗', '✗', '✓', '✓'],
  ['Team collaboration', '✗', '✗', '✗', '✓'],
  ['Client workspaces', '✗', '✗', '✗', '✓'],
  ['API access', '✗', '✗', '✗', '✓'],
  ['Priority support', '✗', '✗', '✓', '✓'],
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const currency = 'inr' as const;
  const sym = '₹';
  const paymentNote = 'Secure payments via Razorpay';

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-10 -right-10 opacity-15 hidden lg:block" />
        <div className="max-w-3xl mx-auto relative">
          <span className="badge badge-pink mb-6 inline-block">💰 Pricing</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 text-white">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h1>
          <p className="text-slate-400 text-lg mb-4">Start free. Scale as you grow. Cancel anytime.</p>
          <p className="text-slate-500 text-sm mb-8">No hidden fees &bull; No lock-ins &bull; No surprises</p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !yearly ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
              style={!yearly ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : undefined}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                yearly ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
              style={yearly ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : undefined}
            >
              Yearly
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                Save 20%
              </span>
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="dashboard-inline-stat px-4 py-3 text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Billing style</p>
              <p className="mt-1 text-sm font-semibold text-white">Monthly or yearly</p>
            </div>
            <div className="dashboard-inline-stat px-4 py-3 text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Currency</p>
              <p className="mt-1 text-sm font-semibold text-white">INR pricing only</p>
            </div>
            <div className="dashboard-inline-stat px-4 py-3 text-left">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Commitment</p>
              <p className="mt-1 text-sm font-semibold text-white">Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PLANS.map((tier) => (
            <PricingCard key={tier.plan} tier={tier} yearly={yearly} currency={currency} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-2 text-xs text-slate-500">
            <span>Showing prices in INR (₹)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" /> No hidden charges
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" /> {paymentNote}
          </span>
        </div>
        <p className="text-center text-slate-500 text-sm mt-4">
          Need custom Enterprise pricing?{' '}
          <a href="mailto:enterprise@zynovexa.com" className="text-purple-400 hover:text-purple-300 underline">Contact us →</a>
        </p>
      </section>

      {/* Feature comparison table */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">Compare plans</h2>
          <div className="dashboard-surface overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-4 px-5 text-slate-400 font-medium">Feature</th>
                  <th className="py-4 px-3 text-slate-400 font-medium text-center">Free</th>
                  <th className="py-4 px-3 text-slate-400 font-medium text-center">Starter</th>
                  <th className="py-4 px-3 text-white font-bold text-center" style={{ color: 'var(--accent)' }}>Pro</th>
                  <th className="py-4 px-3 text-slate-400 font-medium text-center">Growth</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([feat, free, starter, pro, growth]) => (
                  <tr key={feat} className="table-row border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3.5 px-5 text-slate-300">{feat}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{free}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{starter}</td>
                    <td className="py-3.5 px-3 text-center text-white font-medium">{pro}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center dashboard-surface p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Start for free. Upgrade anytime.</h2>
          <p className="text-slate-400 mb-6">No credit card required. Cancel anytime. No hidden charges.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Create Free Account</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
