import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Later 2026 — Best Later Alternative for Creators',
  description: 'Compare Zynovexa vs Later. More platforms, AI content creation, deeper analytics, and better monetization tools. Switch to Zynovexa today.',
  alternates: { canonical: 'https://zynovexa.com/compare/later-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: true, detail: 'GPT-4o powered vs Later\'s basic AI' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: true, detail: 'Trending + niche hashtags' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Full short-form video scripts' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'AI predicts post performance' },
  { feature: 'Instagram Scheduling', zynovexa: true, competitor: true, detail: 'Stories, Reels, Posts, Carousels' },
  { feature: 'Short-form Video Scheduling', zynovexa: true, competitor: true, detail: 'Auto-publish support' },
  { feature: 'YouTube Scheduling', zynovexa: true, competitor: false, detail: 'Shorts + long-form videos' },
  { feature: 'Twitter/X Scheduling', zynovexa: true, competitor: true, detail: 'Threads, polls, media' },
  { feature: 'LinkedIn Scheduling', zynovexa: true, competitor: true, detail: 'Personal & company pages' },
  { feature: 'Visual Content Calendar', zynovexa: true, competitor: true, detail: 'Drag-and-drop calendar' },
  { feature: 'Analytics Dashboard', zynovexa: true, competitor: true, detail: 'AI-powered deep insights' },
  { feature: 'Competitor Benchmarking', zynovexa: true, competitor: false, detail: 'Track 5 competitor accounts' },
  { feature: 'Link-in-Bio (Linkin.bio)', zynovexa: true, competitor: true, detail: 'Full Start Page builder' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Sponsorship management' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto-generated media kits' },
  { feature: 'Unlimited Posts (Free)', zynovexa: true, competitor: false, detail: 'Later free = 5 posts/profile' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — 5 posts/month, 2 platforms, 20 AI credits', competitor: '$0/mo — 5 posts per profile, 1 social set' },
  { plan: 'Starter', zynovexa: '$5/mo — 30 posts/month, 3 platforms, 100 AI credits', competitor: '$25/mo — 30 posts/profile, 1 social set' },
  { plan: 'Growth', zynovexa: '$19/mo — Unlimited posts, unlimited AI, teams', competitor: '$45/mo — 150 posts/profile, 3 social sets' },
];

const TESTIMONIALS = [
  { name: 'Mia W.', role: 'Instagram Creator, 175K Followers', quote: 'Later was my go-to for visual planning but it lacked AI. Zynovexa gives me the visual calendar PLUS AI captions and viral scores. Game changer.', avatar: '📸' },
  { name: 'Carlos R.', role: 'Content Strategy Consultant', quote: 'Later\'s post limits drove me crazy. Zynovexa unlimited posts on free tier? That alone made me switch 8 clients over.', avatar: '🎯' },
  { name: 'Nina L.', role: 'Beauty & Lifestyle, 90K Followers', quote: 'I used Later for 3 years. Zynovexa has everything Later has plus monetization tools and way better AI. No regrets.', avatar: '💄' },
];

const REASONS = [
  { icon: '🤖', title: 'Superior AI Engine', desc: 'Later added basic AI recently, but Zynovexa is AI-first — GPT-4o captions, video scripts, viral predictions, and growth strategies are core features, not afterthoughts.' },
  { icon: '📱', title: 'More Platforms', desc: 'Later doesn\'t support YouTube scheduling. Zynovexa covers Instagram, YouTube, Twitter/X, LinkedIn, Facebook, and Google Business — all from one dashboard.' },
  { icon: '🔓', title: 'No Post Limits', desc: 'Later\'s free plan caps you at 5 posts per profile. Zynovexa free plan gives you unlimited posts across 3 accounts with no restrictions.' },
  { icon: '💰', title: 'Monetization Suite', desc: 'Track brand deals, calculate your rates, generate media kits, and analyze earnings. Later focuses purely on scheduling — Zynovexa helps you actually make money.' },
  { icon: '📊', title: 'Advanced Analytics', desc: 'Later analytics are decent for Instagram. Zynovexa gives you cross-platform analytics, competitor benchmarking, engagement heatmaps, and AI recommendations.' },
  { icon: '👥', title: 'Better Team Tools', desc: 'Multi-step approval workflows, inline comments, role-based permissions, and audit logs. Later\'s team features are limited to higher-priced tiers.' },
];

export default function LaterAlternativePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 marketing-hero-panel">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 Later Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Later</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Later is great for visual Instagram planning — but creators need more. Zynovexa gives you AI-first content creation, more platforms, unlimited posts, and monetization tools.
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
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons to upgrade from Later</h2>
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
              <div className="col-span-3 text-center text-slate-500">Later</div>
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
              <div key={p.plan} className="marketing-compare-row p-6 grid md:grid-cols-3 gap-4 items-center">
                <div><span className="badge badge-purple text-xs">{p.plan}</span></div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Zynovexa</p>
                  <p className="text-white font-medium text-sm">{p.zynovexa}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Later</p>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ex-Later users love Zynovexa</h2>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to level up from Later?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Start free today. Unlimited posts, AI-powered content, and real monetization tools — all in one platform.
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
