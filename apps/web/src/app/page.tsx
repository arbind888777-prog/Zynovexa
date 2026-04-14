import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import FloatingSocialIcons from '@/components/FloatingSocialIcons';

export const metadata: Metadata = {
  title: 'Zynovexa — AI Social Media Manager & Creator Commerce Platform',
  description:
    'Zynovexa helps creators schedule posts, generate viral AI captions, sell digital products, courses & templates, and grow across Instagram, YouTube, Twitter, LinkedIn, Facebook, and more. Start free today.',
  alternates: { canonical: 'https://zynovexa.com' },
  openGraph: {
    title: 'Zynovexa — AI Social Media Manager & Creator Commerce Platform',
    description:
      'Schedule. Create. Sell. Grow. The all-in-one AI platform for creators across 7 social platforms with built-in digital commerce.',
    url: 'https://zynovexa.com',
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Caption Writer',
    desc: 'Generate viral captions for every platform in seconds. 500+ templates.',
    color: 'from-indigo-500/20 to-purple-500/20',
    border: 'border-indigo-500/30',
    href: '/tools/ai-caption-generator',
    badge: 'Popular',
    stats: ['500+ templates', '1-click rewrite'],
  },
  {
    icon: '📅',
    title: 'Smart Scheduler',
    desc: 'Queue posts across 7 platforms. AI picks the perfect posting time.',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    href: '/features/publish',
    badge: 'Automation',
    stats: ['7 platforms', 'Best-time AI'],
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Track growth, engagement & viral scores with real-time charts.',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    href: '/features/analyze',
    badge: 'Live data',
    stats: ['Realtime charts', 'Growth signals'],
  },
  {
    icon: '🎬',
    title: 'Video Script AI',
    desc: 'Write YouTube & Reels scripts with hooks and CTAs.',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    href: '/features/create',
    badge: 'Creator stack',
    stats: ['Hooks + CTAs', 'Multi-format'],
  },
  {
    icon: '#️⃣',
    title: 'Hashtag Generator',
    desc: 'Get 30 targeted hashtags mixing trending + niche tags instantly.',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    href: '/tools/hashtag-generator',
    badge: 'Fast win',
    stats: ['30 smart tags', 'Trend + niche'],
  },
  {
    icon: '🎨',
    title: 'AI Image Gen',
    desc: 'Create stunning social images powered by DALL-E 3. HD quality.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    href: '/features/ai-assistant',
    badge: 'Visual AI',
    stats: ['DALL-E 3', 'HD outputs'],
  },
  {
    icon: '💬',
    title: 'Zyx AI Chatbot',
    desc: 'Your 24/7 creator growth advisor. Strategy, ideas & more.',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    href: '/features/ai-assistant',
    badge: '24/7 copilot',
    stats: ['Ideas on demand', 'Strategy assist'],
  },
  {
    icon: '🚀',
    title: 'Growth Insights',
    desc: 'AI-powered recommendations to boost your reach and monetization.',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    href: '/features/analyze',
    badge: 'Revenue signals',
    stats: ['Reach lifts', 'Monetization tips'],
  },
];

const PLATFORMS = [
  { name: 'Instagram', icon: '📸', color: '#e1306c', href: '/channels/instagram' },
  { name: 'YouTube', icon: '▶️', color: '#ff0000', href: '/channels/youtube' },
  { name: 'Twitter/X', icon: '𝕏', color: '#1da1f2', href: '/channels/twitter' },
  { name: 'LinkedIn', icon: '💼', color: '#0077b5', href: '/channels/linkedin' },
  { name: 'Facebook', icon: '📘', color: '#1877f2', href: '/channels/facebook' },
  { name: 'Snapchat', icon: '👻', color: '#fffc00', href: '' },
];

const TRUST_CARDS = [
  { icon: '🎉', title: 'Free to start', desc: 'No credit card required' },
  { icon: '🔓', title: 'Cancel anytime', desc: 'No lock-in' },
  { icon: '🔒', title: 'Secure payments', desc: 'Razorpay' },
];



