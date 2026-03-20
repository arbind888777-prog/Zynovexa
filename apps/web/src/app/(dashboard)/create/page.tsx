'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postsApi, aiApi, uploadsApi, accountsApi, unwrapApiResponse } from '@/lib/api';
import MediaUploader from '@/components/MediaUploader';
import TagsInput, { formatTagsAsInput, parseTagValue } from '@/components/TagsInput';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Platform, MediaType } from '@/types';

const PLATFORMS: Platform[] = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'SNAPCHAT'];
const MEDIA_TYPES: MediaType[] = ['TEXT', 'IMAGE', 'VIDEO'];
const VIDEO_STUDIO_TRANSFER_KEY = 'zynovexa.videoStudioDraft';
const AI_STUDIO_TRANSFER_KEY = 'zynovexa.aiStudioDraft';

const HASHTAG_LIMITS: Record<Platform, number> = {
  INSTAGRAM: 30,
  YOUTUBE: 15,
  TIKTOK: 10,
  TWITTER: 3,
  LINKEDIN: 10,
  FACEBOOK: 15,
  SNAPCHAT: 5,
};

const PLATFORM_META: Record<Platform, { label: string; color: string; gradient: string; path: string }> = {
  INSTAGRAM: {
    label: 'Instagram',
    color: '#E1306C',
    gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  YOUTUBE: {
    label: 'YouTube',
    color: '#FF0000',
    gradient: 'linear-gradient(45deg, #FF0000, #cc0000)',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  TIKTOK: {
    label: 'TikTok',
    color: '#00f2ea',
    gradient: 'linear-gradient(45deg, #00f2ea, #ff0050)',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  TWITTER: {
    label: 'X',
    color: '#888',
    gradient: 'linear-gradient(45deg, #1a1a2e, #555577)',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  LINKEDIN: {
    label: 'LinkedIn',
    color: '#0A66C2',
    gradient: 'linear-gradient(45deg, #0A66C2, #004182)',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  FACEBOOK: {
    label: 'Facebook',
    color: '#1877F2',
    gradient: 'linear-gradient(45deg, #1877F2, #0d5dc7)',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  SNAPCHAT: {
    label: 'Snapchat',
    color: '#FFFC00',
    gradient: 'linear-gradient(45deg, #FFFC00, #f5d800)',
    path: 'M12.166 0C6.852 0 4.703 3.494 4.703 6.708v2.19c0 .249-.17.27-.444.347-.717.166-1.2.289-1.2.844 0 .398.283.628.783.788.617.194 1.456.335 1.812.888.148.23.116.557-.107 1.08-.566 1.324-1.627 2.984-3.2 3.58-.362.137-.547.364-.547.693 0 .635.791.886 1.49 1.13.8.279 1.024.446 1.122.782.055.193.02.418.145.627.261.436.753.488 1.283.488.606 0 1.36-.176 2.48.437C8.072 21.563 9.813 24 12.166 24c2.335 0 4.07-2.423 5.626-3.408 1.14-.621 1.908-.437 2.508-.437.498 0 .974-.04 1.24-.488.125-.209.087-.434.143-.627.098-.336.321-.503 1.122-.782.698-.244 1.49-.495 1.49-1.13 0-.33-.186-.556-.548-.693-1.573-.596-2.634-2.256-3.2-3.58-.222-.523-.255-.85-.107-1.08.356-.553 1.2-.694 1.813-.888.5-.16.783-.39.783-.788 0-.555-.485-.678-1.201-.844-.273-.078-.444-.098-.444-.348v-2.19C21.391 3.487 19.268 0 12.166 0z',
  },
};

function PlatformIcon({ platform, size = 16 }: { platform: Platform; size?: number }) {
  const meta = PLATFORM_META[platform];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={meta.path} />
    </svg>
  );
}

function toDateTimeLocal(value?: string) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function inferMediaTypeFromUrl(url: string): MediaType | null {
  if (/\.(mp4|mov|avi|webm|mkv|m4v)(\?.*)?$/i.test(url)) return 'VIDEO';
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)) return 'IMAGE';
  return null;
}

function normalizeCreateMediaType(mediaType?: MediaType | null, mediaUrls: string[] = []): MediaType {
  if (mediaType === 'TEXT' || mediaType === 'IMAGE' || mediaType === 'VIDEO') return mediaType;

  const inferredMediaType = mediaUrls[0] ? inferMediaTypeFromUrl(mediaUrls[0]) : null;
  if (inferredMediaType) return inferredMediaType;
  if (mediaType === 'CAROUSEL') return 'IMAGE';
  return mediaType ? 'VIDEO' : 'TEXT';
}

function getStoredMediaType(nextMediaType: MediaType, inferredMediaType: MediaType) {
  if (nextMediaType === 'TEXT') return inferredMediaType;
  return nextMediaType;
}

function getUploadAccept(mediaType: MediaType) {
  if (mediaType === 'IMAGE') return 'image/*';
  if (mediaType === 'VIDEO') return 'video/*';
  return 'image/*,video/*';
}

function isVideoStyleType(mediaType: MediaType) {
  return mediaType === 'VIDEO';
}

function isYoutubeManualRequired(post: any) {
  return Boolean(post?.publishResults?.YOUTUBE?.manualRequired && post?.publishResults?.YOUTUBE?.mode === 'youtube-manual');
}

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPostId = searchParams.get('edit');
  const suggestedFix = searchParams.get('suggest');
  const source = searchParams.get('source');
  const isEditing = Boolean(editPostId);
  const [form, setForm] = useState({
    title: '', caption: '', platforms: [] as Platform[], mediaType: 'TEXT' as MediaType,
    hashtags: '', scheduledAt: '',
  });
  const [aiTab, setAiTab] = useState<'caption' | 'hashtags' | 'image' | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaLink, setMediaLink] = useState('');

  const { data: connectedAccounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAll().then(r => r.data?.data ?? r.data),
  });
  const connectedPlatforms = new Set<string>(
    (connectedAccounts ?? []).map((a: any) => a.platform),
  );

  const { data: editingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['edit-post', editPostId],
    queryFn: () => postsApi.getOne(editPostId as string).then(unwrapApiResponse),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing || (source !== 'studio' && source !== 'ai') || isLoadingAccounts) return;

    const storageKey = source === 'studio' ? VIDEO_STUDIO_TRANSFER_KEY : AI_STUDIO_TRANSFER_KEY;
    const rawDraft = window.sessionStorage.getItem(storageKey);
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft);
      const requestedPlatforms = Array.isArray(draft.platforms)
        ? draft.platforms.filter((platform: string): platform is Platform => PLATFORMS.includes(platform as Platform))
        : [];
      const nextPlatforms = requestedPlatforms.filter((platform: Platform) => connectedPlatforms.has(platform));
      const nextMediaUrl = typeof draft.videoUrl === 'string' ? draft.videoUrl.trim() : '';
      const importedMediaUrl = typeof draft.mediaUrl === 'string' ? draft.mediaUrl.trim() : nextMediaUrl;
      const nextHashtags = Array.isArray(draft.hashtags)
        ? draft.hashtags.join(' ')
        : typeof draft.hashtags === 'string'
          ? draft.hashtags
          : '';
      const nextMediaType = normalizeCreateMediaType(draft.mediaType, importedMediaUrl ? [importedMediaUrl] : []);

      setForm((prev) => ({
        ...prev,
        title: draft.title || prev.title,
        caption: draft.caption || prev.caption,
        hashtags: nextHashtags || prev.hashtags,
        scheduledAt: draft.scheduledAt || prev.scheduledAt,
        platforms: nextPlatforms.length > 0 ? nextPlatforms : prev.platforms,
        mediaType: importedMediaUrl ? nextMediaType : prev.mediaType,
      }));
      if (importedMediaUrl) {
        setMediaUrls([importedMediaUrl]);
      }

      if (requestedPlatforms.length > 0 && nextPlatforms.length !== requestedPlatforms.length) {
        toast.info('Kuch imported platforms connected nahi the, isliye unhe select nahi kiya gaya.');
      }

      toast.success(source === 'studio' ? 'Video Studio draft Create Post me attach ho gaya.' : 'AI Studio result Create Post me fill ho gaya.');
    } catch {
      toast.error(source === 'studio' ? 'Video Studio draft import nahi ho paya. Dobara try karo.' : 'AI Studio result import nahi ho paya. Dobara try karo.');
    } finally {
      window.sessionStorage.removeItem(storageKey);
      router.replace('/create');
    }
  }, [connectedPlatforms, isEditing, isLoadingAccounts, router, source]);

  useEffect(() => {
    if (!editingPost) return;

    const nextPlatforms = editingPost.platforms || [];
    const rawMediaUrls = suggestedFix === 'text' && !nextPlatforms.includes('YOUTUBE')
      ? []
      : editingPost.mediaUrls || [];
    const nextMediaType = suggestedFix === 'video'
      ? 'VIDEO'
      : suggestedFix === 'text' && !nextPlatforms.includes('YOUTUBE')
        ? 'TEXT'
        : normalizeCreateMediaType(editingPost.mediaType, rawMediaUrls);
    const nextMediaUrls = nextMediaType === 'TEXT' ? [] : rawMediaUrls.slice(0, 1);

    setForm({
      title: editingPost.title || '',
      caption: editingPost.caption || '',
      platforms: nextPlatforms,
      mediaType: nextMediaType,
      hashtags: editingPost.hashtags?.join(' ') || '',
      scheduledAt: toDateTimeLocal(editingPost.scheduledAt),
    });
    setMediaUrls(nextMediaUrls);

    if (suggestedFix === 'video') {
      toast.info('Is post ko fix karne ke liye video upload karo aur phir reschedule ya publish karo.');
    }

    if (suggestedFix === 'text' && !nextPlatforms.includes('YOUTUBE')) {
      toast.info('Is post ko text-only mode me open kiya gaya hai. Ab save ya reschedule kar sakte ho.');
    }
  }, [editingPost, suggestedFix]);

  const createPost = useMutation({
    mutationFn: async ({ publishNow, ...data }: any) => {
      const saved = isEditing
        ? await postsApi.update(editPostId as string, data).then(unwrapApiResponse)
        : await postsApi.create(data).then(unwrapApiResponse);
      if (publishNow) {
        return postsApi.publish(saved.id).then(unwrapApiResponse);
      }
      return saved;
    },
    onSuccess: (post, variables) => {
      if (variables.publishNow && isYoutubeManualRequired(post)) {
        toast.info(post.publishResults.YOUTUBE.error || 'YouTube text/image post ko manually publish karna padega.');
      } else {
        toast.success(
          variables.publishNow
            ? isEditing ? 'Post fixed and published!' : 'Post published!'
            : variables.scheduledAt
              ? isEditing ? 'Post fixed and rescheduled!' : 'Post scheduled!'
              : isEditing ? 'Post updated!' : 'Draft saved!',
        );
      }
      router.push('/posts');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || (isEditing ? 'Failed to update post' : 'Failed to create post')),
  });

  const togglePlatform = (p: Platform) => {
    setForm((prev) => {
      const nextPlatforms = prev.platforms.includes(p)
        ? prev.platforms.filter((platform) => platform !== p)
        : [...prev.platforms, p];

      return {
        ...prev,
        platforms: nextPlatforms,
        mediaType: prev.mediaType,
      };
    });
  };

  const handleSubmit = (mode: 'draft' | 'scheduled' | 'published') => {
    if (!form.caption) return toast.error('Caption is required');
    if (form.platforms.length === 0) return toast.error('Select at least one platform');

    const isYoutubeSelected = form.platforms.includes('YOUTUBE');
    const isPublishingNow = mode === 'published';

    if (form.mediaType !== 'TEXT' && mediaUrls.length === 0) {
      return toast.error('Upload an image or video, or switch Media Type to TEXT.');
    }

    if (isYoutubeSelected && isPublishingNow && isVideoStyleType(form.mediaType) && mediaUrls.length === 0) {
      return toast.error('YouTube video-style post ke liye video source required hai.');
    }

    if (isYoutubeSelected && isPublishingNow && !isVideoStyleType(form.mediaType)) {
      return toast.error('YouTube API se text/image post direct publish nahi hota. Isko draft ya schedule kar sakte ho, aur scheduled time par manual publish reminder milega.');
    }

    const allTags = parseTagValue(form.hashtags).map((tag) => `#${tag.replace(/\s+/g, '')}`);
    const strictestLimit = form.platforms.length > 0
      ? Math.min(...form.platforms.map(p => HASHTAG_LIMITS[p]))
      : allTags.length;
    const trimmedTags = allTags.slice(0, strictestLimit);

    const payload = {
      title: form.title || undefined,
      caption: form.caption,
      platforms: form.platforms,
      mediaType: form.mediaType,
      mediaUrls,
      hashtags: trimmedTags,
      scheduledAt: mode === 'scheduled' ? form.scheduledAt : undefined,
      ...(isEditing ? { clearSchedule: mode !== 'scheduled' } : {}),
      publishNow: mode === 'published',
    };

    createPost.mutate(payload);
  };

  const runAi = async () => {
    if (!aiInput) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      let res;
      if (aiTab === 'caption') res = await aiApi.generateCaption({ description: aiInput, platforms: form.platforms.map(p => p.toLowerCase()), includeHashtags: true, includeEmojis: true });
      else if (aiTab === 'hashtags') res = await aiApi.generateHashtags({ content: aiInput });
      else if (aiTab === 'image') res = await aiApi.generateImage({ prompt: aiInput });
      setAiResult(res ? unwrapApiResponse(res) : null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'AI request failed');
    } finally { setAiLoading(false); }
  };

  const applyCaption = (caption: string) => setForm(prev => ({ ...prev, caption }));
  const applyHashtags = (tags: string[]) => setForm(prev => ({ ...prev, hashtags: formatTagsAsInput(tags) }));

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedMediaType = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';

    if (form.mediaType === 'IMAGE' && uploadedMediaType !== 'IMAGE') {
      toast.error('Image media type selected hai. Image file upload karo ya media type change karo.');
      event.target.value = '';
      return;
    }

    if (form.mediaType === 'VIDEO' && uploadedMediaType !== 'VIDEO') {
      toast.error('Video-based media type selected hai. Video file upload karo ya media type change karo.');
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadsApi
        .uploadSingle(file, 'posts', form.title || form.caption.slice(0, 40))
        .then((response) => unwrapApiResponse<{ url: string }>(response));
      setMediaUrls([uploaded.url]);
      setForm((prev) => ({
        ...prev,
        mediaType: getStoredMediaType(prev.mediaType, uploadedMediaType),
      }));
      toast.success('Media uploaded successfully');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Media upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeMedia = (url: string) => {
    setMediaUrls((prev) => prev.filter((item) => item !== url));
  };

  const addMediaLink = () => {
    const trimmedLink = mediaLink.trim();
    if (!trimmedLink) {
      toast.error('Media link paste karo.');
      return;
    }

    try {
      new URL(trimmedLink);
    } catch {
      toast.error('Valid media URL dalo.');
      return;
    }

    const inferredMediaType = inferMediaTypeFromUrl(trimmedLink);
    if (form.mediaType === 'IMAGE' && inferredMediaType === 'VIDEO') {
      toast.error('Image media type selected hai. Video link ke liye media type change karo.');
      return;
    }

    if (form.mediaType === 'VIDEO' && inferredMediaType === 'IMAGE') {
      toast.error('Video-based media type selected hai. Image link ke liye media type change karo.');
      return;
    }

    setMediaUrls([trimmedLink]);
    setForm((prev) => ({
      ...prev,
      mediaType: inferredMediaType ? getStoredMediaType(prev.mediaType, inferredMediaType) : prev.mediaType,
    }));
    setMediaLink('');
    toast.success('Media link added.');
  };

  const isYoutubeSelected = form.platforms.includes('YOUTUBE');
  const mediaRequired = form.mediaType !== 'TEXT';
  const uploadAccept = getUploadAccept(form.mediaType);
  const hashtagTags = parseTagValue(form.hashtags);
  const overLimitPlatforms = form.platforms.filter((platform) => hashtagTags.length > HASHTAG_LIMITS[platform]);
  const strictestTagLimit = form.platforms.length > 0
    ? Math.min(...form.platforms.map((platform) => HASHTAG_LIMITS[platform]))
    : 30;

  if (isLoadingPost) {
    return <div className="dashboard-content-shell max-w-6xl mx-auto text-sm text-gray-400">Loading post...</div>;
  }

  return (
    <div className="dashboard-content-shell max-w-6xl mx-auto animate-fade-in">
      <div className="dashboard-headerband mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Publishing Workflow</p>
          <h1 className="mt-2 text-2xl font-bold text-white">{isEditing ? '🛠️ Fix Post' : '✏️ Create New Post'}</h1>
          <p className="mt-2 text-sm text-slate-400">Caption, media, tags aur platform selection ko ek fast composer me finalize karo.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <p className="font-semibold text-white">{form.platforms.length || 0} platform selected</p>
          <p className="mt-1 text-xs text-slate-400">Hashtag limits aur media validation yahin par auto-check ho rahe hain.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: Form */}
        <div className="space-y-5">
          <div className="dashboard-surface p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Title (optional)</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Internal title..." className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Caption *</label>
              <textarea value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} rows={5}
                placeholder="Write your caption or use AI to generate one..."
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-vertical overflow-y-auto"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', minHeight: '120px', maxHeight: '300px' }} />
              <p className="text-xs text-gray-500 mt-1">{form.caption.length} characters</p>
            </div>

            <div>
              <TagsInput
                label="Tags & Hashtags"
                tags={hashtagTags}
                onChange={(tags) => setForm((prev) => ({ ...prev, hashtags: formatTagsAsInput(tags) }))}
                placeholder="Add a tag and press Enter"
                helperText="Creators ke liye chips UI + quick copy buttons"
              />
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {hashtagTags.length} hashtag{hashtagTags.length !== 1 ? 's' : ''}
                    {form.platforms.length > 0 && (
                      <span className="text-slate-500"> — max allowed: {strictestTagLimit} (strictest platform)</span>
                    )}
                  </p>
                </div>
                {overLimitPlatforms.length > 0 && (
                  <div className="space-y-0.5">
                    {overLimitPlatforms.map((platform) => (
                      <p key={platform} className="text-xs text-amber-400">
                        ⚠️ {PLATFORM_META[platform].label} par max {HASHTAG_LIMITS[platform]} hashtags allowed hain — tumne {hashtagTags.length} daale. Extra hashtags {PLATFORM_META[platform].label} pe post mein nahi jayenge.
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Platforms *</label>
                {/* Select All / Deselect All toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const selectablePlatforms = PLATFORMS.filter(p => connectedPlatforms.has(p));
                    const allSelected = selectablePlatforms.length > 0 && selectablePlatforms.every(p => form.platforms.includes(p));
                    setForm(prev => ({
                      ...prev,
                      platforms: allSelected ? [] : selectablePlatforms,
                    }));
                  }}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {PLATFORMS.filter(p => connectedPlatforms.has(p)).length > 0 &&
                   PLATFORMS.filter(p => connectedPlatforms.has(p)).every(p => form.platforms.includes(p))
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => {
                  const meta = PLATFORM_META[p];
                  const isConnected = connectedPlatforms.has(p);
                  const isSelected = form.platforms.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      disabled={!isConnected}
                      onClick={() => isConnected && togglePlatform(p)}
                      title={isConnected ? meta.label : `${meta.label} — Connect first from Accounts page`}
                      className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        !isConnected
                          ? 'opacity-40 cursor-not-allowed text-gray-500'
                          : isSelected
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                      }`}
                      style={{
                        background: !isConnected
                          ? 'var(--surface)'
                          : isSelected
                            ? `linear-gradient(135deg, ${meta.color}33, ${meta.color}55)`
                            : 'var(--surface)',
                        border: `1px solid ${
                          !isConnected ? 'var(--border)' : isSelected ? meta.color : 'var(--border)'
                        }`,
                      }}
                    >
                      <span style={{ color: isSelected ? meta.color : undefined }}>
                        <PlatformIcon platform={p} size={14} />
                      </span>
                      {meta.label}
                      {!isConnected && (
                        <span className="ml-0.5 text-[10px] text-slate-500">🔒</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {PLATFORMS.filter(p => !connectedPlatforms.has(p)).length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  🔒 Locked platforms ko use karne ke liye pehle{' '}
                  <a href="/accounts" className="text-purple-400 hover:underline">Accounts</a> page se connect karo.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Schedule (Optional)</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Video banana hai? Video Studio use karo.</p>
                  <p className="text-xs text-slate-400 mt-1">Reels, Shorts, TikTok formats, duration guides aur future editing tools ke liye advanced workflow wahan hai.</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/video')}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  Open Video Studio
                </button>
              </div>
            </div>

            <MediaUploader
              mediaTypes={MEDIA_TYPES}
              selectedMediaType={form.mediaType}
              onSelectMediaType={(mediaType) => setForm((prev) => ({ ...prev, mediaType }))}
              mediaRequired={mediaRequired}
              mediaUrls={mediaUrls}
              mediaLink={mediaLink}
              onMediaLinkChange={setMediaLink}
              onAddMediaLink={addMediaLink}
              onRemoveMedia={removeMedia}
              onFileChange={handleMediaUpload}
              uploading={uploading}
              accept={uploadAccept}
              hint={(
                <>
                  {isYoutubeSelected && isVideoStyleType(form.mediaType) && (
                    <p className="mb-2 text-xs text-amber-400">YouTube video post ke liye valid video file ya link zaroori hai.</p>
                  )}
                  {isYoutubeSelected && !isVideoStyleType(form.mediaType) && (
                    <p className="mb-2 text-xs text-amber-400">YouTube pe text/image post API se auto-publish nahi hoti — scheduled time par manual reminder milega.</p>
                  )}
                </>
              )}
              intro="Quick posts ke liye yahan simple text, image aur video hi support hai."
              textModeEmptyState={<p className="text-xs text-emerald-400">Text-only post — media zaroorat nahi. Chaaho to upar se image ya video choose karke media add kar sakte ho.</p>}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleSubmit('draft')} disabled={createPost.isPending}
              type="button"
              className="flex-1 py-3 rounded-lg text-sm font-semibold text-gray-300 card-hover card transition-all">
              {isEditing ? 'Save Changes' : 'Save Draft'}
            </button>
            {form.scheduledAt && (
              <button onClick={() => handleSubmit('scheduled')} disabled={createPost.isPending}
                type="button"
                className="flex-1 py-3 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid #6366f1' }}>
                Schedule Post
              </button>
            )}
            <button onClick={() => handleSubmit('published')} disabled={createPost.isPending}
              type="button"
              className="flex-1 py-3 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {createPost.isPending ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="space-y-4">
          <div className="dashboard-surface p-6">
            <h2 className="font-semibold text-white mb-2">🎥 Advanced Video Flow</h2>
            <p className="text-sm text-slate-400">Video Studio me format choose karo, AI script banao, phir final video ko yahan quick scheduling ke liye bhejo.</p>
            <div className="mt-4 space-y-2 text-xs text-slate-400">
              <div className="dashboard-surface-muted px-3 py-2">1. Reel / Short / TikTok format choose karo</div>
              <div className="dashboard-surface-muted px-3 py-2">2. Script aur caption generate karo</div>
              <div className="dashboard-surface-muted px-3 py-2">3. Send to Create Post karke schedule karo</div>
            </div>
          </div>

          <div className="dashboard-surface p-6">
            <h2 className="font-semibold text-white mb-4">🤖 AI Studio</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['caption', 'hashtags', 'image'] as const).map(tab => (
                <button key={tab} onClick={() => setAiTab(tab === aiTab ? null : tab)}
                  className={`dashboard-tab capitalize ${aiTab === tab ? 'dashboard-tab-active text-white' : 'text-gray-400 hover:text-white'}`}>
                  {tab === 'caption' ? '✍️' : tab === 'hashtags' ? '#️⃣' : '🎨'} {tab}
                </button>
              ))}
            </div>

            {aiTab && (
              <div className="space-y-3">
                <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} rows={3}
                  placeholder={aiTab === 'caption' ? 'Describe your post...' : aiTab === 'hashtags' ? 'Describe your content...' : 'Image description...'}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
                <button onClick={runAi} disabled={aiLoading || !aiInput}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  {aiLoading ? '⏳ Generating...' : '✨ Generate'}
                </button>

                {aiResult && (
                  <div className="space-y-3 mt-2">
                    {aiTab === 'caption' && aiResult.captions?.map((c: string, i: number) => (
                      <div key={i} className="dashboard-surface-muted p-3 text-xs text-gray-300">
                        <p className="mb-2">{c}</p>
                        <button onClick={() => applyCaption(c)} className="text-purple-400 hover:text-purple-300 font-medium">← Use this</button>
                      </div>
                    ))}
                    {aiTab === 'hashtags' && aiResult.hashtags && (
                      <div className="dashboard-surface-muted p-3">
                        <p className="text-xs text-gray-300 mb-2">{aiResult.hashtags.join(' ')}</p>
                        <button onClick={() => applyHashtags(aiResult.hashtags)} className="text-purple-400 hover:text-purple-300 text-xs font-medium">← Apply hashtags</button>
                      </div>
                    )}
                    {aiTab === 'image' && aiResult.imageUrl && (
                      <div>
                        <img src={aiResult.imageUrl} alt="Generated" className="w-full rounded-lg" />
                        <button onClick={() => { fetch(aiResult.imageUrl).then(r => r.blob()).then(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'zynovexa-ai-image.png'; a.click(); URL.revokeObjectURL(a.href); }); }} className="block w-full mt-2 text-purple-400 text-xs text-center hover:text-purple-300">↓ Download Image</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!aiTab && (
              <p className="text-xs text-gray-500 text-center py-4">Select an AI tool above to generate content for your post.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
