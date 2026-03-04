import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  { icon: '🤖', title: 'AI Caption Writer', desc: 'Generate viral captions for every platform in seconds. 500+ templates.', color: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500/30' },
  { icon: '📅', title: 'Smart Scheduler', desc: 'Queue posts across 7 platforms. AI picks the perfect posting time.', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
  { icon: '📊', title: 'Deep Analytics', desc: 'Track growth, engagement & viral scores with real-time charts.', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
  { icon: '🎬', title: 'Video Script AI', desc: 'Write TikTok, YouTube & Reels scripts with hooks and CTAs.', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
  { icon: '#️⃣', title: 'Hashtag Generator', desc: 'Get 30 targeted hashtags mixing trending + niche tags instantly.', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
  { icon: '🎨', title: 'AI Image Gen', desc: 'Create stunning social images powered by DALL-E 3. HD quality.', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  { icon: '💬', title: 'Zyx AI Chatbot', desc: 'Your 24/7 creator growth advisor. Strategy, ideas & more.', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30' },
  { icon: '🚀', title: 'Growth Insights', desc: 'AI-powered recommendations to boost your reach and monetization.', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
];

const PLATFORMS = [
  { name: 'Instagram', icon: '📸', color: '#e1306c' },
  { name: 'YouTube', icon: '▶️', color: '#ff0000' },
  { name: 'TikTok', icon: '🎵', color: '#69c9d0' },
  { name: 'Twitter/X', icon: '𝕏', color: '#1da1f2' },
  { name: 'LinkedIn', icon: '💼', color: '#0077b5' },
  { name: 'Facebook', icon: '📘', color: '#1877f2' },
  { name: 'Snapchat', icon: '👻', color: '#fffc00' },
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

export default function LandingPage() {
  return (
    <div className="min-h-screen hero-bg overflow-x-hidden">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 text-center relative">
        {/* Decorative orbs */}
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-10 -right-10 hidden lg:block" />

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Powered by GPT-4o · DALL-E 3 · Live Now
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-in delay-100">
            <span className="gradient-text">Create. Schedule.</span>
            <br />
            <span className="text-white">Go Viral. Monetize.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
            The all-in-one AI creator platform. Manage <strong className="text-white">7 social platforms</strong>, generate viral content in seconds, and turn your passion into profit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-fade-in delay-300">
            <Link href="/signup" className="btn btn-primary btn-xl">
              🚀 Start Free — No Credit Card
            </Link>
            <Link href="/login" className="btn btn-secondary btn-xl">
              Try Demo Account →
            </Link>
          </div>

          {/* Mini social proof */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 animate-fade-in delay-400">
            <div className="flex -space-x-2">
              {['R','P','A','M','S'].map((l,i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: 'var(--bg)', background: `hsl(${i*60+220},70%,55%)` }}>{l}</div>
              ))}
            </div>
            <span>Join <strong className="text-white">50,000+</strong> creators already growing</span>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s, i) => (
            <div key={s.label} className={`card text-center p-5 sm:p-6 card-hover animate-scale-in delay-${(i+1)*100}`}>
              <div className="text-2xl sm:text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-white stat-number">{s.value}</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Platforms ─────────────────────────────────────────── */}
      <section id="platforms" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-[0.15em] mb-6">One platform. Every network.</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {PLATFORMS.map(p => (
              <span key={p.name} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-300 card card-hover whitespace-nowrap">
                <span>{p.icon}</span>{p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="badge badge-purple mb-4 inline-block">Features</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Everything you need to win</h2>
            <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto">One platform. Infinite possibilities for creators at every level.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`card card-hover p-5 sm:p-6 relative overflow-hidden group animate-fade-in delay-${Math.min((i+1)*100, 500)}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-green mb-4 inline-block">Testimonials</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Creators love Zynovexa</h2>
            <p className="text-slate-400">Real results from real creators</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`card card-hover p-6 sm:p-7 relative animate-fade-in delay-${(i+1)*100}`}>
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
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="badge badge-pink mb-4 inline-block">Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free. Scale as you grow. Cancel anytime.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                plan: 'Free', price: 0, period: '/mo',
                desc: 'Perfect to get started',
                features: ['5 posts/month', '20 AI credits', '2 platforms', '7-day analytics', 'Community support'],
                cta: 'Start Free', featured: false,
              },
              {
                plan: 'Pro', price: 29, period: '/mo', badge: 'Most Popular',
                desc: 'For serious creators',
                features: ['100 posts/month', '500 AI credits', '5 platforms', '90-day analytics', 'Email support', 'Video Studio', 'AI hashtags'],
                cta: 'Start Pro', featured: true,
              },
              {
                plan: 'Business', price: 79, period: '/mo', badge: 'Best Value',
                desc: 'For agencies & teams',
                features: ['Unlimited posts', 'Unlimited AI', 'All 7 platforms', '1-year analytics', '24/7 priority support', 'Team collaboration', 'API access'],
                cta: 'Go Business', featured: false,
              },
            ].map(tier => (
              <div key={tier.plan} className={`relative p-6 sm:p-8 rounded-2xl flex flex-col ${tier.featured ? 'pricing-popular' : 'card'}`}>
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
                  <span className="text-4xl sm:text-5xl font-black text-white">${tier.price}</span>
                  <span className="text-slate-400 text-sm">{tier.period}</span>
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
            Need a custom plan?{' '}
            <Link href="/settings" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">Build your own →</Link>
          </p>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-10 sm:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div className="orb orb-purple w-64 h-64 -top-10 -right-10 opacity-20" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Ready to go viral?</h2>
              <p className="text-slate-400 mb-8 text-base sm:text-lg">Join 50,000+ creators. Start for free. No credit card needed.</p>
              <Link href="/signup" className="btn btn-primary btn-xl inline-flex">
                🚀 Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
