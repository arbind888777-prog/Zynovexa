import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Analytics & Insights — Track Growth Across All Platforms | Zynovexa',
  description: 'Deep social media analytics for Instagram, TikTok, YouTube, LinkedIn and more. Real-time engagement, competitor analysis, AI growth recommendations. Start free.',
  alternates: { canonical: 'https://zynovexa.com/features/analyze' },
};

const METRICS = [
  { icon: '📈', label: 'Follower Growth', desc: 'Daily, weekly and monthly growth curves' },
  { icon: '💬', label: 'Engagement Rate', desc: 'Likes, comments, shares, saves per post' },
  { icon: '👁️', label: 'Reach & Impressions', desc: 'How many people see your content' },
  { icon: '🔥', label: 'Viral Score', desc: 'AI-predicted viral potential for each post' },
  { icon: '🕐', label: 'Best Post Times', desc: 'When your audience is most active' },
  { icon: '🎯', label: 'Top Performing Posts', desc: 'Your highest ROI content at a glance' },
  { icon: '🔍', label: 'Competitor Analysis', desc: 'Benchmark against rivals anonymously' },
  { icon: '💰', label: 'Revenue Attribution', desc: 'Track which posts drive sales and signups' },
];

export default function AnalyzeFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-blue w-96 h-96 -top-20 -left-20 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">📊 Analytics & Insights</span>
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
              <div key={m.label} className="card card-hover p-5">
                <div className="text-3xl mb-3">{m.icon}</div>
                <h3 className="text-white font-semibold mb-1">{m.label}</h3>
                <p className="text-slate-400 text-xs">{m.desc}</p>
              </div>
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
