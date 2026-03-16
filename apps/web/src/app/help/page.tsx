import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import HelpClient from '@/components/HelpClient';

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
      <HelpClient categories={CATEGORIES} popularArticles={POPULAR_ARTICLES} />

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
