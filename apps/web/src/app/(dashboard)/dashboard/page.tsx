'use client';
import { useQuery } from '@tanstack/react-query';
import { usersApi, analyticsApi, aiApi, postsApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

function formatPlatformName(platform?: string) {
  if (!platform) return 'All platforms';
  return platform.charAt(0) + platform.slice(1).toLowerCase();
}

function formatRelativeSchedule(value?: string) {
  if (!value) return 'No schedule set';

  const scheduleDate = new Date(value);
  if (Number.isNaN(scheduleDate.getTime())) return 'Invalid schedule';

  const now = new Date();
  const diffMs = scheduleDate.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 1 && diffMs > 0) return 'Within the next hour';
  if (diffHours >= 1 && diffHours < 24) return `In ${diffHours}h`;

  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays >= 1 && diffDays < 7) return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;

  return scheduleDate.toLocaleString();
}

function getSuggestionCards({
  topPosts,
  bestTimeResult,
  scheduledCount,
  failedCount,
  connectedAccounts,
}: {
  topPosts?: any[];
  bestTimeResult?: any;
  scheduledCount: number;
  failedCount: number;
  connectedAccounts: number;
}) {
  const suggestions: Array<{ title: string; body: string; actionLabel?: string; actionHref?: string; tone: string }> = [];
  const topVideoPost = topPosts?.find((post) => post.mediaType === 'VIDEO');
  const topImagePost = topPosts?.find((post) => post.mediaType === 'IMAGE');
  const topTextPost = topPosts?.find((post) => post.mediaType === 'TEXT');
  const bestTime = bestTimeResult?.bestTimes?.[0];

  if (bestTime) {
    suggestions.push({
      title: 'Best time to post',
      body: `${bestTime.day}: ${bestTime.times?.join(', ')} gives the strongest reach for ${formatPlatformName(bestTimeResult?.platform || '')}.`,
      actionLabel: 'Schedule a post',
      actionHref: '/create',
      tone: 'purple',
    });
  }

  if (topVideoPost) {
    suggestions.push({
      title: 'Winning format',
      body: `Your strongest recent post is video-based. Reuse that format to compound reach faster.`,
      actionLabel: 'Create video post',
      actionHref: '/video',
      tone: 'blue',
    });
  } else if (topImagePost || topTextPost) {
    suggestions.push({
      title: 'Content idea',
      body: `Your current winners are ${topImagePost ? 'image posts' : 'text posts'}. Create 3 more similar posts this week for consistency.`,
      actionLabel: 'New quick post',
      actionHref: '/create',
      tone: 'pink',
    });
  }

  if (scheduledCount < 3) {
    suggestions.push({
      title: 'Queue health',
      body: `Only ${scheduledCount} upcoming post${scheduledCount === 1 ? '' : 's'} in the queue. Keep at least 3 scheduled to stay consistent.`,
      actionLabel: 'Open queue',
      actionHref: '/posts',
      tone: 'amber',
    });
  }

  if (failedCount > 0) {
    suggestions.push({
      title: 'Delivery risk',
      body: `${failedCount} post${failedCount > 1 ? 's have' : ' has'} failed recently. Fix them to recover reach and avoid missed publishing windows.`,
      actionLabel: 'Review failed posts',
      actionHref: '/posts',
      tone: 'red',
    });
  }

  if (connectedAccounts === 0) {
    suggestions.push({
      title: 'Activation blocker',
      body: 'No connected accounts found. Connect at least one channel to unlock scheduling, AI timing, and analytics.',
      actionLabel: 'Connect account',
      actionHref: '/accounts',
      tone: 'emerald',
    });
  }

  return suggestions.slice(0, 4);
}

