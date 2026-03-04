import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Changelog — What\'s New in Zynovexa',
  description: 'See everything new in Zynovexa — feature launches, improvements, bug fixes, and coming soon items. We ship every week.',
  alternates: { canonical: 'https://zynovexa.com/changelog' },
};

const UPDATES = [
  {
    version: 'v2.4.0',
    date: 'March 1, 2026',
    type: 'Major Release',
    typeColor: 'badge-purple',
    title: 'AI Image Generator + DALL-E 3 Integration',
    changes: [
      '🎨 New: Generate custom social media images from text prompts using DALL-E 3',
      '🤖 New: AI image style presets (minimalist, vibrant, corporate, creator)',
      '⚡ Improvement: Caption generator is now 2x faster',
      '🐛 Fix: Instagram Reels scheduling edge case with long captions',
    ],
  },
  {
    version: 'v2.3.0',
    date: 'Feb 15, 2026',
    type: 'Feature Release',
    typeColor: 'badge-blue',
    title: 'Analytics Dashboard Redesign & Competitor Analysis',
    changes: [
      '📊 New: Completely redesigned analytics dashboard with widget layout',
      '🔍 New: Competitor analysis — benchmark up to 5 competitor accounts',
      '📈 New: Viral Score prediction for scheduled posts',
      '💡 New: Weekly AI-generated growth recommendations',
      '✅ Improvement: Analytics data now updates every 15 minutes',
    ],
  },
  {
    version: 'v2.2.0',
    date: 'Feb 1, 2026',
    type: 'Feature Release',
    typeColor: 'badge-blue',
    title: 'Team Collaboration & Approval Workflows',
    changes: [
      '👥 New: Invite unlimited team members (Business plan)',
      '✅ New: Multi-step content approval workflows',
      '💬 New: Inline comments on draft posts',
      '🔐 New: Role-based permissions (Admin, Manager, Creator, Viewer)',
      '📜 New: Full audit log for all account actions',
    ],
  },
  {
    version: 'v2.1.0',
    date: 'Jan 18, 2026',
    type: 'Improvement',
    typeColor: 'badge-green',
    title: 'LinkedIn Support + Thread Generator',
    changes: [
      '💼 New: Full LinkedIn scheduling and analytics support',
      '🧵 New: Twitter/X thread generator with formatting preview',
      '🔄 New: Content repurposing tool (video → thread, blog → carousel)',
      '⚡ Improvement: Mobile app performance improvements (50% faster)',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'Jan 5, 2026',
    type: 'Major Release',
    typeColor: 'badge-purple',
    title: 'Zynovexa 2.0 — GPT-4o Upgrade',
    changes: [
      '🤖 New: Upgraded to GPT-4o for all AI generation',
      '🎬 New: Video script generator with hook optimization',
      '#️⃣ New: AI hashtag generator with niche targeting',
      '💬 New: Zyx AI Chatbot — your 24/7 creator advisor',
      '📱 New: iOS and Android mobile apps launch',
    ],
  },
];

const COMING_SOON = [
  '🎥 YouTube Shorts auto-posting (Q2 2026)',
  '📊 Revenue attribution tracking across all platforms',
  '🤝 Agency white-label branding',
  '🌍 Multi-language AI content generation',
  '📧 Newsletter integration (Beehiiv, Substack)',
];

export default function ChangelogPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="max-w-2xl mx-auto">
          <span className="badge badge-purple mb-6 inline-block">🔄 Changelog</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            What's <span className="gradient-text">new in Zynovexa</span>
          </h1>
          <p className="text-slate-400">We ship new features and improvements every week. Here's what we've built.</p>
        </div>
      </section>

      {/* Updates */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {UPDATES.map(update => (
            <div key={update.version} className="card p-7 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`badge ${update.typeColor} text-xs`}>{update.type}</span>
                <span className="text-white font-mono text-sm font-semibold">{update.version}</span>
                <span className="text-slate-500 text-sm">{update.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">{update.title}</h2>
              <ul className="space-y-2">
                {update.changes.map(change => (
                  <li key={change} className="text-slate-300 text-sm">{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-7" style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.04)' }}>
            <h2 className="text-xl font-bold text-white mb-4">🚀 Coming Soon</h2>
            <ul className="space-y-2.5">
              {COMING_SOON.map(item => (
                <li key={item} className="text-slate-300 text-sm">{item}</li>
              ))}
            </ul>
            <p className="text-slate-500 text-xs mt-4">
              Have a feature request?{' '}
              <a href="mailto:feedback@zynovexa.com" className="text-purple-400 hover:text-purple-300 underline">Send us feedback →</a>
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
