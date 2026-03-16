'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Article {
  category: string;
  title: string;
  desc: string;
  readTime: string;
  date: string;
  image: string;
  tag: string;
}

export default function InsightsFilter({
  tags,
  articles,
}: {
  tags: string[];
  articles: Article[];
}) {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? articles : articles.filter(a => a.tag === active || a.category === active);

  return (
    <>
      {/* Filter tags */}
      <section className="py-6 px-4 sm:px-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tag === active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={tag === active ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(a => (
            <Link key={a.title} href="/blog" className="card card-hover p-6 flex flex-col group">
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
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm col-span-full text-center py-12">No articles found for this filter.</p>
          )}
        </div>
      </section>
    </>
  );
}
