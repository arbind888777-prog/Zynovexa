import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Buffer 2026 — Best Buffer Alternative for Creators',
  description: 'Compare Zynovexa vs Buffer side-by-side. AI content creation, deeper analytics, and more features at half the price. Switch today.',
  alternates: { canonical: 'https://zynovexa.com/compare/buffer-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: false, detail: 'GPT-4o powered captions in 25+ languages' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: false, detail: 'Trending & niche-specific hashtags' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Complete scripts for short-form video' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'Predict post performance before publishing' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, competitor: true, detail: 'Schedule across 7 platforms' },
  { feature: 'Visual Content Calendar', zynovexa: true, competitor: true, detail: 'Drag-and-drop calendar' },
  { feature: 'Analytics Dashboard', zynovexa: true, competitor: true, detail: 'Real-time analytics with AI insights' },
  { feature: 'Competitor Benchmarking', zynovexa: true, competitor: false, detail: 'Track 5 competitor accounts' },
  { feature: 'Best Time to Post', zynovexa: true, competitor: true, detail: 'AI-powered optimal timing' },
  { feature: 'Team Collaboration', zynovexa: true, competitor: true, detail: 'Multi-step approval workflows' },
  { feature: 'Link-in-Bio Page', zynovexa: true, competitor: true, detail: 'Customizable Start Page' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Track sponsorships & earnings' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto-generate from analytics' },
  { feature: 'AI Chat Assistant', zynovexa: true, competitor: false, detail: 'Growth strategies on-demand' },
  { feature: 'Unlimited Posts (Free)', zynovexa: true, competitor: false, detail: 'Buffer limits to 10 posts/channel' },
  { feature: 'Custom Branding', zynovexa: true, competitor: false, detail: 'White-label reports & pages' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — 5 posts/month, 2 platforms, 20 AI credits', competitor: '$0/mo — 10 scheduled posts per channel, 3 channels' },
  { plan: 'Starter', zynovexa: '$5/mo — 30 posts/month, 3 platforms, 100 AI credits', competitor: '$6/mo per channel — Basic scheduling, no AI' },
  { plan: 'Growth', zynovexa: '$19/mo — Unlimited posts, unlimited AI, team workflows', competitor: '$120/mo — 10 channels, limited team features' },
];

const TESTIMONIALS = [
  { name: 'Sarah T.', role: 'Lifestyle Creator, 90K Followers', quote: 'Buffer was good for basic scheduling but Zynovexa\'s AI completely transformed my workflow. I save 10+ hours/week now.', avatar: '👩‍🎤' },
  { name: 'Marcus J.', role: 'Marketing Agency Owner', quote: 'Moved 15 clients from Buffer to Zynovexa. The AI captions and analytics alone justified the switch.', avatar: '👨‍💼' },
  { name: 'Emily R.', role: 'Travel Blogger, 150K Followers', quote: 'Buffer\'s free plan was too limited. Zynovexa gives me unlimited posts AND AI features for free. No brainer.', avatar: '✈️' },
];

const REASONS = [
  { icon: '🤖', title: 'AI-Powered Content Creation', desc: 'Buffer has no AI features. Zynovexa gives you GPT-4o captions, hashtag generation, video scripts, and viral score prediction — all built-in.' },
  { icon: '📊', title: 'Advanced Analytics', desc: 'Buffer analytics are basic. Zynovexa offers competitor benchmarking, engagement heatmaps, AI growth recommendations, and content performance insights.' },
  { icon: '💰', title: 'Unlimited Free Posts', desc: 'Buffer limits free users to 10 posts per channel. Zynovexa\'s free plan includes unlimited posts across 3 connected accounts.' },
  { icon: '🎯', title: 'Monetization Built-In', desc: 'Track brand deals, calculate your rates, generate media kits, and analyze earnings — features Buffer doesn\'t offer at any price.' },
  { icon: '🏢', title: 'Better Team Features', desc: 'Multi-step approval workflows, inline comments, role-based permissions, and audit logs come standard on Business plan.' },
  { icon: '⚡', title: 'Modern & Faster', desc: 'Built on modern infrastructure with a sleek, intuitive UI. No clunky dashboards or slow page loads. Everything feels instant.' },
];

export default function BufferAlternativePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 marketing-hero-panel">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 Buffer Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Buffer</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Buffer is great for simple scheduling — but creators need more. Zynovexa gives you AI content creation, advanced analytics, monetization tools, and unlimited posts on free tier.
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
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons creators switch from Buffer</h2>
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
            <p className="text-slate-400">See exactly what you get with each platform</p>
          </div>
          <div className="marketing-table-shell overflow-hidden">
            <div className="grid grid-cols-12 gap-0 text-sm font-bold border-b p-4" style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-5 text-slate-400">Feature</div>
              <div className="col-span-3 text-center gradient-text">Zynovexa</div>
              <div className="col-span-3 text-center text-slate-500">Buffer</div>
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
                  <p className="text-xs text-slate-500 mb-1">Buffer</p>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">What creators say after switching</h2>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to switch from Buffer?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Start free today — no credit card, no limits. Import your Buffer data and be up and running in minutes.
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
