import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs SocialBee 2026 — Best SocialBee Alternative',
  description: 'Compare Zynovexa vs SocialBee. AI-first content creation, better content recycling, and more powerful analytics. Switch to Zynovexa today.',
  alternates: { canonical: 'https://zynovexa.com/compare/socialbee-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: true, detail: 'GPT-4o powered vs basic AI' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: false, detail: 'Trending + niche hashtags' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Full short-form video scripts' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'Predict post performance' },
  { feature: 'Content Categories', zynovexa: true, competitor: true, detail: 'Organize by type/topic' },
  { feature: 'Content Recycling', zynovexa: true, competitor: true, detail: 'Auto-repost evergreen content' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, competitor: true, detail: '7 platforms supported' },
  { feature: 'RSS Auto-posting', zynovexa: true, competitor: true, detail: 'Import from RSS feeds' },
  { feature: 'Analytics Dashboard', zynovexa: true, competitor: true, detail: 'Real-time + AI insights' },
  { feature: 'Competitor Benchmarking', zynovexa: true, competitor: false, detail: 'Track 5 competitors' },
  { feature: 'Team Collaboration', zynovexa: true, competitor: true, detail: 'Multi-step approval workflows' },
  { feature: 'Link-in-Bio Page', zynovexa: true, competitor: false, detail: 'Free Start Page builder' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Sponsorship management' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto from your analytics' },
  { feature: 'Unlimited Posts (Free)', zynovexa: true, competitor: false, detail: 'SocialBee has no free plan' },
  { feature: 'Canva Integration', zynovexa: true, competitor: true, detail: 'Design in-app' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — Unlimited posts, 3 accounts, AI credits', competitor: 'No free plan (14-day trial only)' },
  { plan: 'Pro / Bootstrap', zynovexa: '$19/mo — 10 accounts, 500 AI credits', competitor: '$29/mo — 5 profiles, 1 workspace' },
  { plan: 'Business / Accelerate', zynovexa: '$49/mo — 25 accounts, unlimited AI, teams', competitor: '$49/mo — 10 profiles, 1 workspace' },
];

const TESTIMONIALS = [
  { name: 'Laura C.', role: 'Content Marketing Manager', quote: 'SocialBee\'s content categories are nice but Zynovexa does that AND gives you AI content creation. It\'s like SocialBee + ChatGPT in one tool.', avatar: '📝' },
  { name: 'Mike T.', role: 'Solopreneur, 45K Followers', quote: 'I loved SocialBee\'s recycling feature. Zynovexa has that too, plus viral score prediction and a free plan. Easy switch.', avatar: '🚀' },
  { name: 'Deena R.', role: 'Social Media Agency, 12 Clients', quote: 'For agencies managing multiple clients, Zynovexa\'s pricing is way better than SocialBee. More profiles, more features, better AI.', avatar: '🏢' },
];

const REASONS = [
  { icon: '🤖', title: 'AI-First Approach', desc: 'SocialBee recently added basic AI. Zynovexa was built AI-first from day one — GPT-4o captions, video scripts, hashtag generation, and viral score prediction are core features.' },
  { icon: '📊', title: 'Superior Analytics', desc: 'SocialBee analytics are basic. Zynovexa provides competitor benchmarking, engagement heatmaps, AI growth recommendations, and cross-platform performance insights.' },
  { icon: '🆓', title: 'Free Plan Available', desc: 'SocialBee has no free plan — just a 14-day trial. Zynovexa\'s free plan gives you unlimited posts, 3 accounts, and 50 AI credits forever.' },
  { icon: '💰', title: 'Monetization Built-In', desc: 'Track brand deals, calculate rates, generate media kits, and analyze earnings. SocialBee doesn\'t help you make money — Zynovexa does.' },
  { icon: '🔗', title: 'Link-in-Bio Included', desc: 'Get a beautiful, customizable Start Page for free. SocialBee doesn\'t offer any link-in-bio solution.' },
  { icon: '📱', title: 'More Platform Support', desc: 'Zynovexa supports 7 platforms including Google Business Profile. Content recycling works across all of them with smart variety optimization.' },
];

export default function SocialBeeAlternativePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 SocialBee Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">SocialBee</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            SocialBee is solid for content recycling — but Zynovexa gives you AI-first content creation, deeper analytics, monetization tools, and a free plan to get started.
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
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons to switch from SocialBee</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map(r => (
              <div key={r.title} className="card card-hover p-6">
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
          <div className="card overflow-hidden">
            <div className="grid grid-cols-12 gap-0 text-sm font-bold border-b p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-5 text-slate-400">Feature</div>
              <div className="col-span-3 text-center gradient-text">Zynovexa</div>
              <div className="col-span-3 text-center text-slate-500">SocialBee</div>
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
          </div>
          <div className="space-y-4">
            {PRICING.map(p => (
              <div key={p.plan} className="card p-6 grid md:grid-cols-3 gap-4 items-center">
                <div><span className="badge badge-purple text-xs">{p.plan}</span></div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Zynovexa</p>
                  <p className="text-white font-medium text-sm">{p.zynovexa}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">SocialBee</p>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">What switchers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6 card-hover">
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
          <div className="card p-10 sm:p-14" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
            <span className="text-5xl mb-4 block">🚀</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to switch from SocialBee?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Get everything SocialBee offers plus AI superpowers and monetization tools. Start free today.
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
