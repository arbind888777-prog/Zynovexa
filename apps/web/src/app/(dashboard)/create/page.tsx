'use client';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postsApi, aiApi, uploadsApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Platform, MediaType } from '@/types';

const PLATFORMS: Platform[] = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'SNAPCHAT'];
const PLATFORM_ICONS: Record<string, string> = { INSTAGRAM: '📸', YOUTUBE: '▶️', TIKTOK: '🎵', TWITTER: '𝕏', LINKEDIN: '💼', FACEBOOK: '👤', SNAPCHAT: '👻' };
const MEDIA_TYPES: MediaType[] = ['TEXT', 'IMAGE', 'VIDEO', 'CAROUSEL', 'STORY', 'REEL', 'SHORT'];

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

function getStoredMediaType(nextMediaType: MediaType, inferredMediaType: MediaType) {
  if (nextMediaType === 'TEXT') return inferredMediaType;
  if (nextMediaType === 'REEL' || nextMediaType === 'SHORT') return nextMediaType;
  return nextMediaType;
}

function getUploadAccept(mediaType: MediaType) {
  if (mediaType === 'IMAGE') return 'image/*';
  if (mediaType === 'VIDEO' || mediaType === 'REEL' || mediaType === 'SHORT') return 'video/*';
  return 'image/*,video/*';
}

function isVideoStyleType(mediaType: MediaType) {
  return mediaType === 'VIDEO' || mediaType === 'REEL' || mediaType === 'SHORT';
}

