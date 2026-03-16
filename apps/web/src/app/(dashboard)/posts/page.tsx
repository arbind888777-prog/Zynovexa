'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { PostStatus } from '@/types';

const STATUS_COLORS: Record<string, string> = { DRAFT: '#6b7280', SCHEDULED: '#f59e0b', PUBLISHED: '#10b981', FAILED: '#ef4444' };
const STATUS_ICONS: Record<string, string> = { DRAFT: '📝', SCHEDULED: '⏰', PUBLISHED: '✅', FAILED: '❌' };

function getMediaBadge(post: any) {
  const count = post.mediaUrls?.length || 0;
  if (post.mediaType === 'TEXT' || count === 0) {
    return { label: 'TEXT ONLY', color: '#34d399' };
  }

  if (post.mediaType === 'VIDEO') {
    return { label: count > 1 ? `VIDEO x${count}` : 'VIDEO', color: '#38bdf8' };
  }

  if (post.mediaType === 'IMAGE') {
    return { label: count > 1 ? `IMAGE x${count}` : 'IMAGE', color: '#f472b6' };
  }

  return { label: count > 1 ? `${post.mediaType} x${count}` : post.mediaType, color: '#c084fc' };
}

function getSchedulingHint(post: any) {
  const isYoutubeSelected = post.platforms?.includes('YOUTUBE');
  const isYoutubeVideoPost = isYoutubeSelected && ['VIDEO', 'REEL', 'SHORT'].includes(post.mediaType);

  if (isYoutubeSelected && !isYoutubeVideoPost) {
    return { tone: 'amber', text: 'YouTube text/image post schedule ho sakta hai, lekin publish manually karna padega.' };
  }

  if (isYoutubeVideoPost && (!post.mediaUrls || post.mediaUrls.length === 0)) {
    return { tone: 'red', text: 'YouTube ke liye uploaded video missing hai.' };
  }

  if (post.mediaType !== 'TEXT' && (!post.mediaUrls || post.mediaUrls.length === 0)) {
    return { tone: 'amber', text: `${post.mediaType} post ke liye media missing hai.` };
  }

  if (post.status === 'SCHEDULED') {
    return { tone: 'emerald', text: 'Scheduled post ready lag raha hai.' };
  }

  return null;
}

