import MarketingLayout from '@/components/MarketingLayout';
import { SubscribeForm } from '@/components/BlogClient';
import InsightsFilter from '@/components/InsightsFilter';
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

      <InsightsFilter tags={TAGS} articles={ARTICLES} />

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">Get insights in your inbox</h2>
          <p className="text-slate-400 text-sm mb-6">New research, platform updates, and strategy guides every week. 22,000+ subscribers.</p>
          <SubscribeForm />
        </div>
      </section>
    </MarketingLayout>
  );
}
