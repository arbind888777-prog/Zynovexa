'use client';

import { toast } from 'sonner';
import { useState } from 'react';

interface HelpClientProps {
  categories: { icon: string; title: string; desc: string; articles: string[] }[];
  popularArticles: string[];
}

export default function HelpClient({ categories, popularArticles }: HelpClientProps) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? categories
        .map(cat => ({
          ...cat,
          articles: cat.articles.filter(a => a.toLowerCase().includes(search.toLowerCase())),
        }))
        .filter(cat => cat.articles.length > 0)
    : categories;

  const handleArticleClick = (article: string) => {
    toast.info(`📄 "${article}" — coming soon!`);
  };

  return (
    <>
      {/* Search */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <span className="badge badge-purple mb-6 inline-block">❓ Help Center</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 text-white">
            How can we <span className="gradient-text">help you?</span>
          </h1>
          <div className="relative max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search articles, tutorials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-5 py-3.5 pl-11 rounded-xl text-sm bg-white/5 border text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
              style={{ borderColor: 'var(--border2)' }}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
        </div>
      </section>

      {/* Popular */}
      {!search.trim() && (
        <section className="pb-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Popular articles</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularArticles.map(a => (
                <button key={a} onClick={() => handleArticleClick(a)} className="text-sm px-4 py-2 card card-hover text-slate-300 hover:text-white">
                  {a}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories grid */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(cat => (
            <div key={cat.title} className="card card-hover p-6">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h2 className="text-white font-bold mb-1.5">{cat.title}</h2>
              <p className="text-slate-400 text-sm mb-4">{cat.desc}</p>
              <ul className="space-y-2">
                {cat.articles.map(a => (
                  <li key={a}>
                    <button onClick={() => handleArticleClick(a)} className="text-sm text-purple-400 hover:text-purple-300 text-left transition-colors">
                      → {a}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 mt-8">No articles found for &ldquo;{search}&rdquo;</p>
        )}
      </section>
    </>
  );
}
