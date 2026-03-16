import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Publish & Schedule Posts — Smart Social Media Scheduler | Zynovexa',
  description: 'Schedule posts across Instagram, TikTok, YouTube, Twitter, LinkedIn, and more. AI-optimized timing, drag-and-drop calendar, bulk upload. Start free.',
  alternates: { canonical: 'https://zynovexa.com/features/publish' },
};

const STEPS = [
  {
    n: '01',
    title: 'Create once',
    desc: 'Write or AI-generate your post content, add media, and customize per platform.',
    href: '/features/create',
    cta: 'Open creation workflow',
  },
  {
    n: '02',
    title: 'Schedule smart',
    desc: 'Pick a time manually or let AI find your best engagement window automatically.',
    href: '#scheduler-capabilities',
    cta: 'See scheduling features',
  },
  {
    n: '03',
    title: 'Auto-publish',
    desc: 'Zynovexa publishes to all platforms at the perfect moment — without you lifting a finger.',
    href: '#platforms',
    cta: 'View supported channels',
  },
  {
    n: '04',
    title: 'Review results',
    desc: 'See real-time performance data seconds after your post goes live.',
    href: '/features/analyze',
    cta: 'Open analytics',
  },
];

const CAPABILITIES = [
  {
    icon: '🗓️',
    title: 'Visual Calendar',
    desc: 'Drag-and-drop scheduling with a bird\'s eye view of all your upcoming content.',
    href: '#calendar-planning',
    cta: 'See calendar details',
  },
  {
    icon: '📦',
    title: 'Bulk Upload',
    desc: 'Import hundreds of posts via CSV or Canva integration in one click.',
    href: '#bulk-scheduling',
    cta: 'See bulk workflow',
  },
  {
    icon: '⏰',
    title: 'AI Best Time',
    desc: 'Machine learning picks the exact minute your audience is most active.',
    href: '#best-time-ai',
    cta: 'See timing logic',
  },
  {
    icon: '♻️',
    title: 'Evergreen Queue',
    desc: 'Recycle your best-performing posts automatically to fill content gaps.',
    href: '#evergreen-queue',
    cta: 'See evergreen setup',
  },
  {
    icon: '🎯',
    title: 'Per-Platform Customize',
    desc: 'Tweak captions, hashtags, and formats for each platform from one editor.',
    href: '#platform-customization',
    cta: 'See customization',
  },
  {
    icon: '📱',
    title: 'Mobile Reminders',
    desc: 'Get push notifications for stories and formats that need manual publishing.',
    href: '#mobile-reminders',
    cta: 'See mobile flow',
  },
];

const PLATFORM_LINKS = [
  { icon: '📸', name: 'Instagram', href: '/channels/instagram' },
  { icon: '🎵', name: 'TikTok', href: '/channels/tiktok' },
  { icon: '▶️', name: 'YouTube', href: '/channels/youtube' },
  { icon: '𝕏', name: 'Twitter / X', href: '/channels/twitter' },
  { icon: '💼', name: 'LinkedIn', href: '/channels/linkedin' },
  { icon: '📘', name: 'Facebook', href: '/channels/facebook' },
  { icon: '👻', name: 'Snapchat', href: '/request-feature' },
];

