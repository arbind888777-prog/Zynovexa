import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & Media | Zynovexa',
  description: 'Zynovexa press kit, media resources, and press coverage. Download logos, brand assets, and contact our media team.',
};

const COVERAGE = [
  { outlet: 'TechCrunch', headline: 'Zynovexa raises $8M to bring generative AI to social media management', date: 'Jan 2026' },
  { outlet: 'Forbes', headline: 'The 10 hottest AI startups to watch in 2026', date: 'Feb 2026' },
  { outlet: 'Product Hunt', headline: '#1 Product of the Day — AI Social Media Manager', date: 'Dec 2025' },
  { outlet: 'The Verge', headline: 'Zynovexa wants to replace your social media team with AI', date: 'Nov 2025' },
  { outlet: 'Inc. Magazine', headline: 'How this AI startup is changing social media for small businesses', date: 'Oct 2025' },
];

const STATS = [
  { value: '50,000+', label: 'Active users' },
  { value: '$8M', label: 'Funding raised' },
  { value: '2024', label: 'Founded' },
  { value: '12', label: 'Countries' },
];

const ASSETS = [
  { name: 'Logo Pack (PNG/SVG)', desc: 'Light, dark, and color variants', icon: '🖼️' },
  { name: 'Brand Guidelines', desc: 'Colors, typography, usage rules', icon: '📐' },
  { name: 'Product Screenshots', desc: 'Dashboard and key feature images', icon: '📸' },
  { name: 'Founder Headshots', desc: 'High-resolution team photos', icon: '👤' },
  { name: 'Company Fact Sheet', desc: 'Key stats and company background', icon: '📄' },
];

export default function PressPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">📰 Press & Media</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">Press Resources</h1>
          <p className="text-slate-400 text-xl max-w-xl mx-auto">
            Everything you need to write about Zynovexa — logos, facts, quotes, and our media contact.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 border-y" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black gradient-text">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Media coverage */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10">In the news</h2>
          <div className="space-y-4">
            {COVERAGE.map(item => (
              <div key={item.headline} className="card card-hover p-5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{item.outlet}</span>
                  <h3 className="text-white font-semibold mt-1 text-sm leading-relaxed">{item.headline}</h3>
                </div>
                <span className="text-xs text-slate-500 shrink-0">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand assets */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10">Brand assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSETS.map(a => (
              <div key={a.name} className="card card-hover p-5 flex items-center gap-4 cursor-pointer group">
                <span className="text-3xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.desc}</p>
                </div>
                <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media contact */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto card p-10">
          <div className="text-4xl mb-4">📩</div>
          <h2 className="text-2xl font-black text-white mb-3">Media contact</h2>
          <p className="text-slate-400 mb-6 text-sm">For press inquiries, interviews, or exclusive stories, reach our communications team directly.</p>
          <a href="mailto:press@zynovexa.com" className="btn btn-primary">press@zynovexa.com</a>
          <p className="text-xs text-slate-600 mt-4">We respond to media inquiries within 2 business hours.</p>
        </div>
      </section>
    </MarketingLayout>
  );
}
