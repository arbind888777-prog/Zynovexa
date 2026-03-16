import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Analytics & Insights — Track Growth Across All Platforms | Zynovexa',
  description: 'Deep social media analytics for Instagram, TikTok, YouTube, LinkedIn and more. Real-time engagement, competitor analysis, AI growth recommendations. Start free.',
  alternates: { canonical: 'https://zynovexa.com/features/analyze' },
};

const METRICS = [
  { icon: '📈', label: 'Follower Growth', desc: 'Daily, weekly and monthly growth curves', href: '#follower-growth', cta: 'See growth details' },
  { icon: '💬', label: 'Engagement Rate', desc: 'Likes, comments, shares, saves per post', href: '#engagement-rate', cta: 'See engagement details' },
  { icon: '👁️', label: 'Reach & Impressions', desc: 'How many people see your content', href: '#reach-and-impressions', cta: 'See reach details' },
  { icon: '🔥', label: 'Viral Score', desc: 'AI-predicted viral potential for each post', href: '#viral-score', cta: 'See viral score' },
  { icon: '🕐', label: 'Best Post Times', desc: 'When your audience is most active', href: '/features/publish#best-time-ai', cta: 'Open timing workflow' },
  { icon: '🎯', label: 'Top Performing Posts', desc: 'Your highest ROI content at a glance', href: '#top-performing-posts', cta: 'See top-post analysis' },
  { icon: '🔍', label: 'Competitor Analysis', desc: 'Benchmark against rivals anonymously', href: '#competitor-analysis', cta: 'See competitor view' },
  { icon: '💰', label: 'Revenue Attribution', desc: 'Track which posts drive sales and signups', href: '#revenue-attribution', cta: 'See attribution details' },
];

const METRIC_GUIDES = [
  { id: 'follower-growth', title: 'Follower growth', desc: 'Growth tracking helps you see whether consistency, format changes, or campaign pushes are actually compounding over time.' },
  { id: 'engagement-rate', title: 'Engagement rate', desc: 'Engagement tells you whether the content is earning interaction, not just impressions. It is often the quickest early quality signal.' },
  { id: 'reach-and-impressions', title: 'Reach and impressions', desc: 'These metrics help separate content quality problems from distribution problems so teams know what to fix first.' },
  { id: 'viral-score', title: 'Viral score', desc: 'A viral score helps creators spot breakout potential early and decide what to double down on in future posts.' },
  { id: 'top-performing-posts', title: 'Top performing posts', desc: 'This view reveals which themes, formats, and hooks repeat across your highest-return content.' },
  { id: 'competitor-analysis', title: 'Competitor analysis', desc: 'Competitive benchmarking shows where your strategy differs from faster-growing accounts and where the gaps are worth testing.' },
  { id: 'revenue-attribution', title: 'Revenue attribution', desc: 'Attribution helps connect content performance with signups, clicks, and purchases so content decisions map to business goals.' },
];

const HERO_STATS = [
  { icon: '📡', title: 'Realtime visibility', desc: 'Live performance signals across all connected channels.' },
  { icon: '🤖', title: 'AI growth prompts', desc: 'Actionable next moves instead of raw numbers only.' },
  { icon: '💸', title: 'Revenue-aware reporting', desc: 'Tie top content to signups, clicks, and monetization outcomes.' },
];