function UpcomingPostCard({ post }: { post: any }) {
  const mediaBadge = getMediaBadge(post);

  return (
    <div className="dashboard-list-row p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{post.title || post.caption?.slice(0, 48) || 'Untitled post'}</p>
          <p className="mt-1 text-xs text-slate-400 truncate">{post.platforms?.join(', ') || 'No platform selected'}</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${mediaBadge.color}20`, color: mediaBadge.color }}>
          {mediaBadge.label}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <span className="text-amber-400">⏰ {formatRelativeSchedule(post.scheduledAt)}</span>
        <Link href={`/create?edit=${post.id}`} className="text-purple-400 hover:text-purple-300 font-medium">Edit →</Link>
      </div>
    </div>
  );
}

function AlertItem({ title, body, actionHref, actionLabel, tone }: { title: string; body: string; actionHref?: string; actionLabel?: string; tone: string }) {
  const tones: Record<string, string> = {
    red: 'rgba(239,68,68,0.12)',
    amber: 'rgba(245,158,11,0.12)',
    emerald: 'rgba(16,185,129,0.12)',
  };
  const colors: Record<string, string> = {
    red: '#f87171',
    amber: '#fbbf24',
    emerald: '#34d399',
  };

  return (
    <div className="rounded-2xl p-4" style={{ background: tones[tone] || 'var(--surface)', border: `1px solid ${colors[tone] || 'var(--border)'}` }}>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-300">{body}</p>
      {actionHref && actionLabel && <Link href={actionHref} className="mt-3 inline-block text-xs font-medium" style={{ color: colors[tone] || '#c084fc' }}>{actionLabel} →</Link>}
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: { title: string; body: string; actionLabel?: string; actionHref?: string; tone: string } }) {
  const toneMap: Record<string, { bg: string; border: string; accent: string }> = {
    purple: { bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.25)', accent: '#a78bfa' },
    blue: { bg: 'rgba(56,189,248,0.10)', border: 'rgba(56,189,248,0.25)', accent: '#38bdf8' },
    pink: { bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.25)', accent: '#f472b6' },
    amber: { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', accent: '#fbbf24' },
    red: { bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)', accent: '#f87171' },
    emerald: { bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)', accent: '#34d399' },
  };
  const tone = toneMap[suggestion.tone] || toneMap.purple;

  return (
    <div className="rounded-2xl p-4" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{suggestion.title}</p>
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: tone.accent }}>AI</span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{suggestion.body}</p>
      {suggestion.actionHref && suggestion.actionLabel && (
        <Link href={suggestion.actionHref} className="mt-3 inline-block text-xs font-medium" style={{ color: tone.accent }}>
          {suggestion.actionLabel} →
        </Link>
      )}
    </div>
  );
}

function getMediaBadge(post: any) {
  const count = post.mediaUrls?.length || 0;

  if (post.mediaType === 'TEXT' || count === 0) {
    return { label: 'TEXT', color: '#34d399' };
  }

  if (post.mediaType === 'VIDEO') {
    return { label: count > 1 ? `VIDEO x${count}` : 'VIDEO', color: '#38bdf8' };
  }

  if (post.mediaType === 'IMAGE') {
    return { label: count > 1 ? `IMAGE x${count}` : 'IMAGE', color: '#f472b6' };
  }

  return { label: post.mediaType || 'MEDIA', color: '#c084fc' };
}

function getPostHint(post: any) {
  const isYoutubeSelected = post.platforms?.includes('YOUTUBE');
  const isYoutubeVideoPost = isYoutubeSelected && ['VIDEO', 'REEL', 'SHORT'].includes(post.mediaType);

  if (isYoutubeSelected && !isYoutubeVideoPost) {
    return { text: 'YouTube text/image scheduled, manual publish required', color: '#fbbf24' };
  }

  if (isYoutubeVideoPost && (!post.mediaUrls || post.mediaUrls.length === 0)) {
    return { text: 'YouTube video missing', color: '#f87171' };
  }

  if (post.mediaType && post.mediaType !== 'TEXT' && (!post.mediaUrls || post.mediaUrls.length === 0)) {
    return { text: 'Media missing', color: '#fbbf24' };
  }

  return null;
}

function getPublishModeBadge(post: any) {
  if (!post?.publishResults || typeof post.publishResults !== 'object') {
    return null;
  }

  const youtubeResult = post.publishResults.YOUTUBE;
  if (youtubeResult?.success && youtubeResult.mode === 'youtube-live') {
    return { label: 'YT VIDEO', color: '#ef4444' };
  }

  if (youtubeResult?.manualRequired && youtubeResult.mode === 'youtube-manual') {
    return { label: 'YT MANUAL', color: '#f59e0b' };
  }

  return null;
}

function StatCard({ label, value, sub, icon, color }: any) {
  return (
    <div className="dashboard-metric-card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="dashboard-data-chip h-11 w-11 text-xl" style={{ background: `${color}22`, color }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value ?? '—'}</p>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => usersApi.getDashboardStats().then(unwrapApiResponse) });
  const { data: overview, isLoading: overviewLoading } = useQuery({ queryKey: ['analytics-overview'], queryFn: () => analyticsApi.getOverview().then(unwrapApiResponse) });
  const { data: topPosts, isLoading: postsLoading } = useQuery({ queryKey: ['top-posts'], queryFn: () => analyticsApi.getTopPosts(5).then(unwrapApiResponse) });
  const { data: aiUsage, isLoading: aiLoading } = useQuery({ queryKey: ['ai-usage'], queryFn: () => aiApi.getUsage().then(unwrapApiResponse) });
  const { data: scheduledPostsData, isLoading: scheduledLoading } = useQuery({
    queryKey: ['dashboard-scheduled-posts'],
    queryFn: () => postsApi.getAll({ status: 'SCHEDULED', page: 1, limit: 5 }).then(unwrapApiResponse),
  });
  const { data: failedPostsData, isLoading: failedLoading } = useQuery({
    queryKey: ['dashboard-failed-posts'],
    queryFn: () => postsApi.getAll({ status: 'FAILED', page: 1, limit: 3 }).then(unwrapApiResponse),
  });
  const { data: bestTimeResult } = useQuery({
    queryKey: ['dashboard-best-time'],
    queryFn: () => aiApi.getBestTimes({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' }).then(unwrapApiResponse),
    retry: false,
  });

  const isLoading = statsLoading || overviewLoading;
  const scheduledPosts = scheduledPostsData?.posts || [];
  const failedPosts = failedPostsData?.posts || [];
  const smartSuggestions = getSuggestionCards({
    topPosts,
    bestTimeResult,
    scheduledCount: scheduledPosts.length,
    failedCount: failedPosts.length,
    connectedAccounts: stats?.connectedAccounts || 0,
  });
  const alerts = [
    stats?.connectedAccounts === 0
      ? {
          title: 'Account not connected',
          body: 'Connect at least one platform to start publishing, scheduling, and collecting analytics.',
          actionHref: '/accounts',
          actionLabel: 'Connect now',
          tone: 'amber',
        }
      : null,
    ...failedPosts.slice(0, 2).map((post: any) => ({
      title: 'Post failed',
      body: `${post.title || post.caption?.slice(0, 44) || 'Untitled post'} needs attention before it can publish.`,
      actionHref: `/create?edit=${post.id}`,
      actionLabel: 'Fix now',
      tone: 'red',
    })),
    scheduledPosts.length === 0
      ? {
          title: 'Queue is empty',
          body: 'You have no scheduled posts lined up. Add upcoming content so publishing stays consistent.',
          actionHref: '/create',
          actionLabel: 'Create post',
          tone: 'emerald',
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; body: string; actionHref?: string; actionLabel?: string; tone: string }>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-content-shell space-y-8 animate-fade-in">
      {/* Header */}
      <div className="dashboard-headerband">
        <div>
          <h1 className="text-3xl font-bold text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-2 max-w-xl">Here's what's happening with your content today. Track momentum, fix blockers, and keep your queue healthy.</p>
        </div>
        <Link href="/create" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          + Create Post
        </Link>
      </div>

      {/* Error State */}
      {statsError && (
        <div className="card p-6 text-center">
          <p className="text-red-400 mb-2">⚠️ Failed to load dashboard data</p>
          <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="dashboard-skeleton-card p-6">
              <div className="shimmer dashboard-skeleton-line w-10 h-10 mb-4" />
              <div className="shimmer dashboard-skeleton-line h-8 w-20 mb-2" />
              <div className="shimmer dashboard-skeleton-line h-4 w-28" />
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📝" label="Total Posts" value={stats?.totalPosts} sub={`${stats?.scheduledPosts} scheduled`} color="#6366f1" />
        <StatCard icon="👁️" label="Impressions" value={overview?.totalImpressions?.toLocaleString()} sub="Last 30 days" color="#a855f7" />
        <StatCard icon="❤️" label="Engagements" value={overview?.totalEngagements?.toLocaleString()} sub={`${overview?.avgEngagementRate}% rate`} color="#ec4899" />
        <StatCard icon="👥" label="Total Followers" value={overview?.totalFollowers?.toLocaleString()} sub={`${stats?.connectedAccounts} platforms`} color="#10b981" />
      </div>
      )}

      {/* AI Usage + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Usage */}
        <div className="dashboard-surface dashboard-soft-float p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">🤖 AI Usage</h2>
            <span className="text-xs text-purple-400 font-medium">{user?.plan}</span>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">This month</span>
              <span className="text-white font-mono">{aiUsage?.used ?? 0} / {aiUsage?.limit ?? '∞'}</span>
            </div>
            {aiUsage?.limit && (
              <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (aiUsage.used / aiUsage.limit) * 100)}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              </div>
            )}
          </div>
          <Link href="/ai" className="text-xs text-purple-400 hover:text-purple-300">Open AI Studio →</Link>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-surface dashboard-soft-float p-6 lg:col-span-2">
          <h2 className="font-semibold text-white mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'new-post', href: '/create', icon: '✏️', label: 'New Post' },
              { id: 'create-video', href: '/video', icon: '🎬', label: 'Create Video' },
              { id: 'ai-caption', href: '/ai', icon: '🤖', label: 'AI Caption' },
              { id: 'ai-hashtags', href: '/ai', icon: '#️⃣', label: 'Generate Hashtags' },
              { id: 'analytics', href: '/analytics', icon: '📈', label: 'Analytics' },
              { id: 'connect-account', href: '/accounts', icon: '🔗', label: 'Connect Account' },
            ].map(a => (
              <Link key={a.id} href={a.href} className="dashboard-quick-link flex items-center gap-3 p-4 text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-[1.02]">
                <span className="text-xl">{a.icon}</span>{a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="dashboard-surface dashboard-soft-float p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">⏰ Upcoming Scheduled Posts</h2>
              <p className="text-xs text-slate-400 mt-1">Your next publishing queue with quick access to edit and reschedule.</p>
            </div>
            <Link href="/posts" className="text-xs text-purple-400 hover:text-purple-300">Open calendar →</Link>
          </div>
          {scheduledLoading ? (
            <div className="grid gap-3">
              {[...Array(3)].map((_, index) => <div key={index} className="dashboard-skeleton-card dashboard-skeleton-row h-24 shimmer" />)}
            </div>
          ) : scheduledPosts.length > 0 ? (
            <div className="grid gap-3">
              {scheduledPosts.map((post: any) => <UpcomingPostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="dashboard-surface-muted p-6 text-center">
              <p className="text-sm font-semibold text-white">No scheduled posts yet</p>
              <p className="mt-1 text-xs text-slate-400">Fill the queue to keep your publishing consistent and let AI timing work for you.</p>
              <Link href="/create" className="mt-4 inline-block text-xs font-medium text-purple-400 hover:text-purple-300">Schedule a post →</Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="dashboard-surface dashboard-soft-float p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-white">✨ Smart Suggestions</h2>
                <p className="text-xs text-slate-400 mt-1">AI-guided next actions to improve reach and consistency.</p>
              </div>
              <Link href="/ai" className="text-xs text-purple-400 hover:text-purple-300">Open AI Studio →</Link>
            </div>
            <div className="space-y-3">
              {smartSuggestions.map((suggestion) => <SuggestionCard key={suggestion.title} suggestion={suggestion} />)}
            </div>
          </div>

          <div className="dashboard-surface dashboard-soft-float p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-white">🚨 Alerts</h2>
                <p className="text-xs text-slate-400 mt-1">Issues that can block publishing, analytics, or growth.</p>
              </div>
              <Link href="/posts" className="text-xs text-purple-400 hover:text-purple-300">Review all →</Link>
            </div>
            {failedLoading ? (
              <div className="grid gap-3">
                {[...Array(2)].map((_, index) => <div key={index} className="dashboard-skeleton-card dashboard-skeleton-row h-24 shimmer" />)}
              </div>
            ) : alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => <AlertItem key={`${alert.title}-${alert.body}`} {...alert} />)}
              </div>
            ) : (
              <div className="rounded-2xl p-4 text-sm text-emerald-300" style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }}>
                All clear. Accounts connected, queue healthy, and no recent publishing failures.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      {topPosts && topPosts.length > 0 && (
        <div className="dashboard-surface dashboard-soft-float p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">🔥 Top Performing Posts</h2>
            <Link href="/posts" className="text-xs text-purple-400 hover:text-purple-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {topPosts.map((post: any) => (
              <div key={post.id} className="dashboard-list-row flex items-center justify-between p-3">
                <div className="flex-1 min-w-0">
                  {(() => {
                    const mediaBadge = getMediaBadge(post);
                    const postHint = getPostHint(post);
                    const publishModeBadge = getPublishModeBadge(post);

                    return (
                      <>
                  <p className="text-sm font-medium text-white truncate">{post.title || post.caption?.substring(0, 40) + '...'}</p>
                  <p className="text-xs text-gray-500">{post.platforms?.join(', ')}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${mediaBadge.color}20`, color: mediaBadge.color }}
                    >
                      {mediaBadge.label}
                    </span>
                    {publishModeBadge && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${publishModeBadge.color}20`, color: publishModeBadge.color }}
                      >
                        {publishModeBadge.label}
                      </span>
                    )}
                    {postHint && (
                      <span className="text-[10px]" style={{ color: postHint.color }}>
                        {postHint.text}
                      </span>
                    )}
                  </div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-xs font-bold text-purple-400">{post.viralScore}%</div>
                  <div className="w-16 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${post.viralScore}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
