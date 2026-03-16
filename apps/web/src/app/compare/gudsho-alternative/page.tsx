import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Gudsho 2026 — Best Gudsho Alternative for Creators',
  description: 'Compare Zynovexa vs Gudsho side-by-side. See why 50,000+ creators choose Zynovexa for AI content generation, scheduling, analytics, and monetization.',
  alternates: { canonical: 'https://zynovexa.com/compare/gudsho-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: false, detail: 'GPT-4o powered captions in 25+ languages' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: false, detail: 'Data-driven trending & niche hashtags' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Full scripts for Reels, Shorts & TikTok' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'AI predicts post virality before publishing' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, competitor: true, detail: 'Instagram, TikTok, YouTube, X, LinkedIn, Facebook' },
  { feature: 'Visual Content Calendar', zynovexa: true, competitor: true, detail: 'Drag-and-drop calendar view' },
  { feature: 'Analytics Dashboard', zynovexa: true, competitor: true, detail: 'Real-time + historical data' },
  { feature: 'Competitor Benchmarking', zynovexa: true, competitor: false, detail: 'Track up to 5 competitor accounts' },
  { feature: 'Best Time to Post', zynovexa: true, competitor: true, detail: 'AI-powered heatmap analysis' },
  { feature: 'Team Collaboration', zynovexa: true, competitor: false, detail: 'Multi-step approval workflows' },
  { feature: 'Link-in-Bio Page', zynovexa: true, competitor: false, detail: 'Free Start Page with custom branding' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Track sponsorships, earnings & invoices' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto-generated media kit from your analytics' },
  { feature: 'AI Chat Assistant', zynovexa: true, competitor: false, detail: 'Conversational AI for growth strategies' },
  { feature: 'Unlimited Posts (Free Plan)', zynovexa: true, competitor: false, detail: 'No post limits on free tier' },
  { feature: 'API Access', zynovexa: true, competitor: false, detail: 'Full REST API for custom integrations' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — Unlimited posts, 3 accounts, 50 AI credits', competitor: 'Limited free trial only' },
  { plan: 'Pro', zynovexa: '$19/mo — 10 accounts, 500 AI credits, full analytics', competitor: '$25+/mo — Basic scheduling only' },
  { plan: 'Business', zynovexa: '$49/mo — 25 accounts, unlimited AI, team features', competitor: '$50+/mo — Limited features' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Fashion Creator, 120K Followers', quote: 'Switched from Gudsho to Zynovexa and my engagement doubled in 2 months. The AI captions are 🔥', avatar: '👩‍🎨' },
  { name: 'Rahul M.', role: 'Tech YouTuber, 80K Subscribers', quote: 'Gudsho had basic scheduling but Zynovexa\'s AI features are on another level. Viral score prediction actually works!', avatar: '🧑‍💻' },
  { name: 'Anita K.', role: 'Food Blogger, 200K Followers', quote: 'The brand deal tracker alone saved me hours every week. Best switch I ever made.', avatar: '👩‍🍳' },
];

const REASONS = [
  { icon: '🤖', title: 'AI-First Platform', desc: 'While Gudsho focuses primarily on basic scheduling and publishing, Zynovexa is built AI-first — from caption generation to viral score prediction to automated growth strategies.' },
  { icon: '💰', title: 'Better Value for Money', desc: 'Get more features at a lower price. Our free plan alone includes more than most competitors\' paid tiers, including unlimited posts and AI credits.' },
  { icon: '📊', title: 'Deeper Analytics', desc: 'Go beyond basic metrics. Zynovexa offers competitor benchmarking, engagement heatmaps, AI growth recommendations, and real-time performance tracking.' },
  { icon: '🎯', title: 'Monetization Tools', desc: 'Zynovexa is the only platform with built-in brand deal tracking, rate calculators, media kit generators, and earnings analytics — perfect for creators who monetize.' },
  { icon: '⚡', title: 'All-in-One Solution', desc: 'Instead of juggling multiple tools, get scheduling, analytics, AI content creation, monetization, team collaboration, and link-in-bio — all in one platform.' },
  { icon: '🔒', title: 'Privacy & Security', desc: 'Enterprise-grade security with encrypted data, role-based access controls, and full GDPR compliance. Your data stays yours.' },
];

export default function GudshoAlternativePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 Gudsho Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Gudsho</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Looking for a better alternative to Gudsho? Zynovexa gives you AI-powered content creation, smarter scheduling, deeper analytics, and monetization tools — all at a better price.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-lg">Switch to Zynovexa — Free</Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">Compare Plans</Link>
          </div>
          <p className="text-slate-600 text-sm mt-4">Free forever plan. No credit card required. Migrate in 5 minutes.</p>
        </div>
      </section>

      {/* Why Switch */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-blue mb-4 inline-block">Why Switch?</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons creators choose Zynovexa over Gudsho</h2>
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

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Feature-by-feature comparison</h2>
            <p className="text-slate-400">See exactly what you get with each platform</p>
          </div>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-12 gap-0 text-sm font-bold border-b p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-5 text-slate-400">Feature</div>
              <div className="col-span-3 text-center gradient-text">Zynovexa</div>
              <div className="col-span-3 text-center text-slate-500">Gudsho</div>
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

      {/* Pricing Comparison */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Pricing comparison</h2>
            <p className="text-slate-400">Get more features for less money with Zynovexa</p>
          </div>
          <div className="space-y-4">
            {PRICING.map(p => (
              <div key={p.plan} className="card p-6 grid md:grid-cols-3 gap-4 items-center">
                <div>
                  <span className="badge badge-purple text-xs">{p.plan}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Zynovexa</p>
                  <p className="text-white font-medium text-sm">{p.zynovexa}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Gudsho</p>
                  <p className="text-slate-400 text-sm">{p.competitor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Creators who switched love it</h2>
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

      {/* Migration CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-10 sm:p-14" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
            <span className="text-5xl mb-4 block">🚀</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to switch from Gudsho?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Migrate your content and accounts in under 5 minutes. Our free plan includes everything you need to get started — no credit card required.
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