function isYoutubeManualRequired(post: any) {
  return Boolean(post?.publishResults?.YOUTUBE?.manualRequired && post?.publishResults?.YOUTUBE?.mode === 'youtube-manual');
}

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPostId = searchParams.get('edit');
  const suggestedFix = searchParams.get('suggest');
  const isEditing = Boolean(editPostId);
  const [form, setForm] = useState({
    title: '', caption: '', platforms: [] as Platform[], mediaType: 'TEXT' as MediaType,
    hashtags: '', scheduledAt: '',
  });
  const [aiTab, setAiTab] = useState<'caption' | 'hashtags' | 'script' | 'image' | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaLink, setMediaLink] = useState('');

  const { data: editingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['edit-post', editPostId],
    queryFn: () => postsApi.getOne(editPostId as string).then(unwrapApiResponse),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!editingPost) return;

    const nextPlatforms = editingPost.platforms || [];
    const nextMediaType = suggestedFix === 'video'
      ? 'VIDEO'
      : suggestedFix === 'text' && !nextPlatforms.includes('YOUTUBE')
        ? 'TEXT'
        : editingPost.mediaType || 'TEXT';

    const nextMediaUrls = suggestedFix === 'text' && !nextPlatforms.includes('YOUTUBE')
      ? []
      : editingPost.mediaUrls || [];

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

    const payload = {
      title: form.title || undefined,
      caption: form.caption,
      platforms: form.platforms,
      mediaType: form.mediaType,
      mediaUrls,
      hashtags: form.hashtags.split(/\s+/).filter(Boolean),
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
      else if (aiTab === 'script') res = await aiApi.generateScript({ topic: aiInput, platform: form.platforms[0]?.toLowerCase() });
      else if (aiTab === 'image') res = await aiApi.generateImage({ prompt: aiInput });
      setAiResult(res ? unwrapApiResponse(res) : null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'AI request failed');
    } finally { setAiLoading(false); }
  };

  const applyCaption = (caption: string) => setForm(prev => ({ ...prev, caption }));
  const applyHashtags = (tags: string[]) => setForm(prev => ({ ...prev, hashtags: tags.join(' ') }));

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedMediaType = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';

    if (form.mediaType === 'IMAGE' && uploadedMediaType !== 'IMAGE') {
      toast.error('Image media type selected hai. Image file upload karo ya media type change karo.');
      event.target.value = '';
      return;
    }

    if ((form.mediaType === 'VIDEO' || form.mediaType === 'REEL' || form.mediaType === 'SHORT') && uploadedMediaType !== 'VIDEO') {
      toast.error('Video-based media type selected hai. Video file upload karo ya media type change karo.');
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadsApi
        .uploadSingle(file, 'posts', form.title || form.caption.slice(0, 40))
        .then((response) => unwrapApiResponse<{ url: string }>(response));
      setMediaUrls((prev) => (form.mediaType === 'CAROUSEL' ? [...prev, uploaded.url] : [uploaded.url]));
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

    if ((form.mediaType === 'VIDEO' || form.mediaType === 'REEL' || form.mediaType === 'SHORT') && inferredMediaType === 'IMAGE') {
      toast.error('Video-based media type selected hai. Image link ke liye media type change karo.');
      return;
    }

    setMediaUrls((prev) => (form.mediaType === 'CAROUSEL' ? [...prev, trimmedLink] : [trimmedLink]));
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

  if (isLoadingPost) {
    return <div className="p-8 max-w-6xl mx-auto text-sm text-gray-400">Loading post...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">{isEditing ? '🛠️ Fix Post' : '✏️ Create New Post'}</h1>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Title (optional)</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Internal title..." className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Caption *</label>
              <textarea value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} rows={5}
                placeholder="Write your caption or use AI to generate one..."
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
              <p className="text-xs text-gray-500 mt-1">{form.caption.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Hashtags</label>
              <input value={form.hashtags} onChange={e => setForm(p => ({ ...p, hashtags: e.target.value }))}
                placeholder="#creator #motivation #viral"
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platforms *</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button type="button" key={p} onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.platforms.includes(p) ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    style={{ background: form.platforms.includes(p) ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))' : 'var(--surface)', border: `1px solid ${form.platforms.includes(p) ? '#6366f1' : 'var(--border)'}` }}>
                    {PLATFORM_ICONS[p]} {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Media Type</label>
                <select value={form.mediaType} onChange={e => setForm((p) => ({ ...p, mediaType: e.target.value as MediaType }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {MEDIA_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {isYoutubeSelected && isVideoStyleType(form.mediaType) && (
                  <p className="mt-2 text-xs text-amber-400">YouTube video-style post ke liye valid video upload ya link chahiye.</p>
                )}
                {isYoutubeSelected && !isVideoStyleType(form.mediaType) && (
                  <p className="mt-2 text-xs text-amber-400">Text/image YouTube post ko yahan save aur schedule kar sakte ho. Lekin YouTube API direct auto-publish nahi karti, isliye scheduled time par manual publish reminder milega.</p>
                )}
                {!isYoutubeSelected && form.mediaType === 'TEXT' && (
                  <p className="mt-2 text-xs text-emerald-400">Text-only post allowed hai. Image ya video optional hai.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Schedule</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Media Upload</label>
              <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-white">{isYoutubeSelected && isVideoStyleType(form.mediaType) ? 'Upload ya paste video source for this post' : 'Upload ya paste image/video source for this post'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {mediaRequired
                        ? 'Selected media type ko match karta hua upload ya link add karein.'
                        : 'Bina media ke text-only post bhi save ya schedule kar sakte ho.'}
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    {uploading ? 'Uploading...' : 'Upload Media'}
                    <input type="file" className="hidden" accept={uploadAccept} onChange={handleMediaUpload} disabled={uploading} />
                  </label>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={mediaLink}
                    onChange={(e) => setMediaLink(e.target.value)}
                    placeholder="Paste image/video link, for example https://.../video.mp4"
                    className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  />
                  <button
                    type="button"
                    onClick={addMediaLink}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid #6366f1' }}
                  >
                    Add Link
                  </button>
                </div>

                {mediaRequired && mediaUrls.length === 0 && (
                  <p className="mt-3 text-xs text-amber-400">Is post ke liye media required hai kyunki current media type {form.mediaType} hai.</p>
                )}

                {mediaUrls.length > 0 && (
                  <div className="mt-4 grid gap-2">
                    {mediaUrls.map((url) => (
                      <div key={url} className="flex items-center justify-between rounded-lg bg-black/10 px-3 py-2 text-xs text-slate-300">
                        <span className="truncate pr-3">{url}</span>
                        <button type="button" onClick={() => removeMedia(url)} className="text-red-400 hover:text-red-300">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4">🤖 AI Studio</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['caption', 'hashtags', 'script', 'image'] as const).map(tab => (
                <button key={tab} onClick={() => setAiTab(tab === aiTab ? null : tab)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all capitalize ${aiTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  style={{ background: aiTab === tab ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))' : 'var(--surface)', border: `1px solid ${aiTab === tab ? '#6366f1' : 'var(--border)'}` }}>
                  {tab === 'caption' ? '✍️' : tab === 'hashtags' ? '#️⃣' : tab === 'script' ? '🎬' : '🎨'} {tab}
                </button>
              ))}
            </div>

            {aiTab && (
              <div className="space-y-3">
                <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} rows={3}
                  placeholder={aiTab === 'caption' ? 'Describe your post...' : aiTab === 'hashtags' ? 'Describe your content...' : aiTab === 'script' ? 'Video topic...' : 'Image description...'}
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
                      <div key={i} className="p-3 rounded-lg text-xs text-gray-300" style={{ background: 'var(--surface)' }}>
                        <p className="mb-2">{c}</p>
                        <button onClick={() => applyCaption(c)} className="text-purple-400 hover:text-purple-300 font-medium">← Use this</button>
                      </div>
                    ))}
                    {aiTab === 'hashtags' && aiResult.hashtags && (
                      <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                        <p className="text-xs text-gray-300 mb-2">{aiResult.hashtags.join(' ')}</p>
                        <button onClick={() => applyHashtags(aiResult.hashtags)} className="text-purple-400 hover:text-purple-300 text-xs font-medium">← Apply hashtags</button>
                      </div>
                    )}
                    {aiTab === 'script' && (
                      <div className="p-3 rounded-lg text-xs text-gray-300 space-y-2" style={{ background: 'var(--surface)' }}>
                        {aiResult.hook && <p><span className="text-purple-400">Hook:</span> {aiResult.hook}</p>}
                        {aiResult.sections?.map((s: any, i: number) => <p key={i}><span className="text-purple-400">{s.title}:</span> {s.script}</p>)}
                        {aiResult.cta && <p><span className="text-purple-400">CTA:</span> {aiResult.cta}</p>}
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