function getFirstPublishError(post: any) {
  if (!post?.publishResults || typeof post.publishResults !== 'object') {
    return null;
  }

  for (const result of Object.values(post.publishResults as Record<string, any>)) {
    if (result && !result.success && result.error) {
      return String(result.error);
    }
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

  const firstSuccessful = Object.values(post.publishResults as Record<string, any>).find((result) => result?.success);
  if (!firstSuccessful?.mode) {
    return null;
  }

  if (firstSuccessful.mode === 'simulated') {
    return { label: 'SIMULATED', color: '#8b5cf6' };
  }

  return null;
}

function isYoutubeManualRequired(post: any) {
  return Boolean(post?.publishResults?.YOUTUBE?.manualRequired && post?.publishResults?.YOUTUBE?.mode === 'youtube-manual');
}

function getSuggestedFix(post: any, publishError: string | null) {
  const message = `${publishError || ''} ${getSchedulingHint(post)?.text || ''}`.toLowerCase();

  if (message.includes('youtube') && message.includes('video')) {
    return {
      href: `/create?edit=${post.id}&suggest=video`,
      label: 'Add Video',
    };
  }

  if (!post.platforms?.includes('YOUTUBE') && (message.includes('media missing') || (post.mediaType !== 'TEXT' && (!post.mediaUrls || post.mediaUrls.length === 0)))) {
    return {
      href: `/create?edit=${post.id}&suggest=text`,
      label: 'Switch To Text',
    };
  }

  return {
    href: `/create?edit=${post.id}`,
    label: 'Fix Now',
  };
}

export default function PostsPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<PostStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', status, page],
    queryFn: () => postsApi.getAll({ status: status || undefined, page, limit: 12 }).then(unwrapApiResponse),
  });

  const deletePost = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['posts'] }); toast.success('Post deleted'); },
  });

  const publishPost = useMutation({
    mutationFn: (id: string) => postsApi.publish(id),
    onSuccess: (response) => {
      const post = unwrapApiResponse(response);
      qc.invalidateQueries({ queryKey: ['posts'] });

      if (isYoutubeManualRequired(post)) {
        toast.info(post.publishResults.YOUTUBE.error || 'YouTube text/image post ko manually publish karna padega.');
        return;
      }

      toast.success('Post published!');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Publish failed'),
  });

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">📋 My Posts</h1>
        <Link href="/create" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>+ Create</Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'] as const).map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${status === s ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            style={{ background: status === s ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)', border: '1px solid var(--border)' }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card h-40 animate-pulse" />)}
        </div>
      ) : data?.posts?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-400">No posts yet. <Link href="/create" className="text-purple-400 hover:text-purple-300">Create your first post →</Link></p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.posts?.map((post: any) => (
              <div key={post.id} className="card card-hover p-5">
                {(() => {
                  const publishError = getFirstPublishError(post);
                  const mediaBadge = getMediaBadge(post);
                  const schedulingHint = getSchedulingHint(post);
                  const suggestedFix = getSuggestedFix(post, publishError);
                  const publishModeBadge = getPublishModeBadge(post);
                  const manualYoutubePublish = isYoutubeManualRequired(post);
                  return (
                    <>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${STATUS_COLORS[post.status]}20`, color: STATUS_COLORS[post.status] }}>
                    {STATUS_ICONS[post.status]} {post.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-purple-400 font-bold">{post.viralScore}% 🔥</div>
                </div>
                {post.title && <p className="font-semibold text-white text-sm mb-1 truncate">{post.title}</p>}
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{post.caption}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${mediaBadge.color}20`, color: mediaBadge.color }}
                  >
                    {mediaBadge.label}
                  </span>
                  {publishModeBadge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${publishModeBadge.color}20`, color: publishModeBadge.color }}
                    >
                      {publishModeBadge.label}
                    </span>
                  )}
                  {post.platforms?.map((p: string) => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full text-gray-400" style={{ background: 'var(--surface)' }}>{p}</span>
                  ))}
                </div>
                {publishError && <p className="text-xs text-red-400 mb-3 line-clamp-2">{publishError}</p>}
                {schedulingHint && (
                  <p className={`text-xs mb-3 ${schedulingHint.tone === 'red' ? 'text-red-400' : schedulingHint.tone === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {schedulingHint.text}
                  </p>
                )}
                {post.scheduledAt && <p className="text-xs text-amber-400 mb-3">⏰ {new Date(post.scheduledAt).toLocaleString()}</p>}
                <div className="flex gap-2 mt-auto">
                  {(post.status === 'DRAFT' || post.status === 'FAILED') && !manualYoutubePublish && (
                    <button type="button" onClick={() => publishPost.mutate(post.id)} className="flex-1 py-1.5 rounded text-xs font-medium text-green-400 hover:bg-green-400/10 transition-all">{post.status === 'FAILED' ? 'Retry' : 'Publish'}</button>
                  )}
                  {(post.status === 'FAILED' || manualYoutubePublish) && (
                    <Link href={suggestedFix.href} className="flex-1 py-1.5 rounded text-center text-xs font-medium text-amber-400 hover:bg-amber-400/10 transition-all">
                      {manualYoutubePublish ? 'Open Draft' : suggestedFix.label}
                    </Link>
                  )}
                  <button type="button" onClick={() => { if (confirm('Delete this post?')) deletePost.mutate(post.id); }}
                    className="flex-1 py-1.5 rounded text-xs font-medium text-red-400 hover:bg-red-400/10 transition-all">Delete</button>
                </div>
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === p ? 'text-white' : 'text-gray-400'}`}
                  style={{ background: page === p ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)' }}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
