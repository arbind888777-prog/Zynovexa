'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PERIODS = ['7d', '30d', '90d', '1y'] as const;
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

function MetricCard({ label, value, sub, icon }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value !== undefined ? value.toLocaleString() : '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { data: overview } = useQuery({ queryKey: ['analytics-overview', period], queryFn: () => analyticsApi.getOverview({ period }).then(r => r.data) });
  const { data: chart } = useQuery({ queryKey: ['analytics-chart', period], queryFn: () => analyticsApi.getChartData({ period }).then(r => r.data) });
  const { data: platforms } = useQuery({ queryKey: ['analytics-platforms'], queryFn: () => analyticsApi.getPlatforms().then(r => r.data) });
  const { data: topPosts } = useQuery({ queryKey: ['top-posts'], queryFn: () => analyticsApi.getTopPosts(10).then(r => r.data) });

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">📈 Analytics</h1>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              style={{ background: period === p ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)', border: '1px solid var(--border)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="👁️" label="Total Impressions" value={overview?.totalImpressions} sub={`Last ${period}`} />
        <MetricCard icon="❤️" label="Engagements" value={overview?.totalEngagements} sub={`${overview?.avgEngagementRate}% rate`} />
        <MetricCard icon="👥" label="Total Followers" value={overview?.totalFollowers} />
        <MetricCard icon="📝" label="Posts Published" value={overview?.publishedPosts} sub={`of ${overview?.totalPosts} total`} />
      </div>

      {/* Chart */}
      {chart?.chartData && chart.chartData.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-6">Impressions & Engagements Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chart.chartData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d50', borderRadius: 8, color: '#e5e7eb' }} />
              <Area type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="engagements" stroke="#a855f7" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Platform breakdown */}
      {platforms && platforms.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4">Platform Breakdown</h2>
            <div className="space-y-3">
              {platforms.map((p: any, i: number) => (
                <div key={p.platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-gray-300">{p.platform}</span>
                    <span className="text-xs text-gray-500">{p.handle}</span>
                  </div>
                  <div className="text-sm font-mono text-white">{(p.followers || 0).toLocaleString()} followers</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4">🔥 Top Posts</h2>
            <div className="space-y-2">
              {topPosts?.slice(0, 5).map((post: any) => (
                <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--surface)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">{post.title || post.caption?.substring(0, 35) + '...'}</p>
                    <p className="text-xs text-gray-500">{post.platforms?.join(', ')}</p>
                  </div>
                  <span className="text-xs font-bold text-purple-400">{post.viralScore}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
