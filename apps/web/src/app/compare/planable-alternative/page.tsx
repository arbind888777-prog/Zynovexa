import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa vs Planable 2026 — Best Planable Alternative',
  description: 'Compare Zynovexa vs Planable. Faster approvals, AI content creation, analytics, and monetization tools. See why creators choose Zynovexa.',
  alternates: { canonical: 'https://zynovexa.com/compare/planable-alternative' },
};

const FEATURES = [
  { feature: 'AI Caption Generator', zynovexa: true, competitor: true, detail: 'GPT-4o vs basic AI assist' },
  { feature: 'AI Hashtag Generator', zynovexa: true, competitor: false, detail: 'Data-driven hashtag suggestions' },
  { feature: 'AI Video Script Writer', zynovexa: true, competitor: false, detail: 'Full video scripts' },
  { feature: 'Viral Score Prediction', zynovexa: true, competitor: false, detail: 'Predict performance pre-publish' },
  { feature: 'Content Approval Workflow', zynovexa: true, competitor: true, detail: 'Multi-step approval chains' },
  { feature: 'Visual Feed Preview', zynovexa: true, competitor: true, detail: 'Instagram grid preview' },
  { feature: 'Multi-platform Scheduling', zynovexa: true, competitor: true, detail: '7 platforms supported' },
  { feature: 'Inline Comments', zynovexa: true, competitor: true, detail: 'Feedback on drafts' },
  { feature: 'Analytics Dashboard', zynovexa: true, competitor: false, detail: 'Planable has no analytics' },
  { feature: 'Competitor Benchmarking', zynovexa: true, competitor: false, detail: 'Track 5 competitors' },
  { feature: 'Link-in-Bio Page', zynovexa: true, competitor: false, detail: 'Free Start Page' },
  { feature: 'Brand Deal Tracker', zynovexa: true, competitor: false, detail: 'Monetization dashboard' },
  { feature: 'Media Kit Generator', zynovexa: true, competitor: false, detail: 'Auto from analytics' },
  { feature: 'Free Plan', zynovexa: true, competitor: true, detail: 'Unlimited vs 50 posts' },
  { feature: 'Content Calendar Views', zynovexa: true, competitor: true, detail: 'Calendar, list, grid, feed' },
  { feature: 'API Access', zynovexa: true, competitor: false, detail: 'REST API for integrations' },
];

const PRICING = [
  { plan: 'Free', zynovexa: '$0/mo — Unlimited posts, 3 accounts, AI credits', competitor: '$0/mo — 50 total posts only' },
  { plan: 'Pro / Basic', zynovexa: '$19/mo — 10 accounts, 500 AI, full analytics', competitor: '$33/mo per workspace — scheduling only' },
  { plan: 'Business / Pro', zynovexa: '$49/mo — 25 accounts, unlimited AI, teams', competitor: '$83/mo per workspace — approval workflows' },
];

const TESTIMONIALS = [
  { name: 'Sophie B.', role: 'Social Media Team Lead', quote: 'Planable is amazing for approvals but it has zero analytics. Zynovexa gives me approval workflows AND deep analytics in one tool.', avatar: '✅' },
  { name: 'Dan K.', role: 'Creative Agency, 8 Clients', quote: 'We used Planable just for approval flows. Zynovexa replaced that AND our scheduling tool AND our analytics tool. One platform for everything.', avatar: '🎨' },
  { name: 'Priya T.', role: 'Brand Coordinator', quote: 'Planable\'s 50-post free limit was a joke. Zynovexa unlimited posts + AI + analytics for free? Obviously switched.', avatar: '📋' },
];

const REASONS = [
  { icon: '📊', title: 'Analytics Included', desc: 'Planable has zero analytics or reporting. Zynovexa includes real-time analytics, engagement heatmaps, competitor benchmarking, and AI growth recommendations.' },
  { icon: '🤖', title: 'AI Content Creation', desc: 'Planable has basic AI assist. Zynovexa has GPT-4o captions, video scripts, hashtag generation, viral score prediction, and an AI chat assistant.' },
  { icon: '🔓', title: 'Unlimited Free Posts', desc: 'Planable\'s free plan limits you to 50 total posts ever. Zynovexa\'s free plan gives unlimited posts per month — forever.' },
  { icon: '💰', title: 'Creator Monetization', desc: 'Track brand deals, calculate rates, generate media kits, analyze earnings. Planable is purely a planning tool — Zynovexa helps you earn.' },
  { icon: '💸', title: 'Better Per-Workspace Pricing', desc: 'Planable charges per workspace ($33-83/mo each). Zynovexa Business at $49/mo covers 25 accounts with no workspace limits.' },
  { icon: '🔗', title: 'Link-in-Bio Page', desc: 'Build a beautiful, customizable Start Page for your link-in-bio. Planable doesn\'t offer anything like this.' },
];

export default function PlanableAlternativePage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🏆 #1 Planable Alternative</span>
          <h1 className="text-4xl sm:text-7xl font-black text-white leading-none mb-6">
            Zynovexa vs <span className="gradient-text">Planable</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Planable nails content approval workflows — but it lacks analytics, AI, and monetization. Zynovexa gives you everything Planable offers plus the features it&apos;s missing.
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
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">6 reasons to upgrade from Planable</h2>
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
              <div className="col-span-3 text-center text-slate-500">Planable</div>
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
                  <p className="text-xs text-slate-500 mb-1">Planable</p>
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to upgrade from Planable?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Get approval workflows, analytics, AI content, and monetization — all in one tool. Start free today.
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
