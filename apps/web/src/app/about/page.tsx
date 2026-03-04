import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'About Zynovexa — Our Story, Mission & Team',
  description: 'Learn about Zynovexa — why we built it, our mission to empower creators, our values, and the team behind the platform. We\'re creators building for creators.',
  alternates: { canonical: 'https://zynovexa.com/about' },
};

const VALUES = [
  { icon: '🎨', title: 'Creators First', desc: 'Everything we build starts with the question: does this make a creator\'s life easier or better?' },
  { icon: '🔍', title: 'Radical Transparency', desc: 'We share our metrics, pricing, and roadmap openly. No hidden fees, no dark patterns, no BS.' },
  { icon: '⚡', title: 'Move Fast', desc: 'Ship weekly updates, ship bold features, listen constantly. Speed with quality is our competitive edge.' },
  { icon: '🤝', title: 'Community Driven', desc: 'Our users vote on features, test betas, and shape the product. You\'re not just users — you\'re co-builders.' },
];

const TIMELINE = [
  { year: '2024', event: 'Zynovexa founded by a team of ex-creators frustrated with existing tools' },
  { year: 'Early 2025', event: 'Beta launched to 500 creators. First 1,000 users acquired organically' },
  { year: 'Mid 2025', event: 'GPT-4o and DALL-E 3 integration launched. AI credits system introduced' },
  { year: 'Late 2025', event: 'Reached 25,000 users. Pro and Business plans launched' },
  { year: '2026', event: '50,000+ creators. 2M+ posts scheduled. Expanding to agencies & enterprises' },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-15 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-10 -right-10 opacity-10 hidden lg:block" />
        <div className="max-w-3xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">Our Story</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 text-white leading-tight">
            Built by creators,<br /><span className="gradient-text">for creators.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
            We got frustrated watching talented creators spend hours on captions, struggling with inconsistent posting, and guessing at what worked. So we built the tool we always wanted.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 sm:p-12 text-center" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
            <p className="text-2xl sm:text-3xl font-bold text-white leading-relaxed">
              "Our mission is to give every creator — from bedroom YouTubers to global brands — the AI superpowers that were previously only available to large marketing teams."
            </p>
            <p className="text-slate-400 text-sm mt-4">— The Zynovexa Team</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[['50K+','Active Creators'],['2M+','Posts Scheduled'],['7','Platforms Supported'],['4.9★','Average Rating']].map(([v,l]) => (
            <div key={l} className="card text-center p-6 card-hover">
              <div className="text-3xl font-black text-white mb-1">{v}</div>
              <div className="text-xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-10">What we believe in</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="card card-hover p-6 flex gap-4">
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">{v.title}</h3>
                  <p className="text-slate-400 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-10">Our journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'var(--border2)' }} />
            <div className="space-y-6">
              {TIMELINE.map(t => (
                <div key={t.year} className="flex gap-5 pl-10 relative">
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 10px rgba(99,102,241,0.5)' }} />
                  <div>
                    <span className="text-purple-400 text-sm font-bold">{t.year}</span>
                    <p className="text-slate-300 text-sm mt-0.5">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Join the movement</h2>
          <p className="text-slate-400 mb-6">50,000+ creators are already building their audience with Zynovexa.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Get Started Free</Link>
            <a href="mailto:hello@zynovexa.com" className="btn btn-secondary btn-xl">Say Hello</a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
