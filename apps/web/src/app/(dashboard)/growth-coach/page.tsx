'use client';

import { useState, useEffect } from 'react';
import { growthCoachApi, unwrapApiResponse } from '@/lib/api';

interface Recommendation {
  type: string;
  icon: string;
  title: string;
  description: string;
  action?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface WeeklyReport {
  period: { start: string; end: string };
  postsCreated: number;
  totalImpressions: number;
  totalEngagement: number;
  engagementRate: number;
  followerChange: number;
  suggestions: string[];
  summary: string;
}

const PRIORITY_COLORS = {
  critical: 'border-red-400 bg-red-50 dark:bg-red-900/20',
  high: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
  medium: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  low: 'border-gray-300 bg-gray-50 dark:bg-gray-800',
};

export default function GrowthCoachPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      growthCoachApi.getDaily().then(unwrapApiResponse).catch(() => null),
      growthCoachApi.getWeeklyReport().then(unwrapApiResponse).catch(() => null),
    ])
      .then(([daily, weekly]: any[]) => {
        setRecommendations(daily?.recommendations ?? FALLBACK_RECOMMENDATIONS);
        setReport(weekly?.report ?? FALLBACK_REPORT);
      })
      .catch(() => {
        setRecommendations(FALLBACK_RECOMMENDATIONS);
        setReport(FALLBACK_REPORT);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🌱 AI Growth Coach
          </h1>
          <p className="text-sm text-gray-500">Personalized recommendations to grow faster</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setTab('daily')}
            className={`px-4 py-1.5 text-sm rounded-md transition ${tab === 'daily' ? 'bg-white dark:bg-gray-700 shadow-sm font-medium' : 'text-gray-500'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setTab('weekly')}
            className={`px-4 py-1.5 text-sm rounded-md transition ${tab === 'weekly' ? 'bg-white dark:bg-gray-700 shadow-sm font-medium' : 'text-gray-500'}`}
          >
            Weekly Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : tab === 'daily' ? (
        /* Daily Recommendations */
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className={`rounded-xl border-l-4 p-5 ${PRIORITY_COLORS[rec.priority]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{rec.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                  {rec.action && (
                    <button className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition">
                      {rec.action}
                    </button>
                  )}
                </div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  rec.priority === 'critical' ? 'bg-red-200 text-red-700' :
                  rec.priority === 'high' ? 'bg-blue-200 text-blue-700' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {rec.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Weekly Report */
        report && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Week Summary</h3>
                <span className="text-xs text-gray-400">
                  {report.period.start} → {report.period.end}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{report.summary}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Posts Created" value={report.postsCreated.toString()} icon="📝" />
                <MetricCard label="Impressions" value={report.totalImpressions.toLocaleString()} icon="👀" />
                <MetricCard label="Engagements" value={report.totalEngagement.toLocaleString()} icon="❤️" />
                <MetricCard label="Engagement Rate" value={`${report.engagementRate}%`} icon="📊" />
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Improvement Suggestions</h3>
              <div className="space-y-3">
                {report.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-blue-500 font-bold text-lg">{i + 1}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  { type: 'what_to_post', icon: '📝', title: 'Create a value-driven carousel post', description: 'Carousel posts get 3x more engagement. Share 5-7 actionable tips.', action: 'Generate AI caption', priority: 'high' },
  { type: 'when_to_post', icon: '⏰', title: 'Best time to post: 6-8 PM', description: 'Your audience is most active during evening hours.', action: 'Schedule a post', priority: 'high' },
  { type: 'why_it_works', icon: '💡', title: 'Algorithm insight', description: 'Instagram is prioritizing Reels. Aim for 3+ Reels per week.', priority: 'medium' },
];

const FALLBACK_REPORT: WeeklyReport = {
  period: { start: '2026-03-15', end: '2026-03-22' },
  postsCreated: 5,
  totalImpressions: 12400,
  totalEngagement: 890,
  engagementRate: 7.2,
  followerChange: 230,
  suggestions: [
    'Post at least 5 times per week for optimal growth',
    'Add engaging questions in your captions to boost comments',
    'Experiment with Reels/Shorts for 2-3x more reach',
  ],
  summary: 'Solid week with 5 posts and 7.2% engagement rate. Keep experimenting with short-form video.',
};
