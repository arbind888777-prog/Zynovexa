import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

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

const CATEGORY_COLORS: Record<string, string> = {
  Instagram: 'badge-pink',
  TikTok: 'badge-purple',
  YouTube: 'badge-purple',
  LinkedIn: 'badge-purple',
  'AI Tools': 'badge-purple',
  Analytics: 'badge-blue',
  'Creator Economy': 'badge-green',
};

export default function BlogPage() {
  const featured = POSTS.filter(p => p.featured);
  const rest = POSTS.filter(p => !p.featured);

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

      {/* Categories */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`px-4 py-1.5 rounded-full text-sm transition-all ${cat === 'All' ? 'btn-primary text-white' : 'card text-slate-400 hover:text-white hover:border-purple-500/40'}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured posts */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
          {featured.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover p-7 flex flex-col group">
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${CATEGORY_COLORS[post.category] || 'badge-purple'} text-xs`}>{post.category}</span>
                <span className="text-slate-600 text-xs">Featured</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-snug">{post.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{post.avatar}</div>
                  <span className="text-slate-400 text-xs">{post.author}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All posts */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Latest articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover p-6 flex flex-col group">
                <span className={`badge ${CATEGORY_COLORS[post.category] || 'badge-purple'} text-xs mb-3 self-start`}>{post.category}</span>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors leading-snug">{post.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{post.avatar}</div>
                    <span className="text-slate-500 text-xs">{post.author}</span>
                  </div>
                  <span className="text-slate-500 text-xs">{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-2xl font-extrabold text-white mb-2">Get weekly creator insights</h2>
          <p className="text-slate-400 text-sm mb-6">Join 15,000+ creators who read our weekly social media strategy newsletter.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-white/5 border text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60" style={{ borderColor: 'var(--border2)' }} />
            <button className="btn btn-primary px-4">Subscribe</button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
