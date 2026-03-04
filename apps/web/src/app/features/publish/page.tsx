import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Publish & Schedule Posts — Smart Social Media Scheduler | Zynovexa',
  description: 'Schedule posts across Instagram, TikTok, YouTube, Twitter, LinkedIn, and more. AI-optimized timing, drag-and-drop calendar, bulk upload. Start free.',
  alternates: { canonical: 'https://zynovexa.com/features/publish' },
};

const STEPS = [
  { n: '01', title: 'Create once', desc: 'Write or AI-generate your post content, add media, and customize per platform.' },
  { n: '02', title: 'Schedule smart', desc: 'Pick a time manually or let AI find your best engagement window automatically.' },
  { n: '03', title: 'Auto-publish', desc: 'Zynovexa publishes to all platforms at the perfect moment — without you lifting a finger.' },
  { n: '04', title: 'Review results', desc: 'See real-time performance data seconds after your post goes live.' },
];

const CAPABILITIES = [
  { icon: '🗓️', title: 'Visual Calendar', desc: 'Drag-and-drop scheduling with a bird\'s eye view of all your upcoming content.' },
  { icon: '📦', title: 'Bulk Upload', desc: 'Import hundreds of posts via CSV or Canva integration in one click.' },
  { icon: '⏰', title: 'AI Best Time', desc: 'Machine learning picks the exact minute your audience is most active.' },
  { icon: '♻️', title: 'Evergreen Queue', desc: 'Recycle your best-performing posts automatically to fill content gaps.' },
  { icon: '🎯', title: 'Per-Platform Customize', desc: 'Tweak captions, hashtags, and formats for each platform from one editor.' },
  { icon: '📱', title: 'Mobile Reminders', desc: 'Get push notifications for stories and formats that need manual publishing.' },
];

export default function PublishFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-80 h-80 -top-10 -left-20 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">Publish & Schedule</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Schedule smarter.<br /><span className="gradient-text">Publish everywhere.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            One composer. Seven platforms. AI-powered timing. Spend less time posting and more time creating content your audience loves.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Start Scheduling Free</Link>
            <Link href="/features" className="btn btn-secondary btn-xl">← All Features</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(s => (
              <div key={s.n} className="card p-6 relative overflow-hidden group card-hover">
                <div className="text-5xl font-black text-white/5 absolute -top-2 -right-1 select-none">{s.n}</div>
                <div className="relative">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{s.n}</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Everything in one scheduler</h2>
            <p className="text-slate-400 max-w-xl mx-auto">All the publishing features you need, designed for speed and simplicity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map(c => (
              <div key={c.title} className="card card-hover p-6">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{c.title}</h3>
                <p className="text-slate-400 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-8">Supported platforms</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[['📸','Instagram'],['🎵','TikTok'],['▶️','YouTube'],['𝕏','Twitter / X'],['💼','LinkedIn'],['📘','Facebook'],['👻','Snapchat']].map(([icon, name]) => (
              <span key={name} className="flex items-center gap-2 px-4 py-2 card text-sm text-slate-300 card-hover">{icon} {name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Start scheduling in minutes</h2>
          <p className="text-slate-400 mb-6">Connect your platforms, compose your first post, and let Zynovexa handle the rest.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Create Free Account →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
