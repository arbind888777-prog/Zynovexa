import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';
import { BlogFilteredContent, SubscribeForm } from '@/components/BlogClient';

export const metadata: Metadata = {
  title: 'Blog — Social Media Tips, Guides & Creator Insights | Zynovexa',
  description: 'Expert social media tips, platform algorithm updates, content strategy guides, AI tools tutorials, and creator growth stories on the Zynovexa Blog.',
  alternates: { canonical: 'https://zynovexa.com/blog' },
};

const CATEGORIES = ['All', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'AI Tools', 'Analytics', 'Creator Economy'];

const POSTS = [
  {
    slug: 'instagram-reels-algorithm-2026',
    category: 'Instagram',
    title: 'Instagram Reels Algorithm in 2026: What Actually Works',
    excerpt: 'We analyzed 10,000 Reels to understand what the Instagram algorithm rewards in 2026. Here are the 7 factors that matter most.',
    readTime: '8 min read',
    date: 'Feb 28, 2026',
    author: 'Priya Sharma',
    avatar: 'P',
    featured: true,
  },
  {
    slug: 'ai-content-creation-workflow',
    category: 'AI Tools',
    title: 'How to Build a 30-Day Content Calendar in 2 Hours with AI',
    excerpt: 'A step-by-step workflow using Zynovexa\'s AI tools to batch-produce a month of social media content in one sitting.',
    readTime: '6 min read',
    date: 'Feb 25, 2026',
    author: 'Rahul Verma',
    avatar: 'R',
    featured: true,
  },
  {
    slug: 'tiktok-growth-strategy-2026',
    category: 'TikTok',
    title: '10 TikTok Growth Hacks That Are Working Right Now',
    excerpt: 'From late-night posting windows to duet strategies that explode your following — these are the TikTok tactics working in 2026.',
    readTime: '7 min read',
    date: 'Feb 20, 2026',
    author: 'Arjun Kapoor',
    avatar: 'A',
    featured: false,
  },
  {
    slug: 'linkedin-personal-brand',
    category: 'LinkedIn',
    title: 'How to Build a 10K LinkedIn Following from Zero in 90 Days',
    excerpt: 'The exact posting strategy, content types, and engagement tactics that grew multiple accounts from 0 to 10K in under 3 months.',
    readTime: '10 min read',
    date: 'Feb 18, 2026',
    author: 'Meera Singh',
    avatar: 'M',
    featured: false,
  },
  {
    slug: 'social-media-analytics-guide',
    category: 'Analytics',
    title: 'The Only Social Media Analytics Guide You\'ll Ever Need',
    excerpt: 'Which metrics actually matter, which are vanity metrics, and how to use data to make content decisions that grow your audience.',
    readTime: '12 min read',
    date: 'Feb 15, 2026',
    author: 'Priya Sharma',
    avatar: 'P',
    featured: false,
  },
  {
    slug: 'youtube-shorts-strategy',
    category: 'YouTube',
    title: 'YouTube Shorts Strategy: From Zero to 100K Views',
    excerpt: 'The complete framework for creating YouTube Shorts that convert casual viewers into long-form subscribers.',
    readTime: '9 min read',
    date: 'Feb 12, 2026',
    author: 'Rohit Gupta',
    avatar: 'R',
    featured: false,
  },
  {
    slug: 'creator-monetization-2026',
    category: 'Creator Economy',
    title: '7 Ways Creators Are Making $10K+/Month in 2026',
    excerpt: 'Beyond brand deals and AdSense — the monetization streams that the top creators are using to diversify their income.',
    readTime: '11 min read',
    date: 'Feb 10, 2026',
    author: 'Arjun Kapoor',
    avatar: 'A',
    featured: false,
  },
  {
    slug: 'ai-hashtag-strategy',
    category: 'AI Tools',
    title: 'Why Random Hashtags Are Killing Your Reach (And What to Do)',
    excerpt: 'The data-backed hashtag strategy for 2026, and how Zynovexa\'s AI generates the right mix of tags for maximum discovery.',
    readTime: '5 min read',
    date: 'Feb 8, 2026',
    author: 'Meera Singh',
    avatar: 'M',
    featured: false,
  },
];

export default function BlogPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <span className="badge badge-purple mb-6 inline-block">📝 Blog</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            Social media insights for <span className="gradient-text">modern creators</span>
          </h1>
          <p className="text-slate-400 text-lg">Strategies, tips, and guides to grow your audience on every platform.</p>
        </div>
      </section>

      <BlogFilteredContent categories={CATEGORIES} posts={POSTS} />

      {/* Newsletter CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-2">Get weekly creator insights</h2>
          <p className="text-slate-400 text-sm mb-6">Join 15,000+ creators who read our weekly social media strategy newsletter.</p>
          <SubscribeForm />
        </div>
      </section>
    </MarketingLayout>
  );
}
