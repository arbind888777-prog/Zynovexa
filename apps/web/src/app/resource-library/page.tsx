import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';
import ResourceLibraryClient from '@/components/ResourceLibraryClient';

export const metadata: Metadata = {
  title: 'Resource Library | Zynovexa',
  description: 'Free downloadable guides, ebooks, templates, and courses to help you master social media marketing and grow your audience faster.',
};

const RESOURCES = [
  { icon: '📘', type: 'Ebook', title: 'The Complete Guide to Instagram Growth in 2026', desc: '80-page deep dive into algorithm, content strategy, and monetization.', tag: 'Instagram', free: true },
  { icon: '📋', type: 'Template', title: '30-Day Content Calendar Template', desc: 'Ready-to-use calendar with post ideas, hashtag slots, and analytics tracking.', tag: 'Strategy', free: true },
  { icon: '🎥', type: 'Video Course', title: 'TikTok 0 to 10K in 60 Days', desc: '6-part video course covering hooks, trends, editing, and audience building.', tag: 'TikTok', free: false },
  { icon: '📊', type: 'Report', title: 'Social Media Benchmarks Report 2026', desc: 'Average engagement rates, reach, and growth metrics by industry and platform.', tag: 'Analytics', free: true },
  { icon: '✅', type: 'Checklist', title: 'The Perfect Post Checklist (All Platforms)', desc: '25-point checklist to review before every post for maximum performance.', tag: 'Strategy', free: true },
  { icon: '🎨', type: 'Template Pack', title: '100 Canva Template Pack for Social Media', desc: 'Professionally designed templates for Stories, Reels covers, carousels, and more.', tag: 'Design', free: false },
  { icon: '📙', type: 'Guide', title: 'LinkedIn Content Strategy for B2B Brands', desc: 'Step-by-step guide to building thought leadership and generating leads with LinkedIn.', tag: 'LinkedIn', free: true },
  { icon: '🔧', type: 'Toolkit', title: 'Creator Business Starter Toolkit', desc: 'Contracts, rate cards, pitch templates, and media kit for new creators.', tag: 'Business', free: false },
  { icon: '📈', type: 'Spreadsheet', title: 'Social Media Analytics Tracker (Excel/Sheets)', desc: 'Track all your platform metrics in one place with auto-calculated averages.', tag: 'Analytics', free: true },
];

const TYPES = ['All', 'Ebook', 'Template', 'Guide', 'Report', 'Video Course', 'Checklist', 'Toolkit'];

export default function ResourceLibraryPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">📚 Resource Library</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            Free Learning<br /><span className="gradient-text">Resources</span>
          </h1>
          <p className="text-slate-400 text-xl mb-4 max-w-2xl mx-auto">
            Guides, ebooks, templates, and tools to help you become a smarter social media marketer. Most are free.
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-500">
            <span>📖 25+ Resources</span>
            <span>🆓 16 Free Resources</span>
            <span>🔄 Updated Monthly</span>
          </div>
        </div>
      </section>

      <ResourceLibraryClient types={TYPES} resources={RESOURCES} />
    </MarketingLayout>
  );
}
