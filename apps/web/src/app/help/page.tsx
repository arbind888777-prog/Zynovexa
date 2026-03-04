import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Help Center — Docs, Tutorials & FAQs | Zynovexa',
  description: 'Find answers to all your Zynovexa questions. Step-by-step tutorials, platform guides, account help, and AI tools documentation.',
  alternates: { canonical: 'https://zynovexa.com/help' },
};

const CATEGORIES = [
  {
    icon: '🚀',
    title: 'Getting Started',
    desc: 'Set up your account, connect platforms, and schedule your first post.',
    articles: ['How to create your account','Connect your social accounts','Schedule your first post','Understanding AI credits','Choosing the right plan'],
  },
  {
    icon: '📅',
    title: 'Scheduling & Publishing',
    desc: 'Everything about the composer, calendar, and publishing.',
    articles: ['Using the visual calendar','Bulk uploading posts','Platform-specific formatting','Best time to post feature','Reposting and recycling content'],
  },
  {
    icon: '🤖',
    title: 'AI Tools',
    desc: 'Get the most out of AI captions, scripts, hashtags, and images.',
    articles: ['How AI caption generator works','Generating video scripts','Using the hashtag generator','AI Image Generator guide','Training your brand voice'],
  },
  {
    icon: '📊',
    title: 'Analytics',
    desc: 'Understanding your metrics and growth insights.',
    articles: ['Reading your analytics dashboard','What metrics matter most','Using competitor analysis','Export analytics reports','Understanding viral score'],
  },
  {
    icon: '👥',
    title: 'Teams & Collaboration',
    desc: 'Invite your team and set up approval workflows.',
    articles: ['Inviting team members','Setting approval workflows','Role permissions explained','Client workspace setup','Audit log and history'],
  },
  {
    icon: '💳',
    title: 'Billing & Account',
    desc: 'Plans, payments, upgrades, and account settings.',
    articles: ['Upgrading or downgrading plan','Cancelling your subscription','Updating payment method','Downloading invoices','Deleting your account'],
  },
];

const POPULAR_ARTICLES = [
  'How to connect my Instagram account',
  'Why is my post not publishing?',
  'How do AI credits work?',
  'Can I schedule Instagram Stories?',
  'How to export analytics reports',
  'Setting up team approval workflows',
];

export default function HelpCenterPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <span className="badge badge-purple mb-6 inline-block">❓ Help Center</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 text-white">
            How can we <span className="gradient-text">help you?</span>
          </h1>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search articles, tutorials..."
              className="w-full px-5 py-3.5 pl-11 rounded-xl text-sm bg-white/5 border text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
              style={{ borderColor: 'var(--border2)' }}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Popular articles</p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_ARTICLES.map(a => (
              <button key={a} className="text-sm px-4 py-2 card card-hover text-slate-300 hover:text-white">{a}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(cat => (
            <div key={cat.title} className="card card-hover p-6">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h2 className="text-white font-bold mb-1.5">{cat.title}</h2>
              <p className="text-slate-400 text-sm mb-4">{cat.desc}</p>
              <ul className="space-y-2">
                {cat.articles.map(a => (
                  <li key={a}>
                    <button className="text-sm text-purple-400 hover:text-purple-300 text-left transition-colors">→ {a}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Still need help?</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <a href="mailto:support@zynovexa.com" className="card card-hover p-6 text-center">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="text-white font-semibold mb-2">Email Support</h3>
              <p className="text-slate-400 text-sm mb-4">We reply within 24 hours on all plans.</p>
              <span className="text-purple-400 text-sm">support@zynovexa.com</span>
            </a>
            <div className="card p-6 text-center" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-white font-semibold mb-2">Priority Support</h3>
              <p className="text-slate-400 text-sm mb-4">Business plan users get priority queue + live chat.</p>
              <Link href="/pricing" className="text-purple-400 text-sm hover:text-purple-300">Upgrade to Business →</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
