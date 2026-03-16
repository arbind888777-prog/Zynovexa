import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Competitors | Best Buffer Alternative 2026',
  description: 'See how Zynovexa compares to Buffer, Hootsuite, Sprout Social, Later, and SocialBee. The best AI social media management tool for creators.',
};

const COMPETITORS = ['Gudsho', 'Buffer', 'Hootsuite', 'Sprout Social', 'Later', 'SocialBee', 'Planable'];

const FEATURES_COMPARE = [
  { feature: 'AI Content Generation', zynovexa: true, others: false, note: 'GPT-4o powered' },
  { feature: 'Unlimited Posts (Free)', zynovexa: true, others: false, note: 'Free forever plan' },
  { feature: 'Analytics & Insights', zynovexa: true, others: true, note: 'Real-time + historical' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, others: true, note: '6 platforms' },
  { feature: 'AI Hashtag Generator', zynovexa: true, others: false, note: 'Data-driven hashtags' },
  { feature: 'Video Script Generator', zynovexa: true, others: false, note: 'Full scripts' },
  { feature: 'Viral Score Prediction', zynovexa: true, others: false, note: 'Unique to Zynovexa' },
  { feature: 'Team Collaboration', zynovexa: true, others: true, note: 'All plans' },
  { feature: 'Link-in-Bio Page', zynovexa: true, others: false, note: 'Free Start Page' },
  { feature: 'Custom Branding', zynovexa: true, others: false, note: 'Pro+ only for others' },
  { feature: 'Nonprofit Discount', zynovexa: true, others: false, note: '50% off' },
  { feature: 'API Access', zynovexa: true, others: true, note: 'Business plan' },
];

const ALTS = [
  { competitor: 'Gudsho', href: '/compare/gudsho-alternative', tagline: 'More AI power, deeper analytics & scheduling' },
  { competitor: 'Buffer', href: '/compare/buffer-alternative', tagline: 'Better AI + more features at half the price' },
  { competitor: 'Hootsuite', href: '/compare/hootsuite-alternative', tagline: 'Modern interface, smarter automation' },
  { competitor: 'Sprout Social', href: '/compare/sprout-social-alternative', tagline: 'Enterprise power at creator prices' },
  { competitor: 'Later', href: '/compare/later-alternative', tagline: 'More platforms, deeper analytics' },
  { competitor: 'SocialBee', href: '/compare/socialbee-alternative', tagline: 'AI-first with better content recycling' },
  { competitor: 'Planable', href: '/compare/planable-alternative', tagline: 'Faster approvals, smarter content creation' },
];

export default function ComparePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🏆 How We Compare</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs<br /><span className="gradient-text">The Competition</span>
          </h1>
          <p className="text-slate-400 text-xl mb-8 max-w-2xl mx-auto">
            We did the research so you don't have to. See exactly why 50,000+ creators switched to Zynovexa.
          </p>
        </div>
      </section>

      {/* Compare All CTA */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/compare/all" className="btn btn-primary btn-lg inline-flex items-center gap-2">
            <span>⚡</span> Compare All Competitors at Once
          </Link>
        </div>
      </section>

      {/* Competitor links */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALTS.map(a => (
            <Link key={a.competitor} href={a.href}
              className="card card-hover p-5 group">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">Zynovexa vs {a.competitor}</h3>
                <span className="text-purple-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="text-xs text-slate-400">{a.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">Feature-by-feature comparison</h2>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-3 gap-0 text-sm font-bold border-b p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="text-slate-400">Feature</div>
              <div className="text-center gradient-text">Zynovexa</div>
              <div className="text-center text-slate-500">Competitors</div>
            </div>
            {FEATURES_COMPARE.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 gap-0 p-4 text-sm items-center ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                <div>
                  <span className="text-slate-300 font-medium">{row.feature}</span>
                  {row.note && <span className="block text-xs text-slate-600">{row.note}</span>}
                </div>
                <div className="text-center text-2xl">{row.zynovexa ? '✅' : '❌'}</div>
                <div className="text-center text-2xl">{row.others ? '✅' : '❌'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">Make the switch today</h2>
          <p className="text-slate-400 mb-8">Join the thousands who switched from {COMPETITORS.slice(0, 3).join(', ')} to Zynovexa. Free migration help included.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Start Free — No Credit Card</Link>
            <Link href="/pricing" className="btn btn-secondary btn-xl">Compare Pricing</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
