import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Sprout Social 2026 — Best Sprout Social Alternative',
  description: 'Compare Zynovexa vs Sprout Social. Enterprise-grade features at a fraction of the cost. AI content creation, creator monetization, and better value.',
  alternates: { canonical: 'https://zynovexa.com/compare/sprout-social-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: false, detail: 'GPT-4o powered captions' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: false, detail: 'Trending + niche hashtags' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Full short-form video scripts' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'AI-powered virality forecast' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, competitor: true, detail: '7 platforms supported' },
  { feature: 'Smart Inbox', zynovexa: true, competitor: true, detail: 'Unified social inbox' },
  { feature: 'Social Listening', zynovexa: true, competitor: true, detail: 'Brand & keyword monitoring' },
  { feature: 'CRM Integration', zynovexa: true, competitor: true, detail: 'Connect with Salesforce, HubSpot' },
  { feature: 'Analytics & Reports', zynovexa: true, competitor: true, detail: 'Exportable PDF reports' },
  { feature: 'Competitor Analysis', zynovexa: true, competitor: true, detail: 'Benchmark 5 competitors' },
  { feature: 'Team & Workflow', zynovexa: true, competitor: true, detail: 'Approval chains, roles, audit logs' },
  { feature: 'Link-in-Bio Page', zynovexa: true, competitor: false, detail: 'Free Start Page builder' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Sponsorship pipeline management' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto from your analytics' },
  { feature: 'Free Plan Available', zynovexa: true, competitor: false, detail: 'Sprout starts at $249/mo' },
  { feature: 'API Access', zynovexa: true, competitor: true, detail: 'Full REST API' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — 5 posts/month, 2 platforms, 20 AI credits', competitor: 'No free plan available' },
  { plan: 'Starter', zynovexa: '$5/mo — 30 posts/month, 3 platforms, 100 AI credits', competitor: '$249/mo per seat — 5 profiles' },
  { plan: 'Growth', zynovexa: '$19/mo — Unlimited posts, unlimited AI, teams', competitor: '$399/mo per seat — unlimited profiles' },
];

const TESTIMONIALS = [
  { name: 'James H.', role: 'Marketing Director, SaaS Company', quote: 'We were paying $1,200/mo for 3 Sprout Social seats. Switched to Zynovexa Business at $49 and got MORE features. Our CFO loves us now.', avatar: '💼' },
  { name: 'Rachel S.', role: 'Agency Owner, 20+ Clients', quote: 'Sprout Social is great for enterprises but overkill for agencies. Zynovexa has everything we need at 10% of the cost. Plus, the AI features are unmatched.', avatar: '🏢' },
  { name: 'Tom B.', role: 'Brand Manager, DTC Brand', quote: 'Sprout Social analytics are impressive but Zynovexa\'s AI growth recommendations are actually more actionable. And the price difference is insane.', avatar: '📊' },
];

const REASONS = [
  { icon: '💸', title: '90% Cost Savings', desc: 'Sprout Social starts at $249/seat/month. Zynovexa Pro is $19/month with comparable features. For a team of 3, that\'s $747 vs $49. You do the math.' },
  { icon: '🤖', title: 'AI Content Creation', desc: 'Sprout Social has zero AI content generation. Zynovexa creates captions, scripts, hashtags, and predicts viral potential — saving hours of manual work every week.' },
  { icon: '🎨', title: 'Creator-Focused', desc: 'Sprout Social is built for enterprise marketing teams. Zynovexa is purpose-built for creators, influencers, and small teams who need power without complexity.' },
  { icon: '💰', title: 'Monetization Tools', desc: 'Brand deal tracking, rate calculators, media kits, and earnings analytics. Sprout Social doesn\'t offer any creator monetization features.' },
  { icon: '⚡', title: 'Faster Onboarding', desc: 'Sprout Social requires days of setup and training. Zynovexa gets you up and running in under 5 minutes with an intuitive, modern UI.' },
  { icon: '🆓', title: 'Real Free Plan', desc: 'No free plan exists for Sprout Social — not even a trial without credit card. Zynovexa offers a generous forever-free tier.' },
];

export default function SproutSocialAlternativePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 marketing-hero-panel">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 Sprout Social Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Sprout Social</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Sprout Social costs $249+/seat/month. Zynovexa delivers enterprise features with AI superpowers at a fraction of the cost. Built for creators, not just corporations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-lg">Switch to Zynovexa — Free</Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">Compare Plans</Link>
          </div>
          <p className="text-slate-600 text-sm mt-4">Free forever plan. No credit card required.</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-blue mb-4 inline-block">Why Switch?</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons to switch from Sprout Social</h2>
          </div>
          <div className="marketing-grid-shell grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map(r => (
              <div key={r.title} className="card card-hover marketing-metric-card premium-tilt-card p-6">
                <span className="text-3xl mb-3 block">{r.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Feature-by-feature comparison</h2>
          </div>
          <div className="marketing-table-shell overflow-hidden">
            <div className="grid grid-cols-12 gap-0 text-sm font-bold border-b p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-5 text-slate-400">Feature</div>
              <div className="col-span-3 text-center gradient-text">Zynovexa</div>
              <div className="col-span-3 text-center text-slate-500">Sprout Social</div>
            </div>
            {FEATURES.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-12 gap-0 p-4 text-sm items-center ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                <div className="col-span-5">
                  <span className="text-slate-300 font-medium">{row.feature}</span>
                  <span className="block text-xs text-slate-600 mt-0.5">{row.detail}</span>
                </div>
                <div className="col-span-3 text-center text-2xl">{row.zynovexa ? '✅' : '❌'}</div>
                <div className="col-span-3 text-center text-2xl">{row.competitor ? '✅' : '❌'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Pricing comparison</h2>
            <p className="text-slate-400">Save up to 90% compared to Sprout Social</p>
          </div>
          <div className="space-y-4">
            {PRICING.map(p => (
              <div key={p.plan} className="marketing-compare-row p-6 grid md:grid-cols-3 gap-4 items-center">
                <div><span className="badge badge-purple text-xs">{p.plan}</span></div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Zynovexa</p>
                  <p className="text-white font-medium text-sm">{p.zynovexa}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sprout Social</p>
                  <p className="text-slate-400 text-sm">{p.competitor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Teams that made the switch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card marketing-metric-card premium-tilt-card p-6 card-hover">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="marketing-callout p-10 sm:p-14">
            <span className="text-5xl mb-4 block">🚀</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to save thousands?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Get enterprise-grade social media management at creator-friendly prices. Start free — no credit card, no contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link href="/compare" className="btn btn-ghost btn-lg">← Back to All Comparisons</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
