import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Pricing — Simple, Transparent Plans | Zynovexa',
  description: 'Zynovexa pricing: Free forever, Pro $29/mo, Business $79/mo. No hidden fees. Start free, upgrade when you\'re ready. Cancel anytime.',
  alternates: { canonical: 'https://zynovexa.com/pricing' },
};

const PLANS = [
  {
    plan: 'Free',
    price: 0,
    desc: 'Perfect to get started',
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
    plan: 'Pro',
    price: 29,
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
      'Email support',
    ],
    cta: 'Start Pro Free',
    href: '/signup',
    featured: true,
    badge: 'Most Popular',
  },
  {
    plan: 'Business',
    price: 79,
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
    cta: 'Start Business Trial',
    href: '/signup',
    featured: false,
    badge: 'Best Value',
  },
];

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime with no questions asked. Your account downgrades to Free at end of billing period.' },
  { q: 'What payment methods do you accept?', a: 'All major credit/debit cards (Visa, Mastercard, Amex), UPI, and PayPal.' },
  { q: 'Is there a free trial?', a: 'Yes — Free plan is free forever. Pro and Business plans have a 14-day free trial, no credit card required.' },
  { q: 'What counts as an AI credit?', a: 'One AI credit = one generation (caption, hashtag set, image, or script). Credits reset monthly.' },
  { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade at any time. Prorated credits apply immediately.' },
  { q: 'Do you offer discounts for non-profits or education?', a: 'Yes — contact us at support@zynovexa.com for special pricing.' },
];

export default function PricingPage() {
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
          <p className="text-slate-500 text-sm">No hidden fees. No lock-ins. No surprises.</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-5 sm:gap-6">
          {PLANS.map(tier => (
            <div key={tier.plan} className={`relative p-7 sm:p-8 rounded-2xl flex flex-col ${tier.featured ? 'pricing-popular' : 'card'}`}>
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge text-white text-xs px-4 py-1.5" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
                  {tier.badge}
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-xl font-black text-white">{tier.plan}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tier.desc}</p>
              </div>
              <div className="mb-7">
                <span className="text-5xl font-black text-white">${tier.price}</span>
                <span className="text-slate-400 text-sm">/mo</span>
                {tier.price === 0 && <span className="block text-xs text-green-400 mt-1">Forever free</span>}
                {tier.price > 0 && <span className="block text-xs text-slate-500 mt-1">14-day free trial</span>}
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={tier.href} className={`btn w-full justify-center ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Need Enterprise pricing for large teams?{' '}
          <a href="mailto:enterprise@zynovexa.com" className="text-purple-400 hover:text-purple-300 underline">Contact us →</a>
        </p>
      </section>

      {/* Feature comparison table */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">Compare plans</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-4 px-5 text-slate-400 font-medium">Feature</th>
                  <th className="py-4 px-3 text-slate-400 font-medium text-center">Free</th>
                  <th className="py-4 px-3 text-white font-bold text-center" style={{ color: 'var(--accent)' }}>Pro</th>
                  <th className="py-4 px-3 text-slate-400 font-medium text-center">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Scheduled posts/month', '5', '100', 'Unlimited'],
                  ['AI credits/month', '20', '500', 'Unlimited'],
                  ['Social platforms', '2', '5', '7'],
                  ['Analytics history', '7 days', '90 days', '1 year'],
                  ['AI captions & hashtags', '✓', '✓', '✓'],
                  ['Video script generator', '✗', '✓', '✓'],
                  ['AI Image Generator', '✗', '✓', '✓'],
                  ['Team collaboration', '✗', '✗', '✓'],
                  ['Client workspaces', '✗', '✗', '✓'],
                  ['API access', '✗', '✗', '✓'],
                  ['Priority support', '✗', '✗', '✓'],
                ].map(([feat, free, pro, biz]) => (
                  <tr key={feat} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3.5 px-5 text-slate-300">{feat}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{free}</td>
                    <td className="py-3.5 px-3 text-center text-white font-medium">{pro}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{biz}</td>
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
          <div className="space-y-4">
            {FAQ.map(faq => (
              <div key={faq.q} className="card p-5 sm:p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Start for free. Upgrade anytime.</h2>
          <p className="text-slate-400 mb-6">No credit card required. Cancel anytime.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Create Free Account</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
