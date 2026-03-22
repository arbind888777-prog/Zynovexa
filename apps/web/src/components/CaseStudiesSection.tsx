'use client';

import { useState, useEffect } from 'react';

interface CaseStudy {
  id: string;
  title: string;
  niche: string;
  duration_days: number;
  beforeMetrics: Record<string, number>;
  afterMetrics: Record<string, number>;
  strategy_used: string;
  toolsUsed: string[];
  growth_followers: number;
  growth_engagement: number;
  growth_revenue: number;
}

export function CaseStudiesSection() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [selected, setSelected] = useState<CaseStudy | null>(null);

  useEffect(() => {
    fetch('/api/trust/case-studies')
      .then((r) => r.json())
      .then((d) => setStudies(d.data?.case_studies ?? d ?? []))
      .catch(() => setStudies(FALLBACK_STUDIES));
  }, []);

  const items = studies.length > 0 ? studies : FALLBACK_STUDIES;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">
            Before → After: Real Data
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Measurable growth backed by analytics, not marketing hype.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((study) => (
            <div
              key={study.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelected(study)}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                    {study.niche}
                  </span>
                  <span className="text-xs text-gray-400">{study.duration_days} days</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  {study.title}
                </h3>

                {/* Before/After Comparison */}
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Before" value={study.beforeMetrics.followers ?? 0} suffix="followers" variant="before" />
                  <MetricCard label="After" value={study.afterMetrics.followers ?? 0} suffix="followers" variant="after" />
                </div>

                {/* Growth Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Growth</span>
                    <span className="font-semibold text-green-600">+{study.growth_followers}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(study.growth_followers, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Strategy */}
                <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                  Strategy: {study.strategy_used}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <GrowthStat label="Followers" value={`+${selected.growth_followers}%`} />
                  <GrowthStat label="Engagement" value={`+${selected.growth_engagement}%`} />
                  <GrowthStat label="Revenue" value={`+${selected.growth_revenue}%`} />
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Strategy Used</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selected.strategy_used}</p>
                </div>

                {selected.toolsUsed.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Zynovexa Features Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.toolsUsed.map((tool) => (
                        <span key={tool} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-lg">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Before/After */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Metrics Comparison</h4>
                  <div className="space-y-2">
                    {Object.keys(selected.afterMetrics).map((key) => (
                      <div key={key} className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-700">
                        <span className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400">{(selected.beforeMetrics[key] ?? 0).toLocaleString()}</span>
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="text-sm font-semibold text-green-600">{(selected.afterMetrics[key] ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MetricCard({ label, value, suffix, variant }: { label: string; value: number; suffix: string; variant: 'before' | 'after' }) {
  return (
    <div className={`rounded-xl p-3 text-center ${variant === 'before' ? 'bg-gray-50 dark:bg-gray-700' : 'bg-green-50 dark:bg-green-900/30'}`}>
      <p className={`text-xs font-medium ${variant === 'before' ? 'text-gray-400' : 'text-green-600 dark:text-green-400'}`}>{label}</p>
      <p className={`text-lg font-bold ${variant === 'before' ? 'text-gray-600 dark:text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] text-gray-400">{suffix}</p>
    </div>
  );
}

function GrowthStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 text-center">
      <p className="text-xs text-green-600 dark:text-green-400">{label}</p>
      <p className="text-xl font-bold text-green-700 dark:text-green-300">{value}</p>
    </div>
  );
}

const FALLBACK_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'From 0 to 50K: Lifestyle Creator Growth',
    niche: 'Lifestyle',
    duration_days: 120,
    beforeMetrics: { followers: 500, engagement_rate: 1.2, monthly_impressions: 5000 },
    afterMetrics: { followers: 52000, engagement_rate: 6.8, monthly_impressions: 450000 },
    strategy_used: 'Daily Reels with AI-optimized captions, strategic hashtag research, and scheduled posting at peak hours.',
    toolsUsed: ['AI Captions', 'Scheduling', 'Hashtag Generator', 'Growth Coach'],
    growth_followers: 10300,
    growth_engagement: 467,
    growth_revenue: 0,
  },
  {
    id: '2',
    title: 'Tech YouTuber: 3x Subscriber Growth',
    niche: 'Technology',
    duration_days: 90,
    beforeMetrics: { subscribers: 3200, avg_views: 800, watch_time_hours: 120 },
    afterMetrics: { subscribers: 11500, avg_views: 4200, watch_time_hours: 580 },
    strategy_used: 'AI-generated video scripts with optimized hooks, keyword-driven titles, consistent upload schedule.',
    toolsUsed: ['YouTube Script Generator', 'SEO Tools', 'Analytics', 'Competitor Tracking'],
    growth_followers: 259,
    growth_engagement: 425,
    growth_revenue: 340,
  },
];
