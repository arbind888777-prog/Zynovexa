import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Zynovexa for Small Business — Affordable Social Media Management',
  description: 'Grow your small business on social media without a full-time marketing team. AI tools, scheduling, and analytics built for entrepreneurs and SMBs. Start free.',
  alternates: { canonical: 'https://zynovexa.com/solutions/small-business' },
};

export default function SmallBusinessPage() {
  return (
    <MarketingLayout>
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-10 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative marketing-hero-panel">
          <span className="badge badge-purple mb-6 inline-block">🏢 For Small Business</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            A marketing team<br /><span className="gradient-text">in your pocket.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            You don't need to hire a social media manager. Zynovexa's AI does in seconds what takes hours manually — at a fraction of the cost.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-xs sm:text-sm">
            <span className="marketing-logo-pill">AI content without agency overhead</span>
            <span className="marketing-logo-pill">Campaign scheduling for lean teams</span>
            <span className="marketing-logo-pill">Insights in plain English</span>
          </div>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Try Free for 14 Days</Link>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Made for business owners, not marketers</h2>
          <div className="marketing-grid-shell grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🤖', title: 'AI Writes Your Posts', desc: "Just type your product or promotion and AI generates engaging, on-brand social media posts instantly." },
              { icon: '📅', title: 'Set It & Forget It', desc: 'Schedule a month of content in one sitting. Zynovexa publishes automatically while you run your business.' },
              { icon: '🏪', title: 'Brand Voice Training', desc: "Train the AI on your brand's tone, style, and values for consistent, recognizable content every time." },
              { icon: '📊', title: 'Simple Analytics', desc: "See what's working at a glance. No marketing degree needed — plain English insights and action items." },
              { icon: '🎯', title: 'Local SEO Posts', desc: 'AI generates location-specific content to attract customers in your area across Google, Facebook, and Instagram.' },
              { icon: '💬', title: 'Review Responses', desc: 'AI-suggested responses to customer comments and reviews to keep engagement high without manual effort.' },
            ].map(f => (
              <div key={f.title} className="card card-hover marketing-metric-card premium-tilt-card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="marketing-callout p-8 sm:p-12">
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center">The math is simple</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { before: '$2,500/mo', label: 'Freelance Social Manager', after: '$5/mo', saving: 'Save $2,495' },
                { before: '15 hrs/week', label: 'Time writing captions', after: '1 hr/week', saving: 'Save 14 hours' },
                { before: 'Guesswork', label: 'Post timing strategy', after: 'AI-optimized', saving: 'More reach' },
              ].map(r => (
                <div key={r.label} className="p-4">
                  <p className="text-slate-500 text-sm line-through mb-1">{r.before}</p>
                  <p className="text-xs text-slate-500 mb-2">{r.label}</p>
                  <p className="text-2xl font-black text-white mb-1">{r.after}</p>
                  <span className="badge badge-green text-xs">{r.saving}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center marketing-callout p-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Grow your business with AI today</h2>
          <p className="text-slate-400 mb-6">Start free. No contract. Cancel anytime. 14-day Pro trial on signup.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Start Free Trial →</Link>
            <Link href="/pricing" className="btn btn-secondary btn-xl">See Pricing</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