const SEO_SECTIONS = [
  {
    title: 'Why social media analytics matter beyond vanity metrics',
    paragraphs: [
      'Many teams look at likes, comments, and follower counts, but those numbers only tell part of the story. Real growth comes from understanding which topics hold attention, which formats drive saves and shares, which channels deserve more effort, and which campaigns produce downstream results such as leads, signups, or purchases. A serious social media analytics platform should help you answer those questions quickly and clearly.',
      'Zynovexa brings those signals together in one dashboard so creators and marketers do not have to bounce between platform-native tools. This matters for SEO as well because users searching for social media analytics software, Instagram analytics tools, TikTok performance dashboards, or AI marketing insights usually want decision support, not just charts. The stronger this explanation is on the page, the better the match between search intent and page value.',
    ],
  },
  {
    title: 'How AI insights turn reporting into action',
    paragraphs: [
      'Raw reporting is useful, but action-focused reporting is what changes outcomes. If your dashboard shows declining reach, the next question is obvious: what should the team do next? AI insights help bridge that gap by highlighting unusual performance patterns, identifying high-leverage post types, and recommending practical next steps. Instead of manually interpreting dozens of data points, teams get a faster route from observation to execution.',
      'This is especially important for creators and small teams that do not have a dedicated analyst. Zynovexa turns engagement trends, timing patterns, and content comparisons into guidance that is easy to use inside the same workflow where campaigns are created and scheduled. That makes the analytics page useful not only as a product page but also as an educational resource around marketing measurement, creator growth, and content optimization.',
    ],
  },
  {
    title: 'What to look for in a social media analytics tool',
    paragraphs: [
      'The best analytics software should give you cross-platform visibility, historical trend analysis, top-post discovery, timing analysis, and clear attribution signals. It should also make it easy to compare performance by format, channel, and theme. Without that structure, teams end up making decisions based on isolated wins instead of repeatable patterns. That creates noisy strategy and inconsistent results.',
      'Zynovexa focuses on practical measurement: what is growing, what is slipping, what is converting, and where the biggest opportunities are. That positioning aligns with how buyers search. People rarely search for analytics just to admire dashboards. They search because they want to understand why growth slowed, why a campaign outperformed, or how to improve ROI from content. These expanded sections help the page answer those questions with more authority and depth.',
    ],
  },
];

export default function AnalyzeFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-blue w-96 h-96 -top-20 -left-20 opacity-20 hidden lg:block" />
        <div className="orb orb-purple w-72 h-72 top-8 -right-10 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Analytics & Insights
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Know what works.<br /><span className="gradient-text">Double down on it.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Real-time analytics across all platforms. AI-powered insights that tell you exactly what to do next to grow faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Start Analyzing Free</Link>
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

      {/* Stats */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['Real-time','Data Updates'],['365 days','History Retention'],['7 platforms','Analytics'],['AI-driven','Recommendations']].map(([v,l]) => (
            <div key={l} className="card text-center p-5 card-hover">
              <div className="text-xl font-black text-white mb-1">{v}</div>
              <div className="text-xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Every metric that matters</h2>
            <p className="text-slate-400">Track the numbers that actually move the needle — all in one dashboard.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {METRICS.map(m => (
              <Link key={m.label} href={m.href} className="card card-hover interactive-card-link p-5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                <div className="text-3xl mb-3">{m.icon}</div>
                <h3 className="text-white font-semibold mb-1">{m.label}</h3>
                <p className="text-slate-400 text-xs">{m.desc}</p>
                <div className="interactive-card-cta">
                  <span className="interactive-card-label">{m.cta}</span>
                  <span className="interactive-card-arrow">{m.href.startsWith('#') ? '↓' : '→'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-purple mb-4 inline-flex">Deep Dive</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Why these analytics cards should open more detail</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A metric tile should either explain the metric or route to the next workflow. These anchors do that.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {METRIC_GUIDES.map(guide => (
              <article key={guide.id} id={guide.id} className="card p-6 scroll-mt-28">
                <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
                <p className="text-slate-400 leading-7 text-sm sm:text-base">{guide.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card p-8 sm:p-12 relative overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
            <div className="orb orb-purple w-64 h-64 -right-10 -top-10 opacity-15 hidden lg:block" />
            <div className="relative max-w-2xl">
              <span className="badge badge-purple mb-4 inline-block">🤖 AI Insights</span>
              <h2 className="text-3xl font-extrabold text-white mb-4">Your personal growth coach</h2>
              <p className="text-slate-400 mb-6">Zynovexa's AI doesn't just show you data — it tells you what to do with it. Get weekly action plans, content recommendations, and growth forecasts tailored to your audience.</p>
              <ul className="space-y-3 mb-8">
                {[
                  '"Post Reels on Wednesday at 7PM for 3x your normal reach"',
                  '"Your carousel posts get 4x more saves than single images"',
                  '"Add question CTAs — your comments are 60% below average"',
                ].map(tip => (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    <span className="text-slate-300 text-sm italic">{tip}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn btn-primary">Unlock AI Insights →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Analytics content written for real growth decisions</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">Useful guidance for visitors searching for analytics software, creator reporting tools, and AI-driven social media insights.</p>
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
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/features/publish" className="btn btn-secondary">Connect Analytics to Scheduling</Link>
            <Link href="/features/ai-assistant" className="btn btn-secondary">See the AI Workflow</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Start growing smarter today</h2>
          <p className="text-slate-400 mb-6">7-day analytics free. No credit card required.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Analyze My Accounts →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
