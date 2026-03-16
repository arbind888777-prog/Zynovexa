import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'About Zynovexa | Creator Revenue OS',
  description:
    'Learn how Zynovexa helps creators plan, publish, analyze, and monetize content in one secure and scalable Creator Revenue OS.',
  keywords: [
    'about zynovexa',
    'creator revenue os',
    'social media automation platform',
    'creator business platform',
    'ai creator tools',
    'creator analytics and monetization',
  ],
  alternates: { canonical: 'https://zynovexa.com/about' },
  openGraph: {
    title: 'About Zynovexa | Creator Revenue OS',
    description:
      'Built for creators who want one platform for content operations, growth analytics, and monetization workflows.',
    url: 'https://zynovexa.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Zynovexa | Creator Revenue OS',
    description:
      'One platform for content creation, scheduling, analytics, and revenue operations for modern creators.',
  },
};

const APP_URL = 'https://zynovexa.com';

const VALUES = [
  {
    title: 'Creators First Product Decisions',
    desc: 'We prioritize features that reduce creator workload and increase publishing consistency and revenue confidence.',
  },
  {
    title: 'Transparent Product and Pricing',
    desc: 'Our roadmap, pricing logic, and core platform capabilities are shared in plain language.',
  },
  {
    title: 'Reliable By Default',
    desc: 'Health checks, role-based controls, and production-grade architecture are part of the core product design.',
  },
  {
    title: 'Data Respect and User Control',
    desc: 'Users control account data, export options, and connected platform permissions through clear settings.',
  },
];

const TIMELINE = [
  {
    year: '2024',
    event: 'Zynovexa started with a simple thesis: creators need an operating system, not disconnected tools.',
  },
  {
    year: '2025',
    event: 'We launched early creator workflows for AI content generation, scheduling, and performance tracking.',
  },
  {
    year: '2026',
    event: 'The platform expanded into creator revenue operations with monetization, media-kit data, and rate intelligence.',
  },
];

const ABOUT_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Zynovexa',
  url: `${APP_URL}/about`,
  description:
    'Zynovexa is a Creator Revenue OS that unifies content operations, analytics, and monetization for creators and teams.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Zynovexa',
    url: APP_URL,
    sameAs: [
      'https://twitter.com/zynovexa',
      'https://instagram.com/zynovexa',
      'https://linkedin.com/company/zynovexa',
    ],
  },
};

export default function AboutPage() {
  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_PAGE_SCHEMA) }} />

      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-15 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-10 -right-10 opacity-10 hidden lg:block" />
        <div className="max-w-3xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">About Zynovexa</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 text-white leading-tight">
            The operating system for<br /><span className="gradient-text">creator-led businesses.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
            Zynovexa helps creators and teams run content like a business: plan faster, publish consistently,
            track performance, and improve revenue outcomes from one platform.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 sm:p-12 text-center" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
            <p className="text-2xl sm:text-3xl font-bold text-white leading-relaxed">
              "Our mission is to make advanced creator operations simple, measurable, and scalable for every serious creator."
            </p>
            <p className="text-slate-400 text-sm mt-4">— The Zynovexa Team</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            ['50K+', 'Active Creators'],
            ['2M+', 'Posts Scheduled'],
            ['7', 'Platforms Supported'],
            ['99.9%', 'Infrastructure Uptime Focus'],
          ].map(([v, l]) => (
            <div key={l} className="card text-center p-6 card-hover">
              <div className="text-3xl font-black text-white mb-1">{v}</div>
              <div className="text-xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-10">What Makes Zynovexa Credible</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="card card-hover p-6">
                <div>
                  <h3 className="text-white font-semibold mb-1.5">{v.title}</h3>
                  <p className="text-slate-400 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-10">Product Evolution</h2>
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

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'For Solo Creators',
              desc: 'Ship faster with AI drafting, scheduler workflows, and cross-platform visibility.',
            },
            {
              title: 'For Agencies and Teams',
              desc: 'Operate multiple brands from one workspace with analytics and governance controls.',
            },
            {
              title: 'For Revenue Growth',
              desc: 'Use monetization tracking, rate intelligence, and media-kit data for better brand outcomes.',
            },
          ].map(item => (
            <div key={item.title} className="card p-5 card-hover">
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Build A Stronger Creator Business</h2>
          <p className="text-slate-400 mb-6">Run content, analytics, and monetization in one trusted Creator Revenue OS.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Get Started Free</Link>
            <a href="mailto:hello@zynovexa.com" className="btn btn-secondary btn-xl">Contact Team</a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
