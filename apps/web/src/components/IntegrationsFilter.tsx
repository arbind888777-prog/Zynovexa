'use client';

import { useState } from 'react';

interface Integration {
  icon: string;
  name: string;
  category: string;
  desc: string;
}

export default function IntegrationsFilter({
  categories,
  integrations,
}: {
  categories: string[];
  integrations: Integration[];
}) {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? integrations : integrations.filter(i => i.category === active);

  return (
    <>
      {/* Category filter */}
      <section className="pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                cat === active
                  ? 'btn-primary text-white'
                  : 'card text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Integrations grid */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(i => (
            <div key={i.name} className="card card-hover p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{i.icon}</span>
                <div>
                  <h3 className="text-white font-semibold text-sm">{i.name}</h3>
                  <span className="text-xs text-slate-500">{i.category}</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs">{i.desc}</p>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 mt-4">No integrations found for &ldquo;{active}&rdquo;</p>
        )}
      </section>
    </>
  );
}
