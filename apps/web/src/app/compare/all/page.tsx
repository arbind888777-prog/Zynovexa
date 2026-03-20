import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs All Competitors — Complete Comparison 2026',
  description: 'Compare Zynovexa against Gudsho, Buffer, Hootsuite, Later, Sprout Social, SocialBee, and Planable — all in one place. Side-by-side features, pricing, and more.',
  alternates: { canonical: 'https://zynovexa.com/compare/all' },
};

const COMPETITORS = ['Gudsho', 'Buffer', 'Hootsuite', 'Later', 'Sprout Social', 'SocialBee', 'Planable'] as const;

const FEATURES: Array<{ feature: string; zynovexa: boolean; competitors: Record<string, boolean> }> = [
  {
    feature: 'AI Caption Generator (GPT-4o)',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: true, 'Sprout Social': false, SocialBee: true, Planable: true },
  },
  {
    feature: 'AI Hashtag Generator',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: true, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'AI Video Script Writer',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'Viral Score Prediction',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'AI Chat Assistant',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'Multi-platform Scheduling',
    zynovexa: true,
    competitors: { Gudsho: true, Buffer: true, Hootsuite: true, Later: true, 'Sprout Social': true, SocialBee: true, Planable: true },
  },
  {
    feature: 'Visual Content Calendar',
    zynovexa: true,
    competitors: { Gudsho: true, Buffer: true, Hootsuite: true, Later: true, 'Sprout Social': true, SocialBee: true, Planable: true },
  },
  {
    feature: 'Analytics & Reporting',
    zynovexa: true,
    competitors: { Gudsho: true, Buffer: true, Hootsuite: true, Later: true, 'Sprout Social': true, SocialBee: true, Planable: false },
  },
  {
    feature: 'Competitor Benchmarking',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: true, Later: false, 'Sprout Social': true, SocialBee: false, Planable: false },
  },
  {
    feature: 'Best Time to Post (AI)',
    zynovexa: true,
    competitors: { Gudsho: true, Buffer: true, Hootsuite: true, Later: true, 'Sprout Social': true, SocialBee: false, Planable: false },
  },
  {
    feature: 'Team Collaboration',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: true, Hootsuite: true, Later: false, 'Sprout Social': true, SocialBee: true, Planable: true },
  },
  {
    feature: 'Approval Workflows',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: true, Later: false, 'Sprout Social': true, SocialBee: false, Planable: true },
  },
  {
    feature: 'Content Recycling',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: true, Planable: false },
  },
  {
    feature: 'Link-in-Bio Page',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: true, Hootsuite: false, Later: true, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'Brand Deal Tracker',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'Media Kit Generator',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'Social Listening',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: true, Later: false, 'Sprout Social': true, SocialBee: false, Planable: false },
  },
  {
    feature: 'CRM Integrations',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: true, Later: false, 'Sprout Social': true, SocialBee: false, Planable: false },
  },
  {
    feature: 'Free Plan Available',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: true, Hootsuite: false, Later: true, 'Sprout Social': false, SocialBee: false, Planable: true },
  },
  {
    feature: 'Unlimited Posts (Free)',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: false, Hootsuite: false, Later: false, 'Sprout Social': false, SocialBee: false, Planable: false },
  },
  {
    feature: 'API Access',
    zynovexa: true,
    competitors: { Gudsho: false, Buffer: true, Hootsuite: true, Later: false, 'Sprout Social': true, SocialBee: false, Planable: false },
  },
];

const PRICING: Array<{ competitor: string; free: string; pro: string; business: string }> = [
  { competitor: 'Zynovexa', free: '$0 — 5 posts/month, 2 platforms, 20 AI credits', pro: '$5/mo — Starter with 30 posts, 3 platforms, 100 AI', business: '$19/mo — Growth with unlimited posts, unlimited AI, team workflows' },
  { competitor: 'Gudsho', free: 'No free plan', pro: '$25+/mo — Basic scheduling', business: '$50+/mo — Limited features' },
  { competitor: 'Buffer', free: '$0 — 10 posts/channel', pro: '$6/mo per channel', business: '$120/mo — 10 channels' },
  { competitor: 'Hootsuite', free: 'No free plan', pro: '$99/mo — 10 accounts', business: '$249/mo — 20 accounts' },
  { competitor: 'Later', free: '$0 — 5 posts/profile', pro: '$25/mo — 30 posts/profile', business: '$45/mo — 150 posts/profile' },
  { competitor: 'Sprout Social', free: 'No free plan', pro: '$249/mo per seat', business: '$399/mo per seat' },
  { competitor: 'SocialBee', free: 'No free plan', pro: '$29/mo — 5 profiles', business: '$49/mo — 10 profiles' },
  { competitor: 'Planable', free: '$0 — 50 total posts', pro: '$33/mo per workspace', business: '$83/mo per workspace' },
];

const SCORE_DATA = COMPETITORS.map(name => {
  const total = FEATURES.length;
  const has = FEATURES.filter(f => f.competitors[name]).length;
  return { name, score: has, total };
});
const zynScore = FEATURES.filter(f => f.zynovexa).length;