export default async function LandingPage() {
  const symbol = '₹';
  const landingPlans = [
    {
      plan: 'Free',
      price: 0,
      desc: 'Perfect to get started',
      features: ['5 posts/month', '20 AI credits', '2 platforms', '7-day analytics', 'Community support'],
      cta: 'Start Free',
      featured: false,
    },
    {
      plan: 'Starter',
      price: 299,
      desc: 'For individual creators',
      features: ['30 posts/month', '100 AI credits', '3 platforms', '30-day analytics', 'AI captions', 'Email support'],
      cta: 'Start Starter',
      featured: false,
    },
    {
      plan: 'Pro',
      price: 699,
      desc: 'For serious creators',
      features: ['100 posts/month', '500 AI credits', '5 platforms', '90-day analytics', 'Video Studio', 'Priority email'],
      cta: 'Start Pro',
      featured: true,
      badge: 'Most Popular',
    },
    {
      plan: 'Growth',
      price: 1299,
      desc: 'For agencies & teams',
      features: ['Unlimited posts', 'Unlimited AI', 'All 7 platforms', '1-year analytics', 'Team collaboration', 'API access'],
      cta: 'Choose Growth',
      featured: false,
      badge: 'Best Value',
    },
  ];

  return (
    <MarketingLayout>

      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="section-shell-loose pt-28 sm:pt-36 text-center relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-10 -right-10 hidden lg:block" />

        {/* Floating 3D Social Media Icons */}
        <FloatingSocialIcons />

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            AI workflow for creators and teams
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.04] tracking-tight animate-fade-in delay-100">
            <span className="gradient-text">Create, publish, and grow</span>
            <br />
            <span className="text-white">from one disciplined workflow.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
            Zynovexa brings content creation, scheduling, analytics, and AI assistance into one platform so your team can move faster without losing quality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-fade-in delay-300">
            <Link href="/signup" className="btn btn-primary btn-xl">
              Start free
            </Link>
            <Link href="/features" className="btn btn-secondary btn-xl">
              Explore the platform
            </Link>
          </div>

          {/* Mini social proof */}
          <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-500 animate-fade-in delay-400 sm:flex-row">
            <div className="flex -space-x-2">
              {['R','P','A','M','S'].map((l,i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: 'var(--bg)', background: `hsl(${i*60+220},70%,55%)` }}>{l}</div>
              ))}
            </div>
            <span>Join early creators building smarter workflows</span>
          </div>

          <div className="hero-panel mt-12 grid gap-3 p-4 sm:grid-cols-3 sm:p-5 text-left animate-fade-in delay-500">
            <div className="hero-stat-chip">
              <span className="text-xl shrink-0">✍️</span>
              <div>
                <strong>Creation to publishing</strong>
                <span>Brief, draft, approve, and schedule from one workspace.</span>
              </div>
            </div>
            <div className="hero-stat-chip">
              <span className="text-xl shrink-0">📈</span>
              <div>
                <strong>Growth visibility</strong>
                <span>See what performs, when to publish, and where to improve.</span>
              </div>
            </div>
            <div className="hero-stat-chip">
              <span className="text-xl shrink-0">👥</span>
              <div>
                <strong>Built for teams</strong>
                <span>Collaborate with approvals, roles, comments, and audit history.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Cards ──────────────────────────────────────── */}
      <section className="section-shell-tight pt-0">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {TRUST_CARDS.map((card, i) => (
            <div key={card.title} className={`card text-center p-5 sm:p-6 animate-scale-in delay-${(i+1)*100}`}>
              <div className="text-2xl sm:text-3xl mb-2">{card.icon}</div>
              <div className="text-base sm:text-lg font-bold text-white">{card.title}</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Platforms ─────────────────────────────────────────── */}
      <section id="platforms" className="section-shell-tight">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-kicker">Supported channels</p>
          <h2 className="section-title text-3xl sm:text-4xl">One operating system for every major network</h2>
          <p className="section-copy max-w-2xl mx-auto">Plan, publish, and measure across the channels your audience actually uses.</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {PLATFORMS.map(p => (
              p.href ? (
                <Link key={p.name} href={p.href}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-300 card whitespace-nowrap transition-colors hover:text-white hover:border-white/20">
                  <span>{p.icon}</span>{p.name}
                </Link>
              ) : (
                <span key={p.name} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-500 card whitespace-nowrap" title="Coming soon">
                  <span>{p.icon}</span>{p.name}
                </span>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section id="features" className="section-shell">
        <div className="max-w-7xl mx-auto">
          <div className="section-intro">
            <span className="section-kicker">Platform capabilities</span>
            <h2 className="section-title">A complete workflow for serious creator growth</h2>
            <p className="section-copy">Every major job in the social media stack lives in one place: content, publishing, analytics, AI support, and monetization.</p>
          </div>
          <div className="feature-grid-shell grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 px-1 py-1 sm:px-2 sm:py-2">
            {FEATURES.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                aria-label={`Open ${f.title}`}
                className={`card card-hover interactive-card-link p-5 sm:p-6 relative overflow-hidden group animate-fade-in delay-${Math.min((i+1)*100, 500)} border ${f.border} min-h-[228px] sm:min-h-[244px] flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/6 to-transparent opacity-60" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105">
                      {f.icon}
                    </div>
                    <span className="badge badge-purple shrink-0 border-white/10 bg-white/8 text-[10px] text-slate-200">
                      {f.badge}
                    </span>
                  </div>

                  <div className="mb-5 space-y-2.5">
                    <h3 className="font-semibold text-white text-base sm:text-[17px] transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-[1.65] transition-colors duration-300 group-hover:text-slate-300 group-focus-visible:text-slate-300">
                      {f.desc}
                    </p>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {f.stats.map(stat => (
                      <span
                        key={stat}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white group-focus-visible:border-white/15 group-focus-visible:text-white"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>

                  <div className="interactive-card-cta mt-auto">
                    <span className="interactive-card-label">Explore feature</span>
                    <span className="interactive-card-arrow">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Creator Commerce ─────────────────────────────────── */}
      <section className="section-shell">
        <div className="max-w-6xl mx-auto">
          <div className="section-intro">
            <span className="section-kicker text-emerald-300">Creator Commerce</span>
            <h2 className="section-title">Sell digital products directly from your creator page</h2>
            <p className="section-copy">Every creator gets a unique storefront — zynovexa.com/yourhandle — where fans buy your courses, templates, ebooks, and more.</p>
          </div>
          <div className="marketing-grid-shell grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🏪', title: 'Your Storefront', desc: 'Get zynovexa.com/yourhandle — a beautiful creator page with your products, courses, bio, and social links.', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
              { icon: '📦', title: '5 Product Types', desc: 'Sell digital downloads, templates, ebooks, courses, and coaching sessions — all from one dashboard.', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
              { icon: '💳', title: 'Razorpay Checkout', desc: 'Accept payments in INR via Razorpay with cards, UPI, net banking, and wallets.', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
              { icon: '🎓', title: 'Course Builder', desc: 'Create courses with lessons, video content, and drip access. Track student progress and completion.', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
              { icon: '📊', title: 'Sales Analytics', desc: 'Track revenue, buyers, product performance, and net earnings after platform fees — all real-time.', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
              { icon: '🔒', title: 'Secure Downloads', desc: 'Download limits per purchase, signed URLs, and automatic access management. Built-in buyer protection.', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30' },
            ].map((f, i) => (
              <div key={f.title} className={`card card-hover p-6 relative overflow-hidden group border ${f.border} animate-fade-in delay-${Math.min((i+1)*100, 300)}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{f.icon}</span>
                  <h3 className="font-semibold text-white text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ──────────────────────────────────────── */}
      <section className="section-shell-tight">
        <div className="max-w-4xl mx-auto">
          <div className="section-intro">
            <span className="section-kicker text-amber-300">How it works</span>
            <h2 className="section-title">From signup to your first sale in 3 steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up free. You instantly get zynovexa.com/yourhandle — your unique creator page.', icon: '🚀' },
              { step: '02', title: 'Upload your products', desc: 'Add digital products, courses, or templates. Set your price, upload files, and publish.', icon: '📦' },
              { step: '03', title: 'Share & earn', desc: 'Share your link everywhere. Fans buy directly. Money lands in your account minus a small platform fee.', icon: '💰' },
            ].map((s, i) => (
              <div key={s.step} className={`text-center p-6 animate-fade-in delay-${(i+1)*100}`}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(99,102,241,0.25)' }}>
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-purple-400 mb-2">STEP {s.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Fee Comparison ───────────────────────────── */}
      <section className="section-shell-tight">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-intro">
            <span className="section-kicker text-green-300">Low platform fee</span>
            <h2 className="section-title">Keep more of what you earn</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { plan: 'Free', fee: '5%', desc: 'Get started at zero cost' },
              { plan: 'Starter', fee: '4%', desc: 'For individual creators' },
              { plan: 'Pro', fee: '3%', desc: 'For serious creators' },
              { plan: 'Growth', fee: '2%', desc: 'Maximum earnings' },
            ].map(p => (
              <div key={p.plan} className="card p-5">
                <p className="text-3xl font-black text-white">{p.fee}</p>
                <p className="text-sm font-semibold text-purple-400 mt-1">{p.plan}</p>
                <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4">No hidden fees. No monthly minimums. You only pay when you sell.</p>
        </div>
      </section>

      {/* ─── Early Access ─────────────────────────────────────── */}
      <section className="section-shell-tight">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-10 sm:p-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Be one of our first power users</h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">Zynovexa is in early access. Join now and shape the product with your feedback. Early members get locked-in pricing forever.</p>
            <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Claim Early Access</Link>
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="section-shell-tight">
        <div className="max-w-5xl mx-auto">
          <div className="section-intro">
            <span className="section-kicker text-pink-300">Pricing</span>
            <h2 className="section-title">Straightforward pricing for solo creators and teams</h2>
            <p className="section-copy">Start lean, add capability as your operation grows, and keep the workflow in one system.</p>
          </div>

          <div className="marketing-summary-strip mb-8 text-xs sm:text-sm">
            <span className="marketing-logo-pill">INR pricing with Razorpay checkout</span>
            <span className="marketing-logo-pill">20% savings on yearly billing</span>
            <span className="marketing-logo-pill">Free to Growth without migration pain</span>
          </div>

          <div className="marketing-grid-shell grid sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {landingPlans.map(tier => (
              <div key={tier.plan} className={`relative p-6 sm:p-8 rounded-2xl flex flex-col premium-tilt-card ${tier.featured ? 'pricing-popular' : 'card marketing-metric-card'}`}>
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge text-white px-4 py-1" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none' }}>
                    {tier.badge}
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">{tier.plan}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{tier.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-white">{symbol}{tier.price}</span>
                  <span className="text-slate-400 text-sm">/mo</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup"
                  className={`btn w-full justify-center ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            Need full plan comparison or yearly billing?{' '}
            <Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">See all plans →</Link>
          </p>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────── */}
      <section className="section-shell-tight">
        <div className="max-w-4xl mx-auto text-center">
          <div className="marketing-callout p-10 sm:p-16 relative overflow-hidden">
            <div className="orb orb-purple w-64 h-64 -top-10 -right-10 opacity-20" />
            <div className="relative z-10">
              <div className="flex flex-wrap justify-center gap-3 mb-6 text-xs sm:text-sm">
                <span className="marketing-logo-pill">Planning</span>
                <span className="marketing-logo-pill">Publishing</span>
                <span className="marketing-logo-pill">Analytics</span>
                <span className="marketing-logo-pill">AI assistance</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Build a cleaner creator workflow</h2>
              <p className="text-slate-400 mb-8 text-base sm:text-lg">Start with scheduling, AI support, and analytics in one place. Expand when the team is ready.</p>
              <Link href="/signup" className="btn btn-primary btn-xl inline-flex">
                Create your workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

    </MarketingLayout>
  );
}
