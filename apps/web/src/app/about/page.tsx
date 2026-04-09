import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

const APP_URL = 'https://zynovexa.com';

export const metadata: Metadata = {
  title: 'About Us | Zynovexa',
  description:
    'Learn what Zynovexa is, who it is built for, and how it helps creators, marketers, and businesses manage social media with AI and automation.',
  alternates: { canonical: `${APP_URL}/about` },
  openGraph: {
    title: 'About Us | Zynovexa',
    description:
      'Zynovexa is an AI-powered SaaS platform for creators, marketers, and businesses that want faster social media planning and publishing.',
    url: `${APP_URL}/about`,
    type: 'website',
  },
};

const ABOUT_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Zynovexa',
  url: `${APP_URL}/about`,
  description:
    'Zynovexa is an AI-powered social media scheduling and content automation platform for creators, marketers, and businesses.',
};

const AUDIENCE = [
  'Creators who want to plan and publish content faster',
  'Marketers who need a more consistent social media workflow',
  'Businesses that want one dashboard for scheduling, AI content help, and performance insights',
];

const CAPABILITIES = [
  {
    title: 'Scheduling that saves time',
    desc: 'Create, plan, and schedule posts across multiple social channels from one place.',
  },
  {
    title: 'AI tools built for creators',
    desc: 'Generate captions, hashtags, scripts, and content ideas without switching between separate apps.',
  },
  {
    title: 'Video-first workflow support',
    desc: 'Prepare content for reels, shorts, and other short-form formats inside the same product.',
  },
  {
    title: 'A professional operating layer',
    desc: 'Track activity, reduce workflow chaos, and manage subscriptions from a reliable SaaS workspace.',
  },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_PAGE_SCHEMA) }} />

      <section className="pt-28 sm:pt-36 pb-14 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">About Zynovexa</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 text-white leading-tight">
            AI-powered social media operations for modern <span className="gradient-text">growth teams</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
            Zynovexa is a SaaS platform that helps creators, marketers, and businesses manage content planning,
            scheduling, AI-assisted writing, and video workflows from one dashboard.
          </p>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto card p-8 sm:p-10" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-4">What Zynovexa does</h2>
          <p className="text-slate-300 leading-relaxed">
            Social media teams often waste time moving between design tools, spreadsheets, caption documents,
            publishing dashboards, and analytics tabs. Zynovexa brings those day-to-day tasks together into one
            cleaner workflow so users can create faster, stay consistent, and spend less time on repetitive work.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {AUDIENCE.map((item) => (
            <div key={item} className="card card-hover p-6">
              <h3 className="text-white font-semibold mb-2">Built for</h3>
              <p className="text-slate-400 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">What problem we solve</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {CAPABILITIES.map((item) => (
              <div key={item.title} className="card p-6 card-hover">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="card p-6">
            <h2 className="text-2xl font-extrabold text-white mb-3">Why teams choose Zynovexa</h2>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>One dashboard for scheduling, AI, video prep, and analytics</li>
              <li>Subscription-based access with clear billing and self-serve cancellation</li>
              <li>No physical delivery or offline service dependency</li>
              <li>Made for repeatable, scalable content operations</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-extrabold text-white mb-3">Trust matters</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We aim to operate Zynovexa with clear policies, transparent subscription terms, professional support,
              and secure payment handling so creators and businesses can trust the platform they use every week.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto card p-8 sm:p-10" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-4">Who&apos;s building Zynovexa</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Zynovexa is built by a small, focused team passionate about helping creators grow smarter. We are based
            in India and building this for creators and businesses worldwide.
          </p>
          <p className="text-slate-400 text-sm">
            Have a question? Reach us at{' '}
            <a href="mailto:support@zynovexa.com" className="text-purple-400 hover:text-purple-300 underline">
              support@zynovexa.com
            </a>
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Need help or verification details?</h2>
          <p className="text-slate-400 mb-6">Visit our legal pages, contact support, or start with a free account to explore the product.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Get Started Free</Link>
            <Link href="/contact" className="btn btn-secondary btn-xl">Contact Us</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}