const DEEP_DIVE = [
  {
    id: 'calendar-planning',
    title: 'Visual calendar planning',
    desc: 'See your full weekly and monthly publishing plan in one view so campaign gaps, heavy posting days, and launch windows are easy to spot before anything goes live.',
    bullets: ['Drag-and-drop post movement', 'Campaign visibility across channels', 'Faster approvals and planning reviews'],
  },
  {
    id: 'bulk-scheduling',
    title: 'Bulk upload and batch scheduling',
    desc: 'Upload large sets of content at once when you are planning launches, recurring campaigns, or client calendars. This reduces repetitive manual entry and speeds up publishing operations.',
    bullets: ['CSV imports for large content sets', 'Faster onboarding for teams', 'Useful for agencies and ecommerce launches'],
  },
  {
    id: 'best-time-ai',
    title: 'AI best-time recommendations',
    desc: 'Instead of guessing, schedule around audience activity patterns. Best-time recommendations help creators post with more confidence and improve the consistency of reach over time.',
    bullets: ['Data-informed timing windows', 'Higher confidence before publish', 'Less guesswork for small teams'],
  },
  {
    id: 'evergreen-queue',
    title: 'Evergreen queue automation',
    desc: 'Keep proven content circulating without rebuilding your calendar from scratch every week. Evergreen workflows are especially useful for tips, testimonials, offers, and education content.',
    bullets: ['Re-use proven content assets', 'Fill calendar gaps automatically', 'Support always-on posting cadence'],
  },
  {
    id: 'platform-customization',
    title: 'Per-platform customization',
    desc: 'Adjust captions, formats, and messaging for each network without duplicating your entire workflow. One idea can still feel native on each platform.',
    bullets: ['Channel-specific caption edits', 'Format-aware publishing flow', 'Better consistency with less repetition'],
  },
  {
    id: 'mobile-reminders',
    title: 'Mobile reminders for manual formats',
    desc: 'Some formats still need a manual final step. Smart reminders make sure those posts do not get missed while keeping the main publishing workflow organized.',
    bullets: ['Reminder support for manual stories', 'Useful for fast-moving teams', 'Reduces missed post windows'],
  },
];

const HERO_STATS = [
  { icon: '🌐', title: '7-channel publishing', desc: 'One workflow for Instagram, TikTok, YouTube, X, LinkedIn, Facebook, and Snapchat.' },
  { icon: '⏱️', title: 'Best-time automation', desc: 'AI finds the window most likely to lift reach and engagement.' },
  { icon: '📦', title: 'Built for scale', desc: 'Calendar planning, bulk upload, evergreen queues, and mobile reminders.' },
];

const SEO_SECTIONS = [
  {
    title: 'What a modern social media scheduler should actually do',
    paragraphs: [
      'A social media scheduler should do more than let you pick a date and hit publish. Real publishing teams need a system that supports planning, content reuse, campaign visibility, approval control, and analytics feedback in one workflow. If your scheduler only solves the last five minutes of the publishing process, you still waste hours coordinating assets, rewriting captions per network, and checking different tools to see what performed best.',
      'Zynovexa is designed to close that workflow gap. You can create content once, customize it for each channel, queue it for the best posting window, and review the outcome after it goes live. That makes it useful for solo creators who want speed, agencies that manage many client calendars, and in-house teams that need accountability. Search intent around phrases such as social media scheduling tool, Instagram scheduler, TikTok post planner, and AI social media scheduler usually comes from people who want a reliable end-to-end solution. This page now explains that value more clearly.',
    ],
  },
  {
    title: 'Why AI scheduling improves reach and consistency',
    paragraphs: [
      'Posting at random times makes growth harder than it needs to be. Every channel has activity patterns, and every audience behaves differently depending on geography, content format, and niche. AI-assisted scheduling helps teams stop guessing. Instead of relying on generic best-practice lists, you can use behavior data to surface stronger publishing windows, reduce dead posts, and build a more dependable cadence. Consistency matters because audiences reward familiar publishing patterns and algorithms reward signals that suggest reliable creator activity.',
      'That is why best-time posting recommendations are a practical growth feature rather than a gimmick. When combined with evergreen queues, recurring campaigns, and calendar visibility, they help creators ship more content without losing quality control. From an SEO perspective, content that explains this workflow also helps this page rank for long-tail terms such as best time to post on social media, AI scheduling software for creators, and social media calendar tool for agencies.',
    ],
  },
  {
    title: 'Who benefits from publish and schedule software',
    paragraphs: [
      'Creators benefit because they recover time. Agencies benefit because they centralize visibility and approvals. Ecommerce teams benefit because launches can be planned across multiple channels without missed deadlines. Education brands, coaches, SaaS companies, and local businesses benefit because they can keep a stable posting rhythm even when internal teams are small. The best scheduler is not the one with the most buttons. It is the one that helps your team move from idea to published campaign with fewer decisions and fewer blockers.',
      'Zynovexa supports that with a unified composer, AI support, mobile reminders for manual formats, and analytics feedback after the post is live. It is especially useful when content volume grows, because that is the moment spreadsheets and scattered drafts stop being manageable. If someone lands on this page from search, they should leave knowing exactly why scheduling software matters and what a strong platform should include. That is the role of this expanded content section.',
    ],
  },
];

