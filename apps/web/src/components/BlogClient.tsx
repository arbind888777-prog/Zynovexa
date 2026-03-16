'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  avatar: string;
  featured: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Instagram: 'badge-pink',
  TikTok: 'badge-purple',
  YouTube: 'badge-purple',
  LinkedIn: 'badge-purple',
  'AI Tools': 'badge-purple',
  Analytics: 'badge-blue',
  'Creator Economy': 'badge-green',
};

export function BlogFilteredContent({
  categories,
  posts,
}: {
  categories: string[];
  posts: Post[];
}) {
  const [active, setActive] = useState('All');
  const filteredPosts = active === 'All' ? posts : posts.filter(p => p.category === active);
  const featured = filteredPosts.filter(p => p.featured);
  const rest = filteredPosts.filter(p => !p.featured);

  return (
    <>
      {/* Category Filter */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                cat === active
                  ? 'btn-primary text-white'
                  : 'card text-slate-400 hover:text-white hover:border-purple-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured posts */}
      {featured.length > 0 && (
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
      )}

      {/* All posts */}
      {rest.length > 0 && (
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
      )}

      {filteredPosts.length === 0 && (
        <p className="text-center text-slate-500 pb-16">No articles found for &ldquo;{active}&rdquo;</p>
      )}
    </>
  );
}

export function SubscribeForm() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success(`Subscribed with ${email}! Check your inbox.`);
    setEmail('');
  };

  return (
    <div className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
        className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-white/5 border text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
        style={{ borderColor: 'var(--border2)' }}
      />
      <button onClick={handleSubscribe} className="btn btn-primary px-4">
        Subscribe
      </button>
    </div>
  );
}
