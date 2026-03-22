'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, proAnalyticsApi, unwrapApiResponse } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const PERIODS = ['7d', '30d', '90d', '1y'] as const;
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
const DEMO_CHART_DATA = [
  { date: 'Mon', impressions: 1200, engagements: 72, reach: 940 },
  { date: 'Tue', impressions: 1800, engagements: 110, reach: 1320 },
  { date: 'Wed', impressions: 2400, engagements: 140, reach: 1810 },
  { date: 'Thu', impressions: 2100, engagements: 128, reach: 1630 },
  { date: 'Fri', impressions: 3100, engagements: 220, reach: 2490 },
  { date: 'Sat', impressions: 3600, engagements: 270, reach: 2980 },
  { date: 'Sun', impressions: 2800, engagements: 205, reach: 2240 },
];

function formatCompactNumber(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: value >= 10000 ? 0 : 1 }).format(value);
}

function getChartSummary(chartData?: any[]) {
  if (!chartData || chartData.length === 0) return null;

  const totals = chartData.reduce((acc, item) => {
    acc.impressions += item.impressions || 0;
    acc.engagements += item.engagements || 0;
    return acc;
  }, { impressions: 0, engagements: 0 });

  const peakImpressionsDay = chartData.reduce((best, item) => {
    if (!best || (item.impressions || 0) > (best.impressions || 0)) return item;
    return best;
  }, null as any);

  const bestEngagementDay = chartData.reduce((best, item) => {
    const itemRate = (item.impressions || 0) > 0 ? ((item.engagements || 0) / item.impressions) * 100 : 0;
    const bestRate = best && (best.impressions || 0) > 0 ? ((best.engagements || 0) / best.impressions) * 100 : 0;
    if (!best || itemRate > bestRate) return item;
    return best;
  }, null as any);

  return {
    avgImpressions: Math.round(totals.impressions / chartData.length),
    avgEngagements: Math.round(totals.engagements / chartData.length),
    peakImpressionsDay,
    bestEngagementDay,
  };
}