export default function PublishFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-80 h-80 -top-10 -left-20 opacity-20 hidden lg:block" />
        <div className="orb orb-pink w-64 h-64 top-10 -right-12 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Publish & Schedule
          </div>
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
          <div className="hero-panel mt-10 grid gap-3 p-4 sm:grid-cols-3 sm:p-5 text-left">
            {HERO_STATS.map(stat => (
              <div key={stat.title} className="hero-stat-chip">
                <span className="text-xl shrink-0">{stat.icon}</span>
                <div>
                  <strong>{stat.title}</strong>
                  <span>{stat.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(s => (
              <Link key={s.n} href={s.href} className="card p-6 relative overflow-hidden group card-hover interactive-card-link block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                <div className="text-5xl font-black text-white/5 absolute -top-2 -right-1 select-none">{s.n}</div>
                <div className="relative">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{s.n}</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                  <div className="interactive-card-cta">
                    <span className="interactive-card-label">{s.cta}</span>
                    <span className="interactive-card-arrow">{s.href.startsWith('#') ? '↓' : '→'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="scheduler-capabilities" className="py-16 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Everything in one scheduler</h2>
            <p className="text-slate-400 max-w-xl mx-auto">All the publishing features you need, designed for speed and simplicity.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map(c => (
              <Link key={c.title} href={c.href} className="card card-hover interactive-card-link p-6 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{c.title}</h3>
                <p className="text-slate-400 text-sm">{c.desc}</p>
                <div className="interactive-card-cta">
                  <span className="interactive-card-label">{c.cta}</span>
                  <span className="interactive-card-arrow">{c.href.startsWith('#') ? '↓' : '→'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-16 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-8">Supported platforms</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {PLATFORM_LINKS.map(platform => (
              <Link key={platform.name} href={platform.href} className="flex items-center gap-2 px-4 py-2 card text-sm text-slate-300 card-hover interactive-card-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Snapchat currently routes to feature request until a dedicated channel page is published.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-purple mb-4 inline-flex">Deep Dive</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Open each scheduler feature for more detail</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The cards above now jump here so users can continue exploring instead of hitting a dead visual block.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {DEEP_DIVE.map(item => (
              <article key={item.id} id={item.id} className="card p-6 sm:p-7 scroll-mt-28">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm sm:text-base leading-7 mb-5">{item.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {item.bullets.map(point => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup" className="btn btn-secondary btn-sm">Try this in Zynovexa</Link>
                  <Link href="/pricing" className="btn btn-ghost btn-sm">View plan options</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">A smarter social media scheduling workflow</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">Useful content for searchers looking for a social media scheduler, AI publishing software, or a multi-platform content calendar.</p>
          </div>
          <div className="space-y-6">
            {SEO_SECTIONS.map(section => (
              <article key={section.title} className="card p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <div className="space-y-4 text-sm sm:text-base leading-8 text-slate-300">
                  {section.paragraphs.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link href="/features/analyze" className="card card-hover p-5 text-left"><p className="text-sm font-semibold text-white mb-1">See what happened next</p><p className="text-slate-400 text-sm">Connect publishing with analytics and growth insights.</p></Link>
            <Link href="/features/create" className="card card-hover p-5 text-left"><p className="text-sm font-semibold text-white mb-1">Create before you schedule</p><p className="text-slate-400 text-sm">Build captions, scripts, and visuals faster with AI.</p></Link>
            <Link href="/pricing" className="card card-hover p-5 text-left"><p className="text-sm font-semibold text-white mb-1">Compare plans</p><p className="text-slate-400 text-sm">Choose the right workflow for a solo brand or a full team.</p></Link>
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
