'use client';

import { useState, useEffect } from 'react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  target_date: string;
  released_at: string;
}

interface Roadmap {
  planned: RoadmapItem[];
  in_progress: RoadmapItem[];
  released: RoadmapItem[];
}

const COLUMN_CONFIG = [
  { key: 'planned' as const, label: 'Planned', color: 'bg-gray-100 dark:bg-gray-700', textColor: 'text-gray-600 dark:text-gray-300', icon: '📋' },
  { key: 'in_progress' as const, label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-300', icon: '🚧' },
  { key: 'released' as const, label: 'Released', color: 'bg-green-50 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-300', icon: '✅' },
];

const CATEGORY_COLORS: Record<string, string> = {
  feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  improvement: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  integration: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  fix: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap>({ planned: [], in_progress: [], released: [] });
  const [loading, setLoading] = useState(true);
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/trust/roadmap')
      .then((r) => r.json())
      .then((d) => setRoadmap(d.data?.roadmap ?? d ?? { planned: [], in_progress: [], released: [] }))
      .catch(() => setRoadmap(FALLBACK_ROADMAP))
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async (id: string) => {
    if (votedItems.has(id)) return;
    setVotedItems((prev) => new Set(prev).add(id));

    // Optimistic update
    setRoadmap((prev) => {
      const update = (items: RoadmapItem[]) =>
        items.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i));
      return {
        planned: update(prev.planned),
        in_progress: update(prev.in_progress),
        released: update(prev.released),
      };
    });

    try {
      await fetch(`/api/trust/roadmap/${id}/vote`, { method: 'POST' });
    } catch {
      // Revert on failure
      setVotedItems((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const data = roadmap.planned.length > 0 || roadmap.in_progress.length > 0 || roadmap.released.length > 0
    ? roadmap
    : FALLBACK_ROADMAP;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Product Roadmap
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            See what we&apos;re building. Vote on features you want most.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
                <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-24 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {COLUMN_CONFIG.map((col) => (
              <div key={col.key} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className={`px-5 py-3 ${col.color} flex items-center gap-2`}>
                  <span>{col.icon}</span>
                  <h3 className={`font-semibold ${col.textColor}`}>
                    {col.label}
                  </h3>
                  <span className="ml-auto text-xs text-gray-400 bg-white dark:bg-gray-600 px-2 py-0.5 rounded-full">
                    {data[col.key].length}
                  </span>
                </div>
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {data[col.key].map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.feature}`}>
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {item.target_date && (
                          <span className="text-[10px] text-gray-400">
                            ETA: {item.target_date}
                          </span>
                        )}
                        {col.key !== 'released' && (
                          <button
                            onClick={() => handleVote(item.id)}
                            disabled={votedItems.has(item.id)}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition ${
                              votedItems.has(item.id)
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600'
                            }`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            {item.votes}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {data[col.key].length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">No items yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const FALLBACK_ROADMAP: Roadmap = {
  planned: [
    { id: 'r1', title: 'WhatsApp Business Integration', description: 'Post directly to WhatsApp Status and Business accounts.', category: 'integration', status: 'planned', votes: 142, target_date: 'Q3 2026', released_at: '' },
    { id: 'r2', title: 'AI Video Editor', description: 'Auto-trim, subtitle, and optimize videos for each platform.', category: 'feature', status: 'planned', votes: 98, target_date: 'Q4 2026', released_at: '' },
    { id: 'r3', title: 'Team Collaboration', description: 'Invite team members with role-based access.', category: 'feature', status: 'planned', votes: 87, target_date: 'Q3 2026', released_at: '' },
  ],
  in_progress: [
    { id: 'r4', title: 'Telegram Bot Integration', description: 'Auto-post to Telegram channels and groups.', category: 'integration', status: 'in_progress', votes: 76, target_date: 'Q2 2026', released_at: '' },
    { id: 'r5', title: 'Advanced A/B Testing', description: 'Test different captions and see which performs better.', category: 'feature', status: 'in_progress', votes: 65, target_date: 'Q2 2026', released_at: '' },
  ],
  released: [
    { id: 'r6', title: 'AI Growth Coach', description: 'Daily personalized recommendations on what, when, and how to post.', category: 'feature', status: 'released', votes: 203, target_date: '', released_at: '2026-02-15' },
    { id: 'r7', title: 'Pro Analytics', description: 'Engagement rate, CTR, competitor tracking, and content ranking.', category: 'feature', status: 'released', votes: 178, target_date: '', released_at: '2026-01-20' },
    { id: 'r8', title: 'Creator Storefront', description: 'Sell digital products directly from your profile.', category: 'feature', status: 'released', votes: 156, target_date: '', released_at: '2026-03-01' },
  ],
};
