import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Insights | Zynovexa Blog',
  description: 'Data-driven social media insights, trends, statistics, and strategy guides to help you grow faster.',
};

const ARTICLES = [
  {
    category: 'Data & Trends',
    title: 'Instagram Algorithm in 2026: Everything That Changed',
    desc: 'New ranking signals, Reels vs. carousels, and what actually gets reach in 2026. Based on analysis of 10,000+ posts.',
    readTime: '8 min',
    date: 'Mar 1, 2026',
    image: '📊',
    tag: 'Algorithm',
  },
  {
    category: 'TikTok',
    title: 'TikTok Creator Earnings Report: What Is Actually Possible',
    desc: 'We surveyed 500 TikTok creators on their monthly earnings, brand deal rates, and growth strategies. The results are eye-opening.',
    readTime: '12 min',
    date: 'Feb 25, 2026',
    image: '💰',
    tag: 'Monetization',
  },
  {
    category: 'LinkedIn',
    title: 'How the LinkedIn Algorithm Rewards Consistent Posting',
    desc: 'The optimal posting frequency on LinkedIn has changed. Our 90-day experiment results and what we found.',
    readTime: '6 min',
    date: 'Feb 18, 2026',
    image: '📈',
    tag: 'Growth',
  },
  {
    category: 'AI & Tools',
    title: 'The State of AI Content Creation for Social Media',
    desc: 'Are AI-written captions getting flagged? Does AI content perform differently? Our full benchmark report from Q1 2026.',
    readTime: '15 min',
    date: 'Feb 10, 2026',
    image: '🤖',
    tag: 'AI',
  },
  {
    category: 'YouTube',
    title: 'YouTube Shorts vs Long-form in 2026 — Which Drives More Subs?',
    desc: 'We analyzed 200 channels and their growth patterns to find the optimal content mix for YouTube subscriber growth.',
    readTime: '10 min',
    date: 'Feb 3, 2026',
    image: '▶️',
    tag: 'YouTube',
  },
  {
    category: 'Strategy',
    title: 'Cross-Platform Content Strategy: Repurpose Like the Pros',
    desc: 'How top creators turn one piece of content into 7 posts across 5 platforms without losing quality or authenticity.',
    readTime: '7 min',
    date: 'Jan 28, 2026',
    image: '🔄',
    tag: 'Strategy',
  },
];

const TAGS = ['All', 'Algorithm', 'Growth', 'Monetization', 'AI', 'YouTube', 'TikTok', 'Instagram', 'LinkedIn', 'Strategy'];

export default function SocialMediaInsightsPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">📊 Insights</span>
          <h1 className="text-5xl font-black text-white mb-4">Social Media Insights</h1>
          <p className="text-slate-400 text-xl">Data-driven research, trend reports, and deep-dives to help you stay ahead of the curve.</p>
        </div>
      </section>

      {/* Filter tags */}
      <section className="py-6 px-4 sm:px-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button key={tag}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${tag === 'All' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              style={tag === 'All' ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map(a => (
            <Link key={a.title} href="/blog"
              className="card card-hover p-6 flex flex-col group">
              <div className="text-4xl mb-4">{a.image}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>{a.category}</span>
                <span className="text-xs text-slate-600">{a.readTime} read</span>
              </div>
              <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">{a.title}</h3>
              <p className="text-sm text-slate-400 flex-1 leading-relaxed">{a.desc}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs text-slate-600">{a.date}</span>
                <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">Get insights in your inbox</h2>
          <p className="text-slate-400 text-sm mb-6">New research, platform updates, and strategy guides every week. 22,000+ subscribers.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="you@example.com" className="input-field flex-1" />
            <button className="btn btn-primary px-5">Subscribe</button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
