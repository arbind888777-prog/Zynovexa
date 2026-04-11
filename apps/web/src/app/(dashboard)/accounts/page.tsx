'use client';
import { Suspense, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { accountsApi, integrationsApi, videoAnalyticsApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import { Platform, YoutubeInsights, AccountInsightsResponse } from '@/types';
import ConfirmDialog from '@/components/confirm-dialog';
import { useFocusTrap } from '@/lib/use-focus-trap';

// ── Platform config ────────────────────────────────────────────
type PlatformMeta = {
  icon: string;
  color: string;
  label: string;
  oauthSupported: boolean;
  comingSoon?: boolean;
};

const PLATFORM_META: Record<Platform, PlatformMeta> = {
  YOUTUBE:   { icon: '▶️',  color: '#ff0000', label: 'YouTube',    oauthSupported: true },
  INSTAGRAM: { icon: '📸',  color: '#e1306c', label: 'Instagram',  oauthSupported: true },
  TWITTER:   { icon: '𝕏',  color: '#1da1f2', label: 'X / Twitter', oauthSupported: false, comingSoon: true },
  LINKEDIN:  { icon: '💼',  color: '#0077b5', label: 'LinkedIn',   oauthSupported: false, comingSoon: true },
  FACEBOOK:  { icon: '👤',  color: '#1877f2', label: 'Facebook',   oauthSupported: true },
  SNAPCHAT:  { icon: '👻',  color: '#fffc00', label: 'Snapchat',   oauthSupported: false, comingSoon: true },
};

const ALL_PLATFORMS = Object.keys(PLATFORM_META) as Platform[];

// Error messages from OAuth callback redirect
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  youtube_denied:  'YouTube access was denied. Please try again and approve the permissions.',
  youtube_invalid: 'Invalid OAuth state. Please try connecting again.',
  youtube_no_channel: 'This Google account does not have a YouTube channel yet. Open YouTube once with this account, create a channel, then reconnect.',
  youtube_failed:  'YouTube connection failed. Check your Google account permissions and retry.',
  instagram_failed: 'Instagram direct OAuth is not enabled here. Use the configured token flow instead.',
  linkedin_failed: 'LinkedIn direct OAuth connect is not available yet.',
  twitter_failed:  'X / Twitter connection failed. Verify app settings and callback URL, then try again.',
  twitter_unavailable: 'X / Twitter direct connection is not available yet.',
  snapchat_failed: 'Snapchat direct OAuth connect is not available yet.',
};

type IntegrationPlatformCapability = {
  id: Platform;
  oauthSupported: boolean;
  connected: boolean;
  active: boolean;
  scopes: string[];
  connectAvailable?: boolean;
  connectMode?: 'oauth' | 'server-token' | 'unavailable';
  statusMessage?: string;
};

// ── Main Page ──────────────────────────────────────────────────
function AccountsPageContent() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [disconnectTarget, setDisconnectTarget] = useState<{
    id: string; platform: string; handle: string;
  } | null>(null);
  const [ytConnecting, setYtConnecting] = useState(false);
  const [oauthConnectingPlatform, setOauthConnectingPlatform] = useState<Platform | null>(null);
  const [activeTab, setActiveTab] = useState<'accounts' | 'queue'>('accounts');
  const [insightsExpanded, setInsightsExpanded] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<'overview' | 'content' | 'audience' | 'trends'>('overview');

  // ── Handle OAuth redirect result from URL params ──
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error     = searchParams.get('error');

    if (connected) {
      const platformKey = connected.toUpperCase() as Platform;
      const label = PLATFORM_META[platformKey]?.label || connected;
      toast.success(`✅ ${label} account connected successfully!`);
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      router.replace('/accounts'); // clean URL
    } else if (error && OAUTH_ERROR_MESSAGES[error]) {
      toast.error(OAUTH_ERROR_MESSAGES[error]);
      router.replace('/accounts');
    }
  }, []);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAll().then(r => r.data?.data ?? r.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['account-stats'],
    queryFn: () => accountsApi.getStats().then(r => r.data?.data ?? r.data),
  });

  const { data: platformCapabilities } = useQuery<IntegrationPlatformCapability[]>({
    queryKey: ['integration-platform-capabilities'],
    queryFn: () => integrationsApi.getPlatforms().then(r => r.data?.data ?? r.data ?? []),
  });

  const getPlatformCapability = (platform: Platform) =>
    platformCapabilities?.find((item) => item.id === platform);

  const youtubeAccount = (accounts ?? []).find((a: any) => a.platform === 'YOUTUBE');

  const { data: youtubeInsights, isLoading: ytInsightsLoading } = useQuery<YoutubeInsights>({
    queryKey: ['youtube-insights', youtubeAccount?.id],
    queryFn: () => accountsApi.getYoutubeInsights(youtubeAccount?.id).then(unwrapApiResponse),
    enabled: !!youtubeAccount,
    retry: false,
  });

  // Deep account insights (when user clicks a connected account)
  const { data: accountInsights, isLoading: insightsLoading } = useQuery<AccountInsightsResponse>({
    queryKey: ['account-insights', selectedAccountId],
    queryFn: () => accountsApi.getAccountInsights(selectedAccountId!).then(unwrapApiResponse),
    enabled: !!selectedAccountId,
    retry: false,
  });

  // Trending videos (loaded when trends tab is active)
  const { data: trendingVideos, isLoading: trendsLoading } = useQuery<any[]>({
    queryKey: ['trending-videos'],
    queryFn: () => videoAnalyticsApi.getTrendingVideos('IN', 20).then(r => r.data?.data ?? r.data ?? []),
    enabled: !!selectedAccountId && analyticsTab === 'trends',
    staleTime: 10 * 60 * 1000, // cache 10 min
    retry: false,
  });

  const liveYoutubeSubscribers = youtubeInsights?.channel.subscriberCount;
  const liveYoutubeVideoCount = youtubeInsights?.channel.videoCount;
  const liveYoutubeLikes = youtubeInsights?.totals.totalLikes;
  const liveYoutubeComments = youtubeInsights?.totals.totalComments;

  const totalFollowers = (stats?.platforms ?? []).reduce((sum: number, platformAccount: any) => {
    if (platformAccount.platform === 'YOUTUBE' && typeof liveYoutubeSubscribers === 'number') {
      return sum + liveYoutubeSubscribers;
    }
    return sum + (platformAccount.followers || 0);
  }, 0);

  const disconnect = useMutation({
    mutationFn: (id: string) => accountsApi.disconnect(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      toast.success('Account disconnected');
    },
    onError: () => toast.error('Failed to disconnect account'),
  });

  // ── YouTube OAuth: get URL from backend → redirect user to Google consent ──
  const handleConnectYoutube = async () => {
    setYtConnecting(true);
    try {
      const res = await accountsApi.getYoutubeConnectUrl(window.location.origin);
      const { url } = res.data?.data ?? res.data;
      if (!url) throw new Error('No OAuth URL returned');
      window.location.href = url; // full-page redirect to Google consent screen
    } catch {
      toast.error('Could not initiate YouTube connection. Please try again.');
      setYtConnecting(false);
    }
  };

  const handleConnectOAuthPlatform = async (platform: Platform) => {
    setOauthConnectingPlatform(platform);
    try {
      const res = await integrationsApi.getOAuthUrl(platform.toLowerCase(), window.location.origin);
      const { authUrl } = res.data?.data ?? res.data;
      if (!authUrl) throw new Error('No OAuth URL returned');
      window.location.href = authUrl;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(' ') : message || `Could not initiate ${PLATFORM_META[platform].label} connection. Please verify API keys and retry.`);
      setOauthConnectingPlatform(null);
    }
  };

  const handleConnectInstagram = async () => {
    setOauthConnectingPlatform('INSTAGRAM');
    try {
      const res = await accountsApi.connectInstagramWithConfiguredToken();
      const payload = res.data?.data ?? res.data;
      const username = payload?.profile?.username;
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      toast.success(username ? `Instagram connected: @${String(username).replace(/^@/, '')}` : 'Instagram account connected successfully!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Could not verify the configured Instagram token.';
      toast.error(Array.isArray(message) ? message.join(' ') : message);
    } finally {
      setOauthConnectingPlatform(null);
    }
  };

  const handleConnectFacebook = async () => {
    setOauthConnectingPlatform('FACEBOOK');
    try {
      const res = await accountsApi.connectFacebookWithConfiguredToken();
      const payload = res.data?.data ?? res.data;
      const pageName = payload?.page?.name;
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      toast.success(pageName ? `Facebook connected: ${pageName}` : 'Facebook page connected successfully!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Could not verify the configured Facebook token.';
      toast.error(Array.isArray(message) ? message.join(' ') : message);
    } finally {
      setOauthConnectingPlatform(null);
    }
  };

  // ── Reconnect handler ──
  const handleReconnect = (platform: Platform) => {
    const capability = getPlatformCapability(platform);

    if (platform === 'YOUTUBE') {
      handleConnectYoutube();
    } else if (platform === 'INSTAGRAM') {
      handleConnectInstagram();
    } else if (platform === 'FACEBOOK') {
      handleConnectFacebook();
    } else if (capability?.oauthSupported) {
      handleConnectOAuthPlatform(platform);
    } else {
      toast.info(capability?.statusMessage || `${PLATFORM_META[platform].label} reconnect coming soon.`);
    }
  };

  // ── Connect handler for un-connected platforms ──
  const handleConnect = (platform: Platform) => {
    const meta = PLATFORM_META[platform];
    const capability = getPlatformCapability(platform);
    const canConnect = platform === 'YOUTUBE'
      ? capability?.connectAvailable !== false
      : platform === 'INSTAGRAM' || platform === 'FACEBOOK'
        ? capability?.connectAvailable === true
        : !!capability?.oauthSupported;

    if (!canConnect) {
      toast.info(capability?.statusMessage || `${meta.label} connection is not enabled in this environment yet.`);
      return;
    }

    if (platform === 'YOUTUBE') {
      handleConnectYoutube();
    } else if (platform === 'INSTAGRAM') {
      handleConnectInstagram();
    } else if (platform === 'FACEBOOK') {
      handleConnectFacebook();
    } else if (capability?.oauthSupported) {
      handleConnectOAuthPlatform(platform);
    } else if (meta.comingSoon) {
      toast.info(`${meta.label} OAuth connect is coming soon! Stay tuned.`);
    } else {
      toast.info(capability?.statusMessage || `${meta.label} connection is not enabled in this environment yet.`);
    }
  };

  const { data: queueData } = useQuery({
    queryKey: ['integrations-queue'],
    queryFn: () => integrationsApi.getQueue().then(r => r.data?.data ?? r.data ?? []),
    enabled: activeTab === 'queue',
  });

  const reconnectCount = (stats?.platforms ?? []).filter((p: any) => p.reconnectRequired).length;

  return (
    <div className="dashboard-content-shell animate-fade-in">

      {/* Page header */}
      <div className="dashboard-headerband mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Channel Connections</p>
          <h1 className="mt-2 text-2xl font-bold text-white">🔗 Connected Accounts</h1>
          <p className="mt-2 text-sm text-slate-400">Schedule, analytics aur audience sync ke liye apne social channels ko ek jagah se manage karo.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--surface)' }}>
            <button onClick={() => setActiveTab('accounts')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === 'accounts' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>🔗 Accounts</button>
            <button onClick={() => setActiveTab('queue')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === 'queue' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>📤 Queue</button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <p className="font-semibold text-white">{stats?.connected ?? 0} live connections</p>
          </div>
        </div>
      </div>

      {activeTab === 'queue' ? (
        /* ── Publishing Queue Tab ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">📤 Publishing Queue</h2>
            <span className="text-xs text-slate-400">{(queueData as any[])?.length || 0} posts queued</span>
          </div>
          {(!queueData || (queueData as any[]).length === 0) ? (
            <div className="dashboard-surface p-8 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-400 text-sm">No posts in the publishing queue</p>
              <p className="text-xs text-slate-500 mt-1">Schedule posts from Create Post to see them here.</p>
            </div>
          ) : (
            (queueData as any[]).map((item: any) => (
              <div key={item.id} className="dashboard-surface p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {item.payload?.platform === 'INSTAGRAM' ? '📸' : item.payload?.platform === 'YOUTUBE' ? '▶️' : item.payload?.platform === 'LINKEDIN' ? '💼' : item.payload?.platform === 'TWITTER' ? '🐦' : '📄'}
                  </span>
                  <div>
                    <p className="text-sm text-white font-medium">{item.payload?.platform || 'Unknown'} — Post</p>
                    <p className="text-xs text-slate-400">Scheduled: {new Date(item.scheduledFor || item.scheduledAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : item.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
      <>
      {/* Reconnect required banner */}
      {reconnectCount > 0 && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl text-sm"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-300">
              {reconnectCount} account{reconnectCount > 1 ? 's' : ''} need{reconnectCount === 1 ? 's' : ''} reconnecting
            </p>
            <p className="text-slate-400 mt-0.5">Token expired or permissions revoked. Click "Reconnect" on the affected account card below.</p>
          </div>
        </div>
      )}

      {youtubeInsights && (
        <div className="mb-8">
          <div className="card p-4">
            {/* Collapsed summary — always visible */}
            <button
              type="button"
              onClick={() => setInsightsExpanded(v => !v)}
              className="w-full flex items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                {youtubeInsights.channel.thumbnail ? (
                  <img
                    src={youtubeInsights.channel.thumbnail}
                    alt={youtubeInsights.channel.title}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-red-500/10 shrink-0">▶️</div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">YouTube Insights — {youtubeInsights.channel.title}</p>
                  <p className="text-xs text-slate-400 truncate">{youtubeInsights.channel.handle || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300">
                  <span>{youtubeInsights.channel.subscriberCount.toLocaleString()} subs</span>
                  <span className="text-slate-600">•</span>
                  <span>{youtubeInsights.channel.videoCount.toLocaleString()} videos</span>
                  <span className="text-slate-600">•</span>
                  <span>{youtubeInsights.channel.viewCount.toLocaleString()} views</span>
                </div>
                <span className={`text-xs text-slate-400 transition-transform duration-200 ${insightsExpanded ? 'rotate-180' : ''}`}>▼</span>
              </div>
            </button>

            {/* Expanded details */}
            {insightsExpanded && (
              <div className="mt-4 space-y-5 border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="dashboard-inline-stat px-4 py-3">
                    <p className="text-xs text-slate-400">Subscribers</p>
                    <p className="text-lg font-bold text-white">{youtubeInsights.channel.subscriberCount.toLocaleString()}</p>
                  </div>
                  <div className="dashboard-inline-stat px-4 py-3">
                    <p className="text-xs text-slate-400">Videos</p>
                    <p className="text-lg font-bold text-white">{youtubeInsights.channel.videoCount.toLocaleString()}</p>
                  </div>
                  <div className="dashboard-inline-stat px-4 py-3">
                    <p className="text-xs text-slate-400">Channel Views</p>
                    <p className="text-lg font-bold text-white">{youtubeInsights.channel.viewCount.toLocaleString()}</p>
                  </div>
                  <div className="dashboard-inline-stat px-4 py-3">
                    <p className="text-xs text-slate-400">Recent Likes</p>
                    <p className="text-lg font-bold text-white">{youtubeInsights.totals.totalLikes.toLocaleString()}</p>
                  </div>
                  <div className="dashboard-inline-stat px-4 py-3">
                    <p className="text-xs text-slate-400">Recent Comments</p>
                    <p className="text-lg font-bold text-white">{youtubeInsights.totals.totalComments.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white">Latest YouTube Videos</h3>
                    <span className="text-xs text-slate-400">Views, likes, comments live from YouTube</span>
                  </div>
                  {youtubeInsights.recentVideos.length === 0 ? (
                    <p className="text-sm text-slate-400">No recent videos were found for this channel yet.</p>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-4">
                      {youtubeInsights.recentVideos.map((video) => (
                        <div key={video.videoId} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <div className="flex gap-3">
                            {video.thumbnail ? (
                              <img src={video.thumbnail} alt={video.title} className="w-28 h-16 rounded-lg object-cover" />
                            ) : (
                              <div className="w-28 h-16 rounded-lg bg-white/5 flex items-center justify-center">▶️</div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-white line-clamp-2">{video.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{new Date(video.publishedAt).toLocaleDateString()}</p>
                              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                                <div className="rounded-lg bg-black/10 px-2 py-1 text-slate-300">👁 {video.viewCount.toLocaleString()}</div>
                                <div className="rounded-lg bg-black/10 px-2 py-1 text-slate-300">👍 {video.likeCount.toLocaleString()}</div>
                                <div className="rounded-lg bg-black/10 px-2 py-1 text-slate-300">💬 {video.commentCount.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {youtubeAccount && ytInsightsLoading && (
        <div className="mb-8 card p-5 text-sm text-slate-400">Loading YouTube insights...</div>
      )}

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="dashboard-metric-card p-4">
            <p className="text-2xl font-bold text-white">{stats.connected}</p>
            <p className="text-xs text-slate-400 mt-0.5">Connected Accounts</p>
          </div>
          <div className="dashboard-metric-card p-4">
            <p className="text-2xl font-bold text-white">{totalFollowers.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">Total Followers</p>
          </div>
          <div className="dashboard-metric-card p-4">
            <p className="text-2xl font-bold text-white">{ALL_PLATFORMS.length - stats.connected}</p>
            <p className="text-xs text-slate-400 mt-0.5">Available to Connect</p>
          </div>
          <div className="dashboard-metric-card p-4">
            <p className={`text-2xl font-bold ${reconnectCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              {reconnectCount > 0 ? reconnectCount : '✓'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{reconnectCount > 0 ? 'Needs Reconnect' : 'All Healthy'}</p>
          </div>
        </div>
      )}

      {/* Platform cards — split into Connected & Available sections */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_PLATFORMS.map(p => (
            <div key={p} className="card p-5 animate-pulse">
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : (() => {
        const connectedPlatforms = ALL_PLATFORMS.filter(p => (accounts ?? []).some((a: any) => a.platform === p));
        const unconnectedPlatforms = ALL_PLATFORMS.filter(p => !(accounts ?? []).some((a: any) => a.platform === p));

        return (
          <div className="space-y-8">
            {/* ── Connected Accounts ── */}
            {connectedPlatforms.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-base font-semibold text-white">🟢 Connected Accounts</h2>
                  <span className="text-xs text-slate-500">({connectedPlatforms.length})</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedPlatforms.map(p => {
                    const meta = PLATFORM_META[p];
                    const account = (accounts ?? []).find((a: any) => a.platform === p);
                    const needsReconnect = account?.reconnectRequired;
                    const isYoutube = p === 'YOUTUBE';
                    const displayedFollowers = isYoutube && typeof liveYoutubeSubscribers === 'number'
                      ? liveYoutubeSubscribers
                      : (account?.followersCount || 0);

                    return (
                      <div key={p} className={`dashboard-surface p-5 flex flex-col transition-all duration-200 card-hover ${needsReconnect ? 'ring-1 ring-yellow-500/40' : ''}`}>
                        {/* Card header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                              style={{ background: `${meta.color}22` }}>
                              {meta.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{meta.label}</p>
                              <p className="text-xs text-slate-400 truncate max-w-[140px]">{account.handle || account.displayName}</p>
                            </div>
                          </div>
                          {needsReconnect ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-yellow-400 bg-yellow-400/10">⚠ Reconnect</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-green-400 bg-green-400/10">● Connected</span>
                          )}
                        </div>

                        {/* Account details */}
                        <div className="mb-4 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">{isYoutube ? 'Subscribers' : 'Followers'}</span>
                            <span className="text-white font-medium">{displayedFollowers.toLocaleString()}</span>
                          </div>
                          {isYoutube && typeof liveYoutubeVideoCount === 'number' && (
                            <>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Videos</span>
                                <span className="text-slate-400">{liveYoutubeVideoCount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Recent Likes</span>
                                <span className="text-slate-400">{(liveYoutubeLikes || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Recent Comments</span>
                                <span className="text-slate-400">{(liveYoutubeComments || 0).toLocaleString()}</span>
                              </div>
                            </>
                          )}
                          {account.tokenExpiresAt && (
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Token expires</span>
                              <span className={`font-medium ${new Date(account.tokenExpiresAt) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                                {new Date(account.tokenExpiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {account.scopes?.length > 0 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Permissions</span>
                              <span className="text-slate-400">{account.scopes.length} scopes granted</span>
                            </div>
                          )}
                        </div>

                        {/* Quick actions */}
                        <div className="mt-auto space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => { setSelectedAccountId(selectedAccountId === account.id ? null : account.id); setAnalyticsTab('overview'); }}
                              className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${selectedAccountId === account.id ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                              style={selectedAccountId === account.id ? {} : { border: '1px solid var(--border)' }}>
                              📊 Analytics
                            </button>
                            <button
                              onClick={() => router.push('/posts')}
                              className="py-1.5 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                              style={{ border: '1px solid var(--border)' }}>
                              📝 Posts
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {needsReconnect ? (
                              <button
                                onClick={() => handleReconnect(p)}
                                disabled={p === 'YOUTUBE' && ytConnecting}
                                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all text-yellow-400 hover:bg-yellow-400/10"
                                style={{ border: '1px solid rgba(251,191,36,0.3)' }}>
                                {p === 'YOUTUBE' && ytConnecting ? '...' : '🔄 Reconnect'}
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleReconnect(p)}
                                  disabled={p === 'YOUTUBE' && ytConnecting}
                                  className="flex-1 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                  style={{ border: '1px solid var(--border)' }}>
                                  🔄 Refresh
                                </button>
                                <button
                                  onClick={() => setDisconnectTarget({ id: account.id, platform: p, handle: account.handle })}
                                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all text-red-400 hover:bg-red-400/10"
                                  style={{ border: '1px solid var(--border)' }}>
                                  Disconnect
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Account Deep Analytics Panel ── */}
            {selectedAccountId && (
              <div className="mt-6 card p-5 animate-fade-in">
                {insightsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <span className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                      <p className="text-sm text-slate-400">Loading analytics...</p>
                    </div>
                  </div>
                ) : !accountInsights ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">Could not load analytics for this account.</p>
                  </div>
                ) : !accountInsights.analyticsAvailable ? (
                  <div className="text-center py-8">
                    <p className="text-2xl mb-2">📊</p>
                    <p className="text-slate-400 text-sm">{accountInsights.message || 'Deep analytics not available for this platform yet.'}</p>
                  </div>
                ) : (
                  <div>
                    {/* Panel header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                          style={{ background: `${PLATFORM_META[accountInsights.platform as Platform]?.color || '#6366f1'}22` }}>
                          {PLATFORM_META[accountInsights.platform as Platform]?.icon || '📊'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{accountInsights.account.displayName || accountInsights.account.handle}</p>
                          <p className="text-xs text-slate-400">{PLATFORM_META[accountInsights.platform as Platform]?.label} Analytics</p>
                        </div>
                      </div>
                      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--surface)' }}>
                        {(['overview', 'content', 'audience', 'trends'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setAnalyticsTab(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${analyticsTab === tab ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                            {tab === 'overview' ? '📈 Overview' : tab === 'content' ? '🎬 Content' : tab === 'audience' ? '👥 Audience' : '🔥 Trends'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Overview Tab ── */}
                    {analyticsTab === 'overview' && (
                      <div className="space-y-5">
                        {/* Key metrics */}
                        {accountInsights.overview.channel && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            <div className="dashboard-inline-stat px-3 py-3">
                              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Subscribers</p>
                              <p className="text-lg font-bold text-white">{accountInsights.overview.channel.subscriberCount.toLocaleString()}</p>
                            </div>
                            <div className="dashboard-inline-stat px-3 py-3">
                              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Videos</p>
                              <p className="text-lg font-bold text-white">{accountInsights.overview.channel.videoCount.toLocaleString()}</p>
                            </div>
                            <div className="dashboard-inline-stat px-3 py-3">
                              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Views</p>
                              <p className="text-lg font-bold text-white">{accountInsights.overview.channel.viewCount.toLocaleString()}</p>
                            </div>
                            {accountInsights.overview.analytics && (
                              <>
                                <div className="dashboard-inline-stat px-3 py-3">
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Watch Time</p>
                                  <p className="text-lg font-bold text-white">{Math.round(accountInsights.overview.analytics.estimatedMinutesWatched / 60).toLocaleString()}h</p>
                                </div>
                                <div className="dashboard-inline-stat px-3 py-3">
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Avg Duration</p>
                                  <p className="text-lg font-bold text-white">{Math.round(accountInsights.overview.analytics.averageViewDuration / 60)}m {accountInsights.overview.analytics.averageViewDuration % 60}s</p>
                                </div>
                                <div className="dashboard-inline-stat px-3 py-3">
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">New Subs</p>
                                  <p className="text-lg font-bold text-emerald-400">+{accountInsights.overview.analytics.subscribersGained.toLocaleString()}</p>
                                  {accountInsights.overview.analytics.subscribersLost > 0 && (
                                    <p className="text-[10px] text-red-400">-{accountInsights.overview.analytics.subscribersLost}</p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Engagement row */}
                        {accountInsights.overview.analytics && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                              <p className="text-xs text-slate-400">Likes (28d)</p>
                              <p className="text-base font-bold text-white">{accountInsights.overview.analytics.likes.toLocaleString()}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                              <p className="text-xs text-slate-400">Comments (28d)</p>
                              <p className="text-base font-bold text-white">{accountInsights.overview.analytics.comments.toLocaleString()}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                              <p className="text-xs text-slate-400">Shares (28d)</p>
                              <p className="text-base font-bold text-white">{accountInsights.overview.analytics.shares.toLocaleString()}</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                              <p className="text-xs text-slate-400">Dislikes (28d)</p>
                              <p className="text-base font-bold text-white">{accountInsights.overview.analytics.dislikes.toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        {/* Time series - simple table view */}
                        {accountInsights.overview.timeSeries.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">📅 Daily Performance (Last 28 Days)</h4>
                            <div className="overflow-x-auto rounded-xl border border-white/10">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left px-3 py-2 text-slate-400 font-medium">Date</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Views</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Watch (min)</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">+Subs</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Likes</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {accountInsights.overview.timeSeries.slice(-14).map((day, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                      <td className="px-3 py-2 text-slate-300">{new Date(day.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                                      <td className="px-3 py-2 text-right text-white">{day.views.toLocaleString()}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{day.estimatedMinutesWatched.toLocaleString()}</td>
                                      <td className="px-3 py-2 text-right text-emerald-400">+{day.subscribersGained}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{day.likes}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{day.comments}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Content Tab ── */}
                    {analyticsTab === 'content' && (
                      <div className="space-y-6">
                        {/* Top performing videos */}
                        {accountInsights.content.topVideos.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">🏆 Top Performing Videos</h4>
                            <div className="overflow-x-auto rounded-xl border border-white/10">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left px-3 py-2 text-slate-400 font-medium">Video</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Views</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Watch (h)</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Avg Duration</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Likes</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Comments</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Shares</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {accountInsights.content.topVideos.map((v, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                      <td className="px-3 py-2 text-white max-w-[200px]">
                                        <div className="flex items-center gap-2">
                                          {v.thumbnail && <img src={v.thumbnail} alt="" className="w-12 h-7 rounded object-cover shrink-0" />}
                                          <span className="truncate">{v.title || v.videoId}</span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-right text-white font-medium">{v.views.toLocaleString()}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{(v.estimatedMinutesWatched / 60).toFixed(1)}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{Math.floor(v.averageViewDuration / 60)}:{String(Math.round(v.averageViewDuration % 60)).padStart(2, '0')}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{v.likes.toLocaleString()}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{v.comments.toLocaleString()}</td>
                                      <td className="px-3 py-2 text-right text-slate-300">{v.shares.toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Recent videos grid */}
                        {accountInsights.content.recentVideos.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">🎬 Recent Videos</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {accountInsights.content.recentVideos.map(video => (
                                <div key={video.videoId} className="rounded-xl border border-white/10 bg-white/5 p-3">
                                  <div className="flex gap-3">
                                    {video.thumbnail ? (
                                      <img src={video.thumbnail} alt={video.title} className="w-24 h-14 rounded-lg object-cover shrink-0" />
                                    ) : (
                                      <div className="w-24 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0">▶️</div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-white line-clamp-2">{video.title}</p>
                                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date(video.publishedAt).toLocaleDateString()}</p>
                                      <div className="mt-1.5 flex gap-2 text-[10px] text-slate-400">
                                        <span>👁 {video.viewCount.toLocaleString()}</span>
                                        <span>👍 {video.likeCount.toLocaleString()}</span>
                                        <span>💬 {video.commentCount.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Traffic sources */}
                        {accountInsights.content.trafficSources.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">🔗 Traffic Sources</h4>
                            <div className="space-y-2">
                              {accountInsights.content.trafficSources.map((src, i) => {
                                const totalViews = accountInsights.content.trafficSources.reduce((s, x) => s + x.views, 0);
                                const pct = totalViews > 0 ? (src.views / totalViews) * 100 : 0;
                                return (
                                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-xs font-medium text-white">{src.source}</span>
                                      <span className="text-xs text-slate-400">{src.views.toLocaleString()} views • {Math.round(src.estimatedMinutesWatched)}m watched</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-white/10">
                                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {accountInsights.content.topVideos.length === 0 && accountInsights.content.recentVideos.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-2xl mb-2">🎬</p>
                            <p className="text-slate-400 text-sm">No content data available yet.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Audience Tab ── */}
                    {analyticsTab === 'audience' && (
                      <div className="space-y-6">
                        {/* Demographics: Age + Gender */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Age Groups */}
                          {accountInsights.audience.demographics.ageGroups.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                              <h4 className="text-sm font-semibold text-white mb-3">👤 Age Groups</h4>
                              <div className="space-y-2">
                                {accountInsights.audience.demographics.ageGroups.map((ag, i) => (
                                  <div key={i}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                      <span className="text-slate-300">{ag.ageGroup}</span>
                                      <span className="text-white font-medium">{ag.viewerPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-white/10">
                                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(ag.viewerPercentage, 100)}%` }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Gender Breakdown */}
                          {accountInsights.audience.demographics.genderBreakdown.length > 0 && (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                              <h4 className="text-sm font-semibold text-white mb-3">⚧ Gender</h4>
                              <div className="space-y-3">
                                {accountInsights.audience.demographics.genderBreakdown.map((g, i) => {
                                  const genderColors: Record<string, string> = { male: '#3b82f6', female: '#ec4899', user_specified: '#8b5cf6' };
                                  const color = genderColors[g.gender.toLowerCase()] || '#6366f1';
                                  return (
                                    <div key={i}>
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-300 capitalize">{g.gender.replace('_', ' ')}</span>
                                        <span className="text-white font-medium">{g.viewerPercentage.toFixed(1)}%</span>
                                      </div>
                                      <div className="w-full h-2 rounded-full bg-white/10">
                                        <div className="h-full rounded-full" style={{ width: `${Math.min(g.viewerPercentage, 100)}%`, background: color }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Devices */}
                        {accountInsights.audience.devices.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">📱 Devices</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {accountInsights.audience.devices.map((d, i) => {
                                const deviceIcons: Record<string, string> = { MOBILE: '📱', DESKTOP: '💻', TV: '📺', TABLET: '📋', GAME_CONSOLE: '🎮' };
                                return (
                                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                                    <p className="text-2xl mb-1">{deviceIcons[d.device.toUpperCase()] || '🖥️'}</p>
                                    <p className="text-xs font-medium text-white capitalize">{d.device.toLowerCase().replace('_', ' ')}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{d.views.toLocaleString()} views</p>
                                    <p className="text-[10px] text-slate-500">{Math.round(d.estimatedMinutesWatched)}m watched</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Countries */}
                        {accountInsights.audience.countries.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">🌍 Top Countries</h4>
                            <div className="overflow-x-auto rounded-xl border border-white/10">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left px-3 py-2 text-slate-400 font-medium">Country</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Views</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">Watch Time (min)</th>
                                    <th className="text-right px-3 py-2 text-slate-400 font-medium">% of Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {accountInsights.audience.countries.slice(0, 15).map((c, i) => {
                                    const totalCountryViews = accountInsights.audience.countries.reduce((s, x) => s + x.views, 0);
                                    const pct = totalCountryViews > 0 ? (c.views / totalCountryViews) * 100 : 0;
                                    return (
                                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-3 py-2 text-white font-medium">{c.country}</td>
                                        <td className="px-3 py-2 text-right text-slate-300">{c.views.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right text-slate-300">{c.estimatedMinutesWatched.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right">
                                          <span className="inline-flex items-center gap-1.5">
                                            <span className="text-slate-300">{pct.toFixed(1)}%</span>
                                            <span className="inline-block w-12 h-1.5 rounded-full bg-white/10">
                                              <span className="block h-full rounded-full bg-purple-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {accountInsights.audience.demographics.ageGroups.length === 0 &&
                         accountInsights.audience.devices.length === 0 &&
                         accountInsights.audience.countries.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-2xl mb-2">👥</p>
                            <p className="text-slate-400 text-sm">Audience data not available yet. YouTube provides this after your channel gets more views.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Trends Tab ── */}
                    {analyticsTab === 'trends' && (
                      <div className="space-y-6">
                        {/* What's Trending Now */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-sm font-semibold text-white">🔥 Trending on YouTube (India)</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">Most popular videos right now — find content ideas from what's trending</p>
                            </div>
                          </div>

                          {trendsLoading ? (
                            <div className="flex items-center justify-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <span className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                <p className="text-sm text-slate-400">Loading trends...</p>
                              </div>
                            </div>
                          ) : !trendingVideos || trendingVideos.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-2xl mb-2">🔥</p>
                              <p className="text-slate-400 text-sm">Trending data is currently unavailable.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Trending tags cloud */}
                              {(() => {
                                const allTags = trendingVideos.flatMap(v => v.tags || []);
                                const tagCounts = allTags.reduce<Record<string, number>>((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {});
                                const topTags = Object.entries(tagCounts).sort(([,a], [,b]) => b - a).slice(0, 20);
                                if (topTags.length === 0) return null;
                                return (
                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <h5 className="text-xs font-semibold text-white mb-3">🏷️ Trending Tags</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {topTags.map(([tag, count], i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">
                                          #{tag} <span className="text-purple-400/60 ml-0.5">×{count}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Top trending channels */}
                              {(() => {
                                const channelCounts = trendingVideos.reduce<Record<string, number>>((acc, v) => {
                                  if (v.channelTitle) acc[v.channelTitle] = (acc[v.channelTitle] || 0) + 1;
                                  return acc;
                                }, {});
                                const topChannels = Object.entries(channelCounts).sort(([,a], [,b]) => b - a).slice(0, 8);
                                if (topChannels.length === 0) return null;
                                return (
                                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <h5 className="text-xs font-semibold text-white mb-3">📺 Trending Channels</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                      {topChannels.map(([ch, count], i) => (
                                        <div key={i} className="rounded-lg bg-white/5 px-3 py-2 text-center">
                                          <p className="text-xs font-medium text-white truncate">{ch}</p>
                                          <p className="text-[10px] text-slate-500">{count} trending video{count > 1 ? 's' : ''}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Trending videos list */}
                              <div>
                                <h5 className="text-xs font-semibold text-white mb-3">📋 Top Trending Videos</h5>
                                <div className="space-y-2">
                                  {trendingVideos.slice(0, 15).map((video: any, i: number) => (
                                    <div key={video.videoId} className="rounded-xl border border-white/10 bg-white/5 p-3 flex gap-3 items-start hover:bg-white/[0.08] transition-all">
                                      <span className="text-xs font-bold text-slate-500 mt-1 w-5 text-right shrink-0">#{i + 1}</span>
                                      {video.thumbnail ? (
                                        <img src={video.thumbnail} alt={video.title} className="w-24 h-14 rounded-lg object-cover shrink-0" />
                                      ) : (
                                        <div className="w-24 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0">▶️</div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-white line-clamp-2">{video.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{video.channelTitle} • {new Date(video.publishedAt).toLocaleDateString()}</p>
                                        <div className="mt-1.5 flex gap-3 text-[10px] text-slate-400">
                                          <span>👁 {video.viewCount.toLocaleString()}</span>
                                          <span>👍 {video.likeCount.toLocaleString()}</span>
                                          <span>💬 {video.commentCount.toLocaleString()}</span>
                                        </div>
                                        {video.tags?.length > 0 && (
                                          <div className="mt-1.5 flex flex-wrap gap-1">
                                            {video.tags.slice(0, 5).map((tag: string, ti: number) => (
                                              <span key={ti} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-slate-500">#{tag}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Tips section */}
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                <h5 className="text-xs font-semibold text-emerald-400 mb-2">💡 How to Use Trends</h5>
                                <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                                  <li>• <strong className="text-slate-300">React/Response videos</strong> — Trending videos par apna reaction/commentary banao</li>
                                  <li>• <strong className="text-slate-300">Trending tags use karo</strong> — Apne niche se related trending tags apni videos mein add karo</li>
                                  <li>• <strong className="text-slate-300">Content gaps dhundho</strong> — Trending topics mein kya missing hai, woh banao</li>
                                  <li>• <strong className="text-slate-300">48 hour rule</strong> — Trend ko 48 ghante ke andar cover karo for maximum reach</li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Connect More Platforms ── */}
            {unconnectedPlatforms.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-base font-semibold text-white">➕ Connect More Platforms</h2>
                  <span className="text-xs text-slate-500">({unconnectedPlatforms.length} available)</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {unconnectedPlatforms.map(p => {
                    const meta = PLATFORM_META[p];
                    const capability = getPlatformCapability(p);
                    const canConnect = p === 'YOUTUBE'
                      ? capability?.connectAvailable !== false
                      : p === 'INSTAGRAM' || p === 'FACEBOOK'
                        ? capability?.connectAvailable === true
                        : !!capability?.oauthSupported;

                    return (
                      <div key={p} className="dashboard-surface p-4 flex items-center gap-3 transition-all duration-200">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                          style={{ background: `${meta.color}22` }}>
                          {meta.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">{meta.label}</p>
                          {capability?.statusMessage && (
                            <p className="text-[10px] text-slate-500 truncate">{capability.statusMessage}</p>
                          )}
                        </div>
                        {p === 'YOUTUBE' ? (
                          <button
                            onClick={() => handleConnect(p)}
                            disabled={ytConnecting}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shrink-0"
                            style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)' }}>
                            {ytConnecting ? '...' : 'Connect'}
                          </button>
                        ) : canConnect ? (
                          <button
                            onClick={() => handleConnect(p)}
                            disabled={oauthConnectingPlatform === p}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shrink-0"
                            style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
                            {oauthConnectingPlatform === p ? '...' : 'Connect'}
                          </button>
                        ) : (
                          <span className="text-[10px] px-2 py-1 rounded-full font-medium text-slate-500 bg-slate-500/10 shrink-0">
                            {meta.comingSoon ? 'Coming Soon' : 'Not Ready'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      </>
      )}

      {/* Disconnect confirm */}
      <ConfirmDialog
        open={!!disconnectTarget}
        title="Disconnect Account"
        message={disconnectTarget
          ? `Disconnect your ${PLATFORM_META[disconnectTarget.platform as Platform]?.label || disconnectTarget.platform} account${disconnectTarget.handle ? ` (${disconnectTarget.handle})` : ''}? Scheduled posts to this account will be paused.`
          : ''}
        confirmLabel="Disconnect"
        variant="danger"
        onConfirm={() => {
          if (disconnectTarget) disconnect.mutate(disconnectTarget.id);
          setDisconnectTarget(null);
        }}
        onCancel={() => setDisconnectTarget(null)}
      />
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="dashboard-content-shell animate-fade-in" />}>
      <AccountsPageContent />
    </Suspense>
  );
}
