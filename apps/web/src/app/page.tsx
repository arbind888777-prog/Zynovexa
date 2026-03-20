import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import FloatingSocialIcons from '@/components/FloatingSocialIcons';

export const metadata: Metadata = {
  title: 'Zynovexa — #1 AI Social Media Manager for Creators',
  description:
    'Zynovexa helps 50,000+ creators schedule posts, generate viral AI captions, grow analytics, and monetize across Instagram, YouTube, TikTok, Twitter, LinkedIn & more. Start free today.',
  alternates: { canonical: 'https://zynovexa.com' },
  openGraph: {
    title: 'Zynovexa — #1 AI Social Media Manager for Creators',
    description:
      'Schedule. Create. Grow. Monetize. The all-in-one AI platform for creators across 7 social platforms.',
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
    desc: 'Write TikTok, YouTube & Reels scripts with hooks and CTAs.',
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
  { name: 'TikTok', icon: '🎵', color: '#69c9d0', href: '/channels/tiktok' },
  { name: 'Twitter/X', icon: '𝕏', color: '#1da1f2', href: '/channels/twitter' },
  { name: 'LinkedIn', icon: '💼', color: '#0077b5', href: '/channels/linkedin' },
  { name: 'Facebook', icon: '📘', color: '#1877f2', href: '/channels/facebook' },
  { name: 'Snapchat', icon: '👻', color: '#fffc00', href: '' },
];

const STATS = [
  { value: '50K+', label: 'Active Creators', icon: '👥' },
  { value: '2M+', label: 'Posts Scheduled', icon: '📅' },
  { value: '99.9%', label: 'Uptime SLA', icon: '⚡' },
  { value: '4.9★', label: 'Average Rating', icon: '⭐' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'YouTuber · 250K subs', text: 'Zynovexa saved me 15 hours/week. The AI script generator writes better hooks than I do!', avatar: 'R', plan: 'Pro' },
  { name: 'Priya Gupta', role: 'Instagram Creator · 180K', text: 'My engagement went up 340% after using the AI hashtag generator consistently. Unreal results.', avatar: 'P', plan: 'Business' },
  { name: 'Amit Verma', role: 'TikTok & Reels Creator', text: 'The video studio feature is a game-changer. Script, caption, hashtags — all in one place.', avatar: 'A', plan: 'Pro' },
];

export default async function LandingPage() {
  const host = (await headers()).get('host') ?? '';
  const currency = host.endsWith('.in') ? 'inr' : 'usd';
  const symbol = currency === 'inr' ? '₹' : '$';
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
      price: currency === 'inr' ? 299 : 5,
      desc: 'For individual creators',
      features: ['30 posts/month', '100 AI credits', '3 platforms', '30-day analytics', 'AI captions', 'Email support'],
      cta: 'Start Starter',
      featured: false,
    },
    {
      plan: 'Pro',
      price: currency === 'inr' ? 699 : 9,
      desc: 'For serious creators',
      features: ['100 posts/month', '500 AI credits', '5 platforms', '90-day analytics', 'Video Studio', 'Priority email'],
      cta: 'Start Pro',
      featured: true,
      badge: 'Most Popular',
    },
    {
      plan: 'Growth',
      price: currency === 'inr' ? 1299 : 19,
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
            <Link href="/login" className="btn btn-secondary btn-xl">
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
            <span>Trusted by <strong className="text-white">50,000+</strong> creators, operators, and social teams</span>
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

      {/* ─── Stats Bar ─────────────────────────────────────────── */}
      <section className="section-shell-tight pt-0">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s, i) => (
            <div key={s.label} className={`card text-center p-5 sm:p-6 animate-scale-in delay-${(i+1)*100}`}>
              <div className="text-2xl sm:text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-white stat-number">{s.value}</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
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

      {/* ─── Testimonials ──────────────────────────────────────── */}
      <section className="section-shell-tight">
        <div className="max-w-6xl mx-auto">
          <div className="section-intro">
            <span className="section-kicker text-green-300">Customer stories</span>
            <h2 className="section-title">Used by creators who care about repeatable growth</h2>
            <p className="section-copy">Results matter more when the workflow behind them is sustainable.</p>
          </div>
          <div className="marketing-summary-strip mb-8 text-xs sm:text-sm">
            <span className="marketing-logo-pill">Teams with 3 to 30 seats</span>
            <span className="marketing-logo-pill">Creator workflows without tool sprawl</span>
            <span className="marketing-logo-pill">Measured growth, not vanity dashboards</span>
          </div>
          <div className="marketing-grid-shell grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`card card-hover marketing-metric-card premium-tilt-card p-6 sm:p-7 relative animate-fade-in delay-${(i+1)*100}`}>
                <div className="flex items-start gap-1 mb-4">
                  {[...Array(5)].map((_,j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                  <span className="badge badge-purple text-xs">{t.plan}</span>
                </div>
              </div>
            ))}
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
            <span className="marketing-logo-pill">{currency === 'inr' ? 'INR pricing for .in visitors' : 'USD pricing for global visitors'}</span>
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