export default function CompareAllPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 marketing-hero-panel">
          <span className="badge badge-purple mb-4 inline-block">⚡ Ultimate Comparison</span>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Everyone</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
            One page. Seven competitors. {FEATURES.length} features. See exactly how Zynovexa stacks up against Gudsho, Buffer, Hootsuite, Later, Sprout Social, SocialBee, and Planable — all at once.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
            <span className="marketing-logo-pill">Full feature matrix</span>
            <span className="marketing-logo-pill">Pricing context in one scan</span>
            <span className="marketing-logo-pill">Deep-dive links for each competitor</span>
          </div>
        </div>
      </section>

      {/* Score Summary */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8">Feature Score ({FEATURES.length} features tested)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Zynovexa first */}
            <div className="card marketing-metric-card premium-tilt-card p-5 text-center" style={{ border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.08)' }}>
              <p className="text-3xl font-black gradient-text">{zynScore}/{FEATURES.length}</p>
              <p className="text-sm font-bold text-white mt-1">Zynovexa</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                <div className="h-2 rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              </div>
            </div>
            {SCORE_DATA.map(s => (
              <div key={s.name} className="card marketing-metric-card premium-tilt-card p-5 text-center">
                <p className="text-3xl font-black text-slate-300">{s.score}/{s.total}</p>
                <p className="text-sm font-medium text-slate-400 mt-1">{s.name}</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                  <div className="h-2 rounded-full bg-slate-600" style={{ width: `${(s.score / s.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">Complete Feature Matrix</h2>
          <div className="marketing-table-shell overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-4 text-slate-400 font-bold sticky left-0 bg-[var(--surface)] min-w-[200px]">Feature</th>
                  <th className="p-4 text-center min-w-[90px]"><span className="gradient-text font-bold">Zynovexa</span></th>
                  {COMPETITORS.map(c => (
                    <th key={c} className="p-4 text-center text-slate-500 font-medium min-w-[90px]">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row, i) => (
                  <tr key={row.feature} className={i % 2 !== 0 ? 'bg-white/[0.02]' : ''}>
                    <td className="p-4 text-slate-300 font-medium sticky left-0 bg-[var(--surface)]">{row.feature}</td>
                    <td className="p-4 text-center text-xl">{row.zynovexa ? '✅' : '❌'}</td>
                    {COMPETITORS.map(c => (
                      <td key={c} className="p-4 text-center text-xl">{row.competitors[c] ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">Pricing Across All Platforms</h2>
          <div className="marketing-table-shell overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-4 text-slate-400 font-bold sticky left-0 bg-[var(--surface)] min-w-[120px]">Platform</th>
                  <th className="p-4 text-left text-slate-400 min-w-[220px]">Free Plan</th>
                  <th className="p-4 text-left text-slate-400 min-w-[220px]">Entry Paid Plan</th>
                  <th className="p-4 text-left text-slate-400 min-w-[220px]">Top Team Plan</th>
                </tr>
              </thead>
              <tbody>
                {PRICING.map((row, i) => (
                  <tr key={row.competitor} className={`${i % 2 !== 0 ? 'bg-white/[0.02]' : ''} ${row.competitor === 'Zynovexa' ? '' : ''}`}
                    style={row.competitor === 'Zynovexa' ? { background: 'rgba(99,102,241,0.06)', borderLeft: '3px solid #6366f1' } : {}}>
                    <td className={`p-4 font-bold sticky left-0 ${row.competitor === 'Zynovexa' ? 'gradient-text' : 'text-slate-300'}`}
                      style={row.competitor === 'Zynovexa' ? { background: 'rgba(99,102,241,0.06)' } : { background: 'var(--surface)' }}>
                      {row.competitor}
                    </td>
                    <td className="p-4 text-slate-300">{row.free}</td>
                    <td className="p-4 text-slate-300">{row.pro}</td>
                    <td className="p-4 text-slate-300">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Winner Summary */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">The Verdict</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="card marketing-metric-card premium-tilt-card p-6 text-center card-hover">
              <span className="text-4xl block mb-3">🤖</span>
              <h3 className="text-white font-bold mb-2">Best for AI</h3>
              <p className="text-slate-400 text-sm">Zynovexa is the only platform with GPT-4o captions, video scripts, hashtag gen, viral prediction, AND an AI chat assistant.</p>
            </div>
            <div className="card marketing-metric-card premium-tilt-card p-6 text-center card-hover">
              <span className="text-4xl block mb-3">💰</span>
              <h3 className="text-white font-bold mb-2">Best Value</h3>
              <p className="text-slate-400 text-sm">A real free plan plus paid tiers that start at $5/mo and scale to team workflows without enterprise-style pricing.</p>
            </div>
            <div className="card marketing-metric-card premium-tilt-card p-6 text-center card-hover">
              <span className="text-4xl block mb-3">🎯</span>
              <h3 className="text-white font-bold mb-2">Best for Creators</h3>
              <p className="text-slate-400 text-sm">Only platform with brand deal tracking, media kit generator, rate calculator, and earnings analytics built-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Compare Links */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center mb-8">Dive deeper into each comparison</h2>
          <div className="marketing-grid-shell grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Gudsho', href: '/compare/gudsho-alternative' },
              { name: 'Buffer', href: '/compare/buffer-alternative' },
              { name: 'Hootsuite', href: '/compare/hootsuite-alternative' },
              { name: 'Later', href: '/compare/later-alternative' },
              { name: 'Sprout Social', href: '/compare/sprout-social-alternative' },
              { name: 'SocialBee', href: '/compare/socialbee-alternative' },
              { name: 'Planable', href: '/compare/planable-alternative' },
            ].map(c => (
              <Link key={c.name} href={c.href} className="card card-hover marketing-metric-card premium-tilt-card interactive-card-link p-4 text-center group">
                <p className="text-white font-bold text-sm group-hover:text-purple-300 transition-colors">vs {c.name}</p>
                <span className="text-purple-400 text-xs">View details →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="marketing-callout p-10 sm:p-14">
            <span className="text-5xl mb-4 block">🏆</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{zynScore}/{FEATURES.length} features. Zero compromises.</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              No other platform comes close. Start free today and see why 50,000+ creators chose Zynovexa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="btn btn-primary btn-lg">Start Free — No Credit Card</Link>
              <Link href="/pricing" className="btn btn-ghost btn-lg">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
