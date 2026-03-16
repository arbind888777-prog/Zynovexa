'use client';

import { toast } from 'sonner';
import { useState } from 'react';

interface Resource {
  icon: string;
  type: string;
  title: string;
  desc: string;
  tag: string;
  free: boolean;
}

export default function ResourceLibraryClient({
  types,
  resources,
}: {
  types: string[];
  resources: Resource[];
}) {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? resources : resources.filter(r => r.type === active);

  const handleDownload = (r: Resource) => {
    if (r.free) {
      toast.success(`Downloading "${r.title}"...`);
    } else {
      toast.info(`"${r.title}" is a Pro resource. Upgrade to access it!`);
    }
  };

  return (
    <>
      {/* Filter */}
      <section className="py-6 px-4 sm:px-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                t === active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={t === active ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Resources grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(r => (
            <div key={r.title} className="card card-hover p-6 flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{r.icon}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.free ? 'text-green-400' : 'text-purple-400'}`}
                  style={{ background: r.free ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)' }}
                >
                  {r.free ? '🆓 Free' : '⭐ Pro'}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{r.type}</span>
                <h3 className="font-bold text-white mt-1 mb-2 group-hover:text-purple-300 transition-colors leading-snug">{r.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{r.desc}</p>
              </div>
              <div className="mt-auto pt-4">
                <span className="badge text-xs mr-2" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--slate-400)' }}>{r.tag}</span>
                <button
                  onClick={() => handleDownload(r)}
                  className={`btn btn-sm float-right ${r.free ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {r.free ? 'Download Free' : 'Get with Pro'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 mt-4">No resources found for &ldquo;{active}&rdquo;</p>
        )}
      </section>
    </>
  );
}
