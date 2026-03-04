'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postsApi, aiApi } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Platform, MediaType } from '@/types';

const PLATFORMS: Platform[] = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'TWITTER', 'LINKEDIN', 'FACEBOOK', 'SNAPCHAT'];
const PLATFORM_ICONS: Record<string, string> = { INSTAGRAM: '📸', YOUTUBE: '▶️', TIKTOK: '🎵', TWITTER: '𝕏', LINKEDIN: '💼', FACEBOOK: '👤', SNAPCHAT: '👻' };

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', caption: '', platforms: [] as Platform[], mediaType: 'IMAGE' as MediaType,
    hashtags: '', scheduledAt: '', status: 'DRAFT',
  });
  const [aiTab, setAiTab] = useState<'caption' | 'hashtags' | 'script' | 'image' | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const createPost = useMutation({
    mutationFn: (data: any) => postsApi.create(data),
    onSuccess: () => { toast.success('Post created!'); router.push('/posts'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create post'),
  });

  const togglePlatform = (p: Platform) => {
    setForm(prev => ({ ...prev, platforms: prev.platforms.includes(p) ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p] }));
  };

  const handleSubmit = (status: string) => {
    if (!form.caption) return toast.error('Caption is required');
    if (form.platforms.length === 0) return toast.error('Select at least one platform');
    createPost.mutate({ ...form, status, hashtags: form.hashtags.split(' ').filter(Boolean) });
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
      setAiResult(res?.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'AI request failed');
    } finally { setAiLoading(false); }
  };

  const applyCaption = (caption: string) => setForm(prev => ({ ...prev, caption }));
  const applyHashtags = (tags: string[]) => setForm(prev => ({ ...prev, hashtags: tags.join(' ') }));

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">✏️ Create New Post</h1>

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
                  <button key={p} onClick={() => togglePlatform(p)}
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
                <select value={form.mediaType} onChange={e => setForm(p => ({ ...p, mediaType: e.target.value as MediaType }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {['IMAGE', 'VIDEO', 'CAROUSEL', 'STORY', 'REEL'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Schedule</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleSubmit('DRAFT')} disabled={createPost.isPending}
              className="flex-1 py-3 rounded-lg text-sm font-semibold text-gray-300 card-hover card transition-all">
              Save Draft
            </button>
            {form.scheduledAt && (
              <button onClick={() => handleSubmit('SCHEDULED')} disabled={createPost.isPending}
                className="flex-1 py-3 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid #6366f1' }}>
                Schedule Post
              </button>
            )}
            <button onClick={() => handleSubmit('PUBLISHED')} disabled={createPost.isPending}
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
                        <a href={aiResult.imageUrl} download className="block mt-2 text-purple-400 text-xs text-center hover:text-purple-300">↓ Download Image</a>
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