function ChartTooltipContent({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  const impressions = payload.find((item) => item.dataKey === 'impressions')?.value ?? 0;
  const engagements = payload.find((item) => item.dataKey === 'engagements')?.value ?? 0;
  const engagementRate = impressions > 0 ? ((engagements / impressions) * 100).toFixed(1) : '0.0';

  return (
    <div className="dashboard-surface-muted min-w-[180px] p-3 shadow-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />Impressions</span>
          <span className="font-semibold text-white">{impressions.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" />Engagements</span>
          <span className="font-semibold text-white">{engagements.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-3 border-t border-white/10 pt-3 text-xs text-emerald-300">Engagement efficiency: {engagementRate}%</div>
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="dashboard-inline-stat flex items-center gap-2 px-3 py-2 text-xs text-slate-300">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" /> Impressions
      </div>
      <div className="dashboard-inline-stat flex items-center gap-2 px-3 py-2 text-xs text-slate-300">
        <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" /> Engagements
      </div>
    </div>
  );
}

function ChartSummaryStrip({ chartData }: { chartData?: any[] }) {
  const summary = getChartSummary(chartData);

  if (!summary) return null;

  const bestEngagementRate = summary.bestEngagementDay && (summary.bestEngagementDay.impressions || 0) > 0
    ? (((summary.bestEngagementDay.engagements || 0) / summary.bestEngagementDay.impressions) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="dashboard-surface-muted p-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Avg Daily Reach</p>
        <p className="mt-2 text-lg font-semibold text-white">{formatCompactNumber(summary.avgImpressions)}</p>
        <p className="mt-1 text-xs text-slate-400">Average impressions per visible day</p>
      </div>
      <div className="dashboard-surface-muted p-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Peak Day</p>
        <p className="mt-2 text-lg font-semibold text-white">{summary.peakImpressionsDay?.date}</p>
        <p className="mt-1 text-xs text-slate-400">{formatCompactNumber(summary.peakImpressionsDay?.impressions || 0)} impressions</p>
      </div>
      <div className="dashboard-surface-muted p-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Best Efficiency</p>
        <p className="mt-2 text-lg font-semibold text-white">{summary.bestEngagementDay?.date}</p>
        <p className="mt-1 text-xs text-slate-400">{bestEngagementRate}% engagement efficiency</p>
      </div>
    </div>
  );
}

function getPlatformShareData(platforms?: any[]) {
  if (!platforms || platforms.length === 0) return [];

  const totalFollowers = platforms.reduce((sum, item) => sum + (item.followers || 0), 0);

  return platforms.map((item, index) => {
    const followers = item.followers || 0;
    const share = totalFollowers > 0 ? (followers / totalFollowers) * 100 : 0;
    return {
      ...item,
      share,
      color: COLORS[index % COLORS.length],
    };
  });
}

function getPostScoreTone(score?: number) {
  if ((score || 0) >= 80) return { label: 'High traction', color: '#34d399', bg: 'rgba(16,185,129,0.12)' };
  if ((score || 0) >= 60) return { label: 'Growing', color: '#a78bfa', bg: 'rgba(99,102,241,0.14)' };
  return { label: 'Needs push', color: '#fbbf24', bg: 'rgba(245,158,11,0.14)' };
}

function PlatformShareRow({ platform }: { platform: any }) {
  return (
    <div className="dashboard-surface-muted p-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: platform.color }} />
            <p className="text-sm font-semibold text-white">{platform.platform}</p>
            <span className="truncate text-xs text-slate-500">{platform.handle}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full" style={{ width: `${Math.max(platform.share, 4)}%`, background: `linear-gradient(90deg, ${platform.color}, rgba(255,255,255,0.85))` }} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{(platform.followers || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-400">{platform.share.toFixed(1)}% share</p>
        </div>
      </div>
    </div>
  );
}

function TopPostRow({ post }: { post: any }) {
  const scoreTone = getPostScoreTone(post.viralScore);
  const platformCount = post.platforms?.length || 0;
  const mediaLabel = post.mediaType || 'POST';

  return (
    <div className="dashboard-list-row flex items-center gap-3 p-3">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-200 truncate">{post.title || post.caption?.substring(0, 48) + '...'}</p>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: scoreTone.color, background: scoreTone.bg }}>
            {scoreTone.label}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>{post.platforms?.join(', ')}</span>
          <span className="text-slate-600">•</span>
          <span>{platformCount} channel{platformCount === 1 ? '' : 's'}</span>
          <span className="text-slate-600">•</span>
          <span>{mediaLabel}</span>
        </div>
      </div>
      <div className="min-w-[92px] text-right">
        <p className="text-sm font-bold text-purple-400">{post.viralScore}%</p>
        <div className="mt-2 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
          <div className="h-1.5 rounded-full" style={{ width: `${Math.max(8, post.viralScore || 0)}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
        </div>
      </div>
    </div>
  );
}

function getGrowthInsights({ overview, chartData, topPosts, platforms }: { overview?: any; chartData?: any[]; topPosts?: any[]; platforms?: any[] }) {
  const insights: Array<{ title: string; insight: string; recommendation: string; tone: string }> = [];
  const videoPosts = (topPosts || []).filter((post) => post.mediaType === 'VIDEO');
  const textPosts = (topPosts || []).filter((post) => post.mediaType === 'TEXT');
  const topChartDay = (chartData || []).reduce((best, item) => {
    if (!best || (item.impressions || 0) > (best.impressions || 0)) return item;
    return best;
  }, null as any);
  const topPlatform = (platforms || []).reduce((best, item) => {
    if (!best || (item.followers || 0) > (best.followers || 0)) return item;
    return best;
  }, null as any);

  if (videoPosts.length > 0) {
    insights.push({
      title: 'Video momentum',
      insight: 'Your video posts are leading the performance table and pulling the strongest reach.',
      recommendation: 'Create 2 more short-form video posts this week to compound growth.',
      tone: 'blue',
    });
  }

  if (textPosts.length > 0 && videoPosts.length === 0) {
    insights.push({
      title: 'Text is carrying performance',
      insight: 'Your current traction is being driven by text-led posts, which means fast publishing is working.',
      recommendation: 'Batch 3 more quick posts and test one image variation for comparison.',
      tone: 'emerald',
    });
  }

  if (topChartDay) {
    insights.push({
      title: 'Peak posting window',
      insight: `${topChartDay.date} is your current strongest day by impressions in this view.`,
      recommendation: 'Schedule your highest-value post around this day and compare next week.',
      tone: 'purple',
    });
  }

  if (typeof overview?.avgEngagementRate === 'number') {
    insights.push({
      title: 'Engagement health',
      insight: `Average engagement rate is ${overview.avgEngagementRate}%.`,
      recommendation: overview.avgEngagementRate >= 3
        ? 'Keep doubling down on the formats already generating interaction.'
        : 'Strengthen hooks and CTAs, especially in the first line of the caption.',
      tone: overview.avgEngagementRate >= 3 ? 'emerald' : 'amber',
    });
  }

  if (topPlatform) {
    insights.push({
      title: 'Strongest platform base',
      insight: `${topPlatform.platform} currently has your largest audience base.`,
      recommendation: 'Use that platform as your anchor channel and repurpose winners to secondary networks.',
      tone: 'pink',
    });
  }

  return insights.slice(0, 4);
}

function GrowthInsightCard({ title, insight, recommendation, tone }: { title: string; insight: string; recommendation: string; tone: string }) {
  const theme = {
    purple: { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', accent: '#a78bfa' },
    blue: { bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', accent: '#38bdf8' },
    emerald: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', accent: '#34d399' },
    amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', accent: '#fbbf24' },
    pink: { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', accent: '#f472b6' },
  }[tone as 'purple'];

  return (
    <div className="rounded-2xl p-5" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: theme.accent }}>Insight</span>
      </div>
      <p className="text-sm text-slate-300">{insight}</p>
      <p className="mt-3 text-xs font-medium" style={{ color: theme.accent }}>{recommendation}</p>
    </div>
  );
}

function DemoAnalyticsState() {
  const demoInsights = [
    { title: 'Your reels perform 2x better', insight: 'Short-form video generally drives more reach than static image posts in creator accounts like yours.', recommendation: 'Create two Reel-style posts and schedule them this week.', tone: 'blue' },
    { title: 'Post at 7 PM for better reach', insight: 'Evening publishing windows often outperform midday slots for lifestyle and creator niches.', recommendation: 'Use AI best-time scheduling to capture this window automatically.', tone: 'purple' },
    { title: 'Consistency beats volume', insight: 'Publishing 3-4 times per week usually outperforms random bursts followed by silence.', recommendation: 'Keep at least 3 posts in your queue at all times.', tone: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.16)' }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Demo analytics preview</p>
            <p className="text-xs text-slate-400 mt-1">Yeh sample data dikhata hai ki connected publishing ke baad aapko kis tarah ke insights milenge.</p>
          </div>
          <Link href="/accounts" className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            Connect Account
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="👁️" label="Demo Impressions" value={18240} sub="Last 30d sample" />
        <MetricCard icon="❤️" label="Demo Engagements" value={1248} sub="6.8% rate" />
        <MetricCard icon="👥" label="Demo Followers" value={3210} sub="Across 3 platforms" />
        <MetricCard icon="📝" label="Demo Posts Published" value={18} sub="With AI timing" />
      </div>

      <div className="dashboard-chart-shell dashboard-surface dashboard-soft-float p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">What premium analytics looks like</h2>
            <p className="mt-1 text-xs text-slate-400">Sample trend visualization with actionable daily benchmarks.</p>
          </div>
          <ChartLegend />
        </div>
        <div className="mb-4">
          <ChartSummaryStrip chartData={DEMO_CHART_DATA} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={DEMO_CHART_DATA}>
            <defs>
              <linearGradient id="demo1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="demo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'rgba(129,140,248,0.45)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} fill="url(#demo1)" />
            <Area type="monotone" dataKey="engagements" stroke="#a855f7" strokeWidth={2} fill="url(#demo2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {demoInsights.map((insight) => <GrowthInsightCard key={insight.title} {...insight} />)}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon }: any) {
  return (
    <div className="dashboard-metric-card p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="dashboard-data-chip h-10 w-10 text-2xl">{icon}</span>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value !== undefined ? value.toLocaleString() : '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [mainTab, setMainTab] = useState<'overview' | 'pro'>('overview');

  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useQuery({ queryKey: ['analytics-overview', period], queryFn: () => analyticsApi.getOverview({ period }).then(unwrapApiResponse) });
  const { data: chart, isLoading: chartLoading } = useQuery({ queryKey: ['analytics-chart', period], queryFn: () => analyticsApi.getChartData({ period }).then(unwrapApiResponse) });
  const { data: platforms, isLoading: platformsLoading } = useQuery({ queryKey: ['analytics-platforms'], queryFn: () => analyticsApi.getPlatforms().then(unwrapApiResponse) });
  const { data: topPosts, isLoading: postsLoading } = useQuery({ queryKey: ['top-posts'], queryFn: () => analyticsApi.getTopPosts(10).then(unwrapApiResponse) });

  const isLoading = overviewLoading || chartLoading;
  const hasRealAnalytics = Boolean(overview?.totalImpressions || overview?.totalEngagements || overview?.publishedPosts);
  const growthInsights = getGrowthInsights({
    overview,
    chartData: chart?.chartData,
    topPosts,
    platforms,
  });
  const platformShares = getPlatformShareData(platforms);

  // Pro Analytics data
  const { data: proOverview } = useQuery({ queryKey: ['pro-overview'], queryFn: () => proAnalyticsApi.getOverview().then(unwrapApiResponse).catch((e: any) => e?.response?.status === 403 ? { __locked: true } : null), enabled: mainTab === 'pro' });
  const { data: proRanking } = useQuery({ queryKey: ['pro-ranking'], queryFn: () => proAnalyticsApi.getContentRanking().then(unwrapApiResponse).catch(() => null), enabled: mainTab === 'pro' });
  const { data: proCompetitors } = useQuery({ queryKey: ['pro-competitors'], queryFn: () => proAnalyticsApi.getCompetitors().then(unwrapApiResponse).catch(() => null), enabled: mainTab === 'pro' });
  const proLocked = (proOverview as any)?.__locked === true;

  return (
    <div className="dashboard-content-shell space-y-8 animate-fade-in">
      <div className="dashboard-headerband flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Performance Overview</p>
          <h1 className="mt-2 text-2xl font-bold text-white">📈 Analytics</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Cross-platform reach, engagement aur growth patterns ko ek premium view me track karo.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--surface)' }}>
            <button onClick={() => setMainTab('overview')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${mainTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>📊 Overview</button>
            <button onClick={() => setMainTab('pro')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${mainTab === 'pro' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>🔬 Pro Analytics</button>
          </div>
          {mainTab === 'overview' && <div className="flex flex-wrap gap-2">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`dashboard-tab ${period === p ? 'dashboard-tab-active text-white' : 'text-gray-400 hover:text-white'}`}>
                {p}
              </button>
            ))}
          </div>}
        </div>
      </div>

      {/* Error State */}
      {mainTab === 'overview' && overviewError && (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-red-400 mb-2">Failed to load analytics data</p>
          <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {mainTab === 'overview' && isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dashboard-skeleton-card p-5">
                <div className="shimmer dashboard-skeleton-line w-8 h-8 mb-3" />
                <div className="shimmer dashboard-skeleton-line h-7 w-16 mb-2" />
                <div className="shimmer dashboard-skeleton-line h-3 w-24" />
              </div>
            ))}
          </div>
          <div className="dashboard-skeleton-card p-6">
            <div className="shimmer dashboard-skeleton-line h-5 w-48 mb-6" />
            <div className="shimmer dashboard-skeleton-row w-full h-64" />
          </div>
        </div>
      )}

      {/* Pro Analytics Tab */}
      {mainTab === 'pro' && (
        <div className="space-y-6">
          {proLocked ? (
            <div className="card p-12 text-center">
              <p className="text-5xl mb-4">🔒</p>
              <h2 className="text-xl font-bold text-white mb-2">Pro Analytics</h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">Engagement rates, content ranking, aur competitor tracking ke liye Pro plan chahiye.</p>
              <Link href="/settings?tab=billing" className="btn btn-primary">Upgrade to Pro</Link>
            </div>
          ) : (
            <>
              {/* Pro Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon="💬" label="Engagement Rate" value={proOverview?.engagementRate ? `${proOverview.engagementRate}%` : '—'} sub="Avg across platforms" />
                <MetricCard icon="🖱️" label="Click-Through Rate" value={proOverview?.ctr ? `${proOverview.ctr}%` : '—'} sub="Links & CTAs" />
                <MetricCard icon="📈" label="Follower Growth" value={proOverview?.followerGrowthRate ? `${proOverview.followerGrowthRate}%` : '—'} sub="This month" />
                <MetricCard icon="⭐" label="Content Score" value={proOverview?.avgContentScore ?? '—'} sub="AI-powered rating" />
              </div>

              {/* Content Ranking */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="dashboard-surface dashboard-soft-float p-6">
                  <h2 className="font-semibold text-white mb-1">🏆 Top Performing Content</h2>
                  <p className="text-xs text-slate-400 mb-4">Sabse zyada engagement wale posts</p>
                  <div className="space-y-3">
                    {(proRanking as any)?.top?.length > 0 ? (proRanking as any).top.slice(0, 5).map((p: any, i: number) => (
                      <div key={p.id || i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                        <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{p.title || p.caption || 'Untitled'}</p>
                          <p className="text-xs text-slate-400">{p.platform} · {p.engagements ?? 0} engagements</p>
                        </div>
                        {p.score && <span className="text-xs font-bold text-emerald-400">{p.score}%</span>}
                      </div>
                    )) : <p className="text-sm text-slate-500">No ranking data yet — keep posting!</p>}
                  </div>
                </div>

                <div className="dashboard-surface dashboard-soft-float p-6">
                  <h2 className="font-semibold text-white mb-1">📉 Needs Improvement</h2>
                  <p className="text-xs text-slate-400 mb-4">Low-performing content jo optimize karna chahiye</p>
                  <div className="space-y-3">
                    {(proRanking as any)?.worst?.length > 0 ? (proRanking as any).worst.slice(0, 5).map((p: any, i: number) => (
                      <div key={p.id || i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                        <span className="text-lg">⚠️</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{p.title || p.caption || 'Untitled'}</p>
                          <p className="text-xs text-slate-400">{p.platform} · {p.engagements ?? 0} engagements</p>
                        </div>
                        {p.score && <span className="text-xs font-bold text-red-400">{p.score}%</span>}
                      </div>
                    )) : <p className="text-sm text-slate-500">Not enough data yet.</p>}
                  </div>
                </div>
              </div>

              {/* Competitor Tracking */}
              <div className="dashboard-surface dashboard-soft-float p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-white">👀 Competitor Tracking</h2>
                    <p className="mt-1 text-xs text-slate-400">Track competitors aur unke performance se compare karo.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {(proCompetitors as any)?.length > 0 ? (proCompetitors as any).map((c: any, i: number) => (
                    <div key={c.handle || i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">{(c.handle || '?')[0].toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">@{c.handle}</p>
                        <p className="text-xs text-slate-400">{c.platform} · {c.followers ?? '?'} followers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Engagement</p>
                        <p className="text-sm font-bold text-white">{c.engagementRate ?? '—'}%</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-500 text-center py-4">No competitors added yet. Add competitors from the API to start tracking.</p>}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Overview */}
      {mainTab === 'overview' && !isLoading && !overviewError && (
      <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="👁️" label="Total Impressions" value={overview?.totalImpressions} sub={`Last ${period}`} />
        <MetricCard icon="❤️" label="Engagements" value={overview?.totalEngagements} sub={`${overview?.avgEngagementRate}% rate`} />
        <MetricCard icon="👥" label="Total Followers" value={overview?.totalFollowers} />
        <MetricCard icon="📝" label="Posts Published" value={overview?.publishedPosts} sub={`of ${overview?.totalPosts} total`} />
      </div>

      {growthInsights.length > 0 && hasRealAnalytics && (
        <div className="grid lg:grid-cols-2 gap-4">
          {growthInsights.map((insight) => <GrowthInsightCard key={insight.title} {...insight} />)}
        </div>
      )}

      {/* Chart */}
      {chart?.chartData && chart.chartData.length > 0 && hasRealAnalytics && (
        <div className="dashboard-chart-shell dashboard-surface dashboard-soft-float p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-white">Impressions & Engagements Over Time</h2>
              <p className="mt-1 text-xs text-slate-400">See where reach is compounding and which days convert attention into interaction.</p>
            </div>
            <ChartLegend />
          </div>
          <div className="mb-4">
            <ChartSummaryStrip chartData={chart.chartData} />
          </div>
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
              <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'rgba(129,140,248,0.45)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="engagements" stroke="#a855f7" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Platform breakdown */}
      {platforms && platforms.length > 0 && hasRealAnalytics && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="dashboard-surface dashboard-soft-float p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">Platform Breakdown</h2>
                <p className="mt-1 text-xs text-slate-400">Audience share across your connected publishing channels.</p>
              </div>
              <div className="dashboard-inline-stat px-3 py-2 text-xs text-slate-300">{platformShares.length} active platforms</div>
            </div>
            <div className="space-y-3">
              {platformShares.map((platform) => <PlatformShareRow key={platform.platform} platform={platform} />)}
            </div>
          </div>

          <div className="dashboard-surface dashboard-soft-float p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">🔥 Top Posts</h2>
                <p className="mt-1 text-xs text-slate-400">Posts currently driving the strongest attention and momentum.</p>
              </div>
              <div className="dashboard-inline-stat px-3 py-2 text-xs text-slate-300">Top {Math.min(5, topPosts?.length || 0)} ranked</div>
            </div>
            <div className="space-y-2">
              {topPosts?.slice(0, 5).map((post: any) => <TopPostRow key={post.id} post={post} />)}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {mainTab === 'overview' && !isLoading && !overviewError && !hasRealAnalytics && (
        <DemoAnalyticsState />
      )}
      </>
      )}
    </div>
  );
}
