import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Hootsuite 2026 — Best Hootsuite Alternative',
  description: 'Compare Zynovexa vs Hootsuite. Modern UI, AI-powered content, better pricing. See why creators are switching from Hootsuite.',
  alternates: { canonical: 'https://zynovexa.com/compare/hootsuite-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: false, detail: 'GPT-4o captions in 25+ languages' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: false, detail: 'Trending & niche hashtags' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Full Reels/Shorts/TikTok scripts' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'AI predicts virality before posting' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, competitor: true, detail: '7 platforms supported' },
  { feature: 'Bulk Scheduling', zynovexa: true, competitor: true, detail: 'CSV import & bulk upload' },
  { feature: 'Analytics Dashboard', zynovexa: true, competitor: true, detail: 'Real-time + AI insights' },
  { feature: 'Competitor Monitoring', zynovexa: true, competitor: true, detail: 'Track up to 5 competitors' },
  { feature: 'Social Listening', zynovexa: true, competitor: true, detail: 'Brand mention tracking' },
  { feature: 'Team Collaboration', zynovexa: true, competitor: true, detail: 'Approval workflows + roles' },
  { feature: 'Link-in-Bio Page', zynovexa: true, competitor: false, detail: 'Free Start Page' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Monetization dashboard' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto-generated from analytics' },
  { feature: 'Modern UI/UX', zynovexa: true, competitor: false, detail: 'Clean, intuitive design' },
  { feature: 'Unlimited Posts (Free)', zynovexa: true, competitor: false, detail: 'Hootsuite has no free plan' },
  { feature: 'API Access', zynovexa: true, competitor: true, detail: 'REST API for integrations' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — 5 posts/month, 2 platforms, 20 AI credits', competitor: 'No free plan (30-day trial only)' },
  { plan: 'Starter', zynovexa: '$5/mo — 30 posts/month, 3 platforms, 100 AI credits', competitor: '$99/mo — 10 social accounts' },
  { plan: 'Growth', zynovexa: '$19/mo — Unlimited posts, unlimited AI, teams', competitor: '$249/mo — 20 accounts, team features' },
];

const TESTIMONIALS = [
  { name: 'David L.', role: 'Digital Agency Founder', quote: 'We moved 40 client accounts from Hootsuite to Zynovexa. Saved $2,400/month and got better features. The AI alone is worth it.', avatar: '🏢' },
  { name: 'Jen P.', role: 'Social Media Manager', quote: 'Hootsuite felt stuck in 2015. Zynovexa has a modern interface, works faster, and the AI features are a game-changer for content creation.', avatar: '👩‍💻' },
  { name: 'Alex K.', role: 'Brand Strategist, 60K Followers', quote: 'The pricing difference is insane. Zynovexa Business is $49 vs Hootsuite at $249 — and Zynovexa has MORE features.', avatar: '📈' },
];

const REASONS = [
  { icon: '💸', title: '5x Less Expensive', desc: 'Hootsuite Professional costs $99/mo for basic features. Zynovexa Pro is $19/mo with AI content creation, advanced analytics, and more platforms.' },
  { icon: '🤖', title: 'AI Content Creation', desc: 'Hootsuite has no AI content tools. Zynovexa generates captions, hashtags, video scripts, and predicts viral potential — all built-in.' },
  { icon: '🎨', title: 'Modern Interface', desc: 'Hootsuite\'s UI feels dated and cluttered. Zynovexa is built with modern design principles — clean, fast, and intuitive from day one.' },
  { icon: '🆓', title: 'True Free Plan', desc: 'Hootsuite eliminated their free plan. Zynovexa offers a generous free tier with unlimited posts, 3 accounts, and 50 AI credits per month.' },
  { icon: '📊', title: 'Smarter Analytics', desc: 'Beyond basic metrics — get AI-powered growth recommendations, engagement heatmaps, competitor benchmarks, and content performance scores.' },
  { icon: '💰', title: 'Creator Monetization', desc: 'Built-in brand deal tracking, rate calculators, media kits, and earnings dashboards. Hootsuite is built for marketers, Zynovexa is built for creators.' },
];

export default function HootsuiteAlternativePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 marketing-hero-panel">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 Hootsuite Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Hootsuite</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Hootsuite is expensive and outdated. Zynovexa gives you AI content creation, modern design, better analytics, and starts at $0/month.
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
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons to ditch Hootsuite</h2>
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
              <div className="col-span-3 text-center text-slate-500">Hootsuite</div>
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
            <p className="text-slate-400">Save up to 80% compared to Hootsuite</p>
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
                  <p className="text-xs text-slate-500 mb-1">Hootsuite</p>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">What ex-Hootsuite users say</h2>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to leave Hootsuite behind?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join 50,000+ creators who already made the switch. Start free — no credit card, no contracts.
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
