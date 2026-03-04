import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Program | Zynovexa',
  description: 'Join the Zynovexa partner program. Earn recurring commissions, get co-marketing support, and grow your business alongside ours.',
};

const TIERS = [
  {
    name: 'Affiliate',
    commission: '20%',
    recurring: true,
    payout: 'Monthly',
    features: ['Unique referral link', 'Real-time dashboard', 'Marketing materials', '$50 min payout'],
    cta: 'Join Free',
    highlight: false,
  },
  {
    name: 'Agency Partner',
    commission: '30%',
    recurring: true,
    payout: 'Monthly',
    features: ['All Affiliate benefits', 'Client sub-accounts', 'White-label options', 'Priority support', 'Co-marketing opportunities'],
    cta: 'Apply Now',
    highlight: true,
  },
  {
    name: 'Technology Partner',
    commission: 'Custom',
    recurring: true,
    payout: 'Negotiable',
    features: ['API integration listing', 'Joint press releases', 'Dedicated partner manager', 'Revenue share', 'Product roadmap input'],
    cta: 'Contact Us',
    highlight: false,
  },
];

const BENEFITS = [
  { icon: '💰', title: 'Recurring Revenue', desc: 'Earn 20-30% recurring commission for the lifetime of every customer you refer.' },
  { icon: '📊', title: 'Real-time Dashboard', desc: 'Track clicks, signups, conversions, and earnings in your partner portal.' },
  { icon: '🎨', title: 'Marketing Materials', desc: 'Professionally designed banners, landing pages, email templates, and more.' },
  { icon: '🚀', title: 'Co-marketing', desc: 'Featured in our partner directory, joint webinars, social media shoutouts.' },
];

export default function PartnerProgramPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🤝 Partner Program</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Earn with<br /><span className="gradient-text">Zynovexa</span>
          </h1>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            Refer creators to Zynovexa and earn up to 30% recurring commission. Our top affiliates earn $5,000+ per month.
          </p>
          <Link href="/signup" className="btn btn-primary btn-xl">Become a Partner →</Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BENEFITS.map(b => (
            <div key={b.title} className="card p-6 flex gap-4">
              <span className="text-3xl shrink-0">{b.icon}</span>
              <div>
                <h3 className="font-bold text-white mb-1">{b.title}</h3>
                <p className="text-sm text-slate-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Partner tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map(tier => (
              <div key={tier.name} className={`card p-7 flex flex-col relative ${tier.highlight ? 'ring-2 ring-indigo-500' : ''}`}>
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Most Popular</span>
                )}
                <h3 className="text-xl font-black text-white mb-1">{tier.name}</h3>
                <div className="text-4xl font-black gradient-text mb-4">{tier.commission}</div>
                <p className="text-xs text-slate-500 mb-4 -mt-2">recurring commission • paid {tier.payout.toLowerCase()}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-green-400 shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`btn w-full justify-center ${tier.highlight ? 'btn-primary' : 'btn-secondary'}`}>{tier.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">Ready to start earning?</h2>
          <p className="text-slate-400 mb-6">Sign up in 2 minutes. Get your link. Start earning today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary">Join Partner Program</Link>
            <Link href="mailto:partners@zynovexa.com" className="btn btn-secondary">Talk to Partnership Team</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
