import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Features — AI Social Media Management Platform | Zynovexa',
  description: 'Discover all Zynovexa features: AI content generation, smart scheduling, deep analytics, team collaboration, and powerful tools to grow on every social platform.',
  alternates: { canonical: 'https://zynovexa.com/features' },
};

const FEATURES = [
  {
    icon: '📅',
    title: 'Publish & Schedule',
    desc: 'Queue posts across 7 platforms with AI-optimized timing. Drag-and-drop calendar, bulk import, and auto-posting.',
    href: '/features/publish',
    color: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
    stats: ['7 platforms', 'Auto-timing', 'Bulk upload'],
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    desc: 'Generate viral captions, video scripts, hashtag sets, and stunning images — powered by GPT-4o and DALL-E 3.',
    href: '/features/ai-assistant',
    color: 'from-indigo-500/20 to-cyan-500/20',
    border: 'border-indigo-500/30',
    stats: ['GPT-4o', 'DALL-E 3', '500+ templates'],
  },
  {
    icon: '📊',
    title: 'Analytics & Insights',
    desc: 'Deep growth metrics, engagement tracking, competitor analysis, and AI-powered recommendations for every platform.',
    href: '/features/analyze',
    color: 'from-blue-500/20 to-violet-500/20',
    border: 'border-blue-500/30',
    stats: ['Real-time data', 'Competitor spy', 'AI insights'],
  },
  {
    icon: '🤝',
    title: 'Team Collaboration',
    desc: 'Invite teammates, set approval workflows, leave comments, and manage permissions across your entire content pipeline.',
    href: '/features/collaborate',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    stats: ['Unlimited seats', 'Approval flows', 'Audit log'],
  },
  {
    icon: '🔗',
    title: 'Start Page',
    desc: 'Create a beautiful, customizable link-in-bio page that converts followers into subscribers, leads, and customers.',
    href: '/tools/start-page',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    stats: ['Custom domain', 'Analytics', '50+ themes'],
  },
  {
    icon: '🔌',
    title: 'Integrations',
    desc: 'Connect Zynovexa with Canva, Zapier, Slack, Google Analytics, Shopify, and 50+ more tools you already use.',
    href: '/tools/integrations',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    stats: ['50+ apps', 'Zapier', 'API access'],
  },
];

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-20 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-10 -right-10 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Everything you need to grow
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">
            <span className="gradient-text">Powerful features</span>{' '}
            <span className="text-white">for every creator</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            From AI content creation to advanced analytics — Zynovexa gives you every tool to dominate social media.
          </p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Start Free Today</Link>
          <div className="hero-panel mt-10 grid gap-3 p-4 sm:grid-cols-3 sm:p-5 text-left">
            {[
              ['⚡', 'One connected stack', 'Creation, scheduling, analytics, collaboration, and distribution in one place.'],
              ['🧠', 'AI where it matters', 'Speed up ideation, writing, optimization, and decision making.'],
              ['📈', 'Built for growth', 'Every feature points back to reach, engagement, and monetization.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="hero-stat-chip">
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Link key={f.title} href={f.href} className={`card card-hover p-7 flex flex-col group relative overflow-hidden border ${f.border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 flex-1">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{f.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.stats.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">{s}</span>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-5 flex items-center gap-1 text-sm text-purple-400 font-medium">
                Learn more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-10 sm:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Ready to explore?</h2>
            <p className="text-slate-400 mb-8 text-lg">Start free. No credit card needed. Cancel anytime.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="btn btn-primary btn-xl">🚀 Get Started Free</Link>
              <Link href="/pricing" className="btn btn-secondary btn-xl">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
