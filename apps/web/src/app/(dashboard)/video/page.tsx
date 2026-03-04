'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postsApi, aiApi } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const VIDEO_TYPES = [
  { id: 'REEL', label: 'Instagram Reel', icon: '📱', duration: '15–90 sec', platform: 'INSTAGRAM', color: '#E1306C' },
  { id: 'SHORT', label: 'YouTube Short', icon: '▶️', duration: '< 60 sec', platform: 'YOUTUBE', color: '#FF0000' },
  { id: 'TIKTOK', label: 'TikTok Video', icon: '🎵', duration: '15 sec – 3 min', platform: 'TIKTOK', color: '#010101' },
  { id: 'STORY', label: 'Story', icon: '⭕', duration: '15 sec', platform: 'INSTAGRAM', color: '#8A3AB9' },
  { id: 'VIDEO', label: 'YouTube Video', icon: '🎬', duration: 'Any length', platform: 'YOUTUBE', color: '#FF0000' },
  { id: 'LINKEDIN_VIDEO', label: 'LinkedIn Video', icon: '💼', duration: '3 sec – 10 min', platform: 'LINKEDIN', color: '#0A66C2' },
];

const SCRIPT_STYLES = ['Energetic & Hype', 'Educational & Calm', 'Funny & Entertaining', 'Inspirational', 'Tutorial Step-by-step', 'Storytelling'];

export default function VideoStudioPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState<'type' | 'details' | 'script' | 'publish'>('type');

  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    hashtags: '',
    scheduledAt: '',
    platforms: [] as string[],
    mediaType: 'VIDEO',
  });

  const [scriptInputs, setScriptInputs] = useState({
    topic: '',
    style: 'Energetic & Hype',
    duration: '60',
    targetAudience: '',
    keyPoints: '',
  });

  const [script, setScript] = useState<any>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagLoading, setHashtagLoading] = useState(false);

  const createPost = useMutation({
    mutationFn: (data: any) => postsApi.create(data),
    onSuccess: () => { toast.success('Video post created! 🎬'); router.push('/posts'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create video post'),
  });

  const selectVideoType = (type: typeof VIDEO_TYPES[0]) => {
    setSelectedType(type.id);
    setForm(prev => ({
      ...prev,
      mediaType: type.id === 'STORY' ? 'STORY' : type.id === 'REEL' ? 'REEL' : type.id === 'SHORT' ? 'SHORT' : 'VIDEO',
      platforms: [type.platform],
    }));
    setStep('details');
  };

  const handleGenerateScript = async () => {
    if (!scriptInputs.topic) return toast.error('Video topic likho');
    setScriptLoading(true);
    setScript(null);
    try {
      const platform = VIDEO_TYPES.find(t => t.id === selectedType)?.platform?.toLowerCase() || 'youtube';
      const res = await aiApi.generateScript({
        topic: scriptInputs.topic,
        platform,
        durationSeconds: parseInt(scriptInputs.duration),
        style: scriptInputs.style,
        targetAudience: scriptInputs.targetAudience,
        keyPoints: scriptInputs.keyPoints ? scriptInputs.keyPoints.split('\n').filter(Boolean) : [],
      });
      setScript(res?.data);
      toast.success('Script ready! ✍️');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Script generation failed');
    } finally {
      setScriptLoading(false);
    }
  };

  const handleGenerateCaptions = async () => {
    if (!scriptInputs.topic && !form.description) return toast.error('Topic ya description likho pehle');
    setCaptionLoading(true);
    try {
      const platform = VIDEO_TYPES.find(t => t.id === selectedType)?.platform?.toLowerCase() || 'instagram';
      const res = await aiApi.generateCaption({
        description: scriptInputs.topic || form.description,
        platforms: [platform],
        includeHashtags: false,
        includeEmojis: true,
      });
      setCaptions(res?.data?.captions || []);
      toast.success('Captions generated!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Caption generation failed');
    } finally {
      setCaptionLoading(false);
    }
  };

  const handleGenerateHashtags = async () => {
    if (!scriptInputs.topic && !form.description) return toast.error('Topic likho pehle');
    setHashtagLoading(true);
    try {
      const res = await aiApi.generateHashtags({ content: scriptInputs.topic || form.description });
      setHashtags(res?.data?.hashtags || []);
      toast.success('Hashtags generated!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Hashtag generation failed');
    } finally {
      setHashtagLoading(false);
    }
  };

  const handlePublish = (status: string) => {
    if (!form.description && !form.title) return toast.error('Description ya title required hai');
    createPost.mutate({
      title: form.title || scriptInputs.topic,
      caption: form.description,
      platforms: form.platforms,
      mediaType: form.mediaType,
      hashtags: hashtags.length ? hashtags : form.hashtags.split(' ').filter(Boolean),
      scheduledAt: form.scheduledAt || null,
      status,
      aiGenerated: script !== null,
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">🎬 Video Studio</h1>
          <p className="text-gray-400 mt-1">Reels, Shorts, TikTok, YouTube — sab ek jagah</p>
        </div>
        <div className="flex items-center gap-2">
          {['type', 'details', 'script', 'publish'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => step !== 'type' && setStep(s as any)}
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step === s ? 'text-white' :
                  ['type','details','script','publish'].indexOf(step) > i ? 'text-white opacity-70' : 'text-gray-500'
                }`}
                style={{ background: step === s ? 'linear-gradient(135deg, #6366f1, #a855f7)' :
                  ['type','details','script','publish'].indexOf(step) > i ? 'rgba(99,102,241,0.3)' : 'var(--surface)',
                  border: '1px solid var(--border)' }}>
                {i + 1}
              </button>
              {i < 3 && <div className="w-6 h-0.5" style={{ background: ['type','details','script','publish'].indexOf(step) > i ? '#6366f1' : 'var(--border)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Video Type Selection */}
      {step === 'type' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Video type chuno 📱</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {VIDEO_TYPES.map(type => (
              <button key={type.id} onClick={() => selectVideoType(type)}
                className="card p-6 text-left hover:scale-105 transition-all duration-200 card-hover">
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="text-white font-semibold text-lg">{type.label}</h3>
                <p className="text-gray-400 text-sm mt-1">{type.duration}</p>
                <div className="mt-3 text-xs font-medium px-2 py-1 rounded inline-block" style={{ background: `${type.color}20`, color: type.color, border: `1px solid ${type.color}40` }}>
                  {type.platform}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Video Details */}
      {step === 'details' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{VIDEO_TYPES.find(t => t.id === selectedType)?.icon}</span>
                <div>
                  <h2 className="text-white font-semibold">{VIDEO_TYPES.find(t => t.id === selectedType)?.label}</h2>
                  <p className="text-gray-400 text-xs">{VIDEO_TYPES.find(t => t.id === selectedType)?.duration}</p>
                </div>
                <button onClick={() => setStep('type')} className="ml-auto text-gray-400 hover:text-white text-sm">← Change</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Video Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Video title..." className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description / Caption</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                  placeholder="Video ke baare mein describe karo..."
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">🔗 Video URL (optional)</label>
                <input value={form.videoUrl} onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..." className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">🖼️ Thumbnail URL (optional)</label>
                <input value={form.thumbnailUrl} onChange={e => setForm(p => ({ ...p, thumbnailUrl: e.target.value }))}
                  placeholder="https://..." className="input-field" />
                {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="Thumbnail" className="mt-2 rounded-lg w-full object-cover max-h-40" onError={e => (e.currentTarget.style.display='none')} />}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">🏷️ Hashtags</label>
                <input value={form.hashtags} onChange={e => setForm(p => ({ ...p, hashtags: e.target.value }))}
                  placeholder="#viral #reels #shorts" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">📅 Schedule (optional)</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
              </div>
            </div>

            <button onClick={() => setStep('script')}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              Next: AI Script Generator →
            </button>
          </div>

          {/* Quick AI panel */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-4">⚡ Quick AI Tools</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Video topic (for AI generation)</label>
                  <input value={scriptInputs.topic} onChange={e => setScriptInputs(p => ({ ...p, topic: e.target.value }))}
                    placeholder="e.g. 5 gym tips for beginners" className="input-field mb-2" />
                </div>

                <button onClick={handleGenerateCaptions} disabled={captionLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid #6366f1' }}>
                  {captionLoading ? '⏳ Generating...' : '✍️ Generate Caption'}
                </button>

                {captions.length > 0 && (
                  <div className="space-y-2">
                    {captions.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <p className="text-xs text-gray-300">{c}</p>
                        <button onClick={() => setForm(p => ({ ...p, description: c }))} className="text-purple-400 text-xs mt-1 hover:text-purple-300">← Use this</button>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={handleGenerateHashtags} disabled={hashtagLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)' }}>
                  {hashtagLoading ? '⏳ Generating...' : '#️⃣ Generate Hashtags'}
                </button>

                {hashtags.length > 0 && (
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {hashtags.slice(0, 15).map((h, i) => (
                        <span key={i} className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                    <button onClick={() => setForm(p => ({ ...p, hashtags: hashtags.join(' ') }))} className="text-purple-400 text-xs hover:text-purple-300">← Apply all</button>
                  </div>
                )}
              </div>
            </div>

            {/* Video Tips */}
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-3">💡 Tips for {VIDEO_TYPES.find(t => t.id === selectedType)?.label}</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                {selectedType === 'REEL' && <>
                  <li>✅ Hook should be in first 3 seconds</li>
                  <li>✅ Use trending audio</li>
                  <li>✅ 9:16 aspect ratio (1080x1920)</li>
                  <li>✅ Best time: 9am, 12pm, 7pm</li>
                </>}
                {selectedType === 'SHORT' && <>
                  <li>✅ Keep under 60 seconds</li>
                  <li>✅ Vertical format only</li>
                  <li>✅ Add chapters in description</li>
                  <li>✅ Strong thumbnail matters</li>
                </>}
                {selectedType === 'TIKTOK' && <>
                  <li>✅ Hook in first 1-2 seconds</li>
                  <li>✅ Use trending sounds/effects</li>
                  <li>✅ Text overlay works great</li>
                  <li>✅ Post 2-3 times daily for growth</li>
                </>}
                {selectedType === 'VIDEO' && <>
                  <li>✅ SEO-optimized title matters</li>
                  <li>✅ Custom thumbnail gets 36% more clicks</li>
                  <li>✅ First 30 seconds retains viewers</li>
                  <li>✅ Add timestamps in description</li>
                </>}
                {(selectedType === 'STORY' || selectedType === 'LINKEDIN_VIDEO') && <>
                  <li>✅ Keep it authentic</li>
                  <li>✅ Add captions for silent viewers</li>
                  <li>✅ CTA at the end</li>
                </>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: AI Script Generator */}
      {step === 'script' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">🤖 AI Script Generator</h2>
              <button onClick={() => setStep('details')} className="text-gray-400 hover:text-white text-sm">← Back</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Video Topic *</label>
              <input value={scriptInputs.topic} onChange={e => setScriptInputs(p => ({ ...p, topic: e.target.value }))}
                placeholder="e.g. How to lose weight fast, 5 productivity hacks..." className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Video Duration</label>
                <select value={scriptInputs.duration} onChange={e => setScriptInputs(p => ({ ...p, duration: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="90">90 seconds</option>
                  <option value="180">3 minutes</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Script Style</label>
                <select value={scriptInputs.style} onChange={e => setScriptInputs(p => ({ ...p, style: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {SCRIPT_STYLES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Audience</label>
              <input value={scriptInputs.targetAudience} onChange={e => setScriptInputs(p => ({ ...p, targetAudience: e.target.value }))}
                placeholder="e.g. 18-25 year old fitness enthusiasts" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Key Points (ek per line)</label>
              <textarea value={scriptInputs.keyPoints} onChange={e => setScriptInputs(p => ({ ...p, keyPoints: e.target.value }))} rows={4}
                placeholder={"Point 1: Intro hook\nPoint 2: Main tip\nPoint 3: CTA"}
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
            </div>

            <button onClick={handleGenerateScript} disabled={scriptLoading || !scriptInputs.topic}
              className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {scriptLoading ? '⏳ Writing script...' : '✨ Generate AI Script'}
            </button>
          </div>

          {/* Script Output */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">📄 Generated Script</h3>
              {script && <button onClick={() => setStep('publish')} className="text-sm text-purple-400 hover:text-purple-300 font-medium">Continue to Publish →</button>}
            </div>

            {scriptLoading && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">AI script likh raha hai...</p>
              </div>
            )}

            {!script && !scriptLoading && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-gray-400">Topic fill karo aur Generate dabao</p>
                <p className="text-gray-500 text-xs mt-2">GPT-4o aapka script likhega</p>
              </div>
            )}

            {script && !scriptLoading && (
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                {script.hook && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">🪝 Hook (First 3 sec)</p>
                    <p className="text-sm text-white">{script.hook}</p>
                  </div>
                )}

                {script.sections?.map((section: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <p className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                      {section.timeCode && <span className="text-gray-500 mr-2">[{section.timeCode}]</span>}
                      {section.title}
                    </p>
                    <p className="text-sm text-white leading-relaxed">{section.script}</p>
                    {section.visualNote && <p className="text-xs text-gray-500 mt-2 italic">📸 Visual: {section.visualNote}</p>}
                  </div>
                ))}

                {script.cta && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <p className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wider">📣 Call to Action</p>
                    <p className="text-sm text-white">{script.cta}</p>
                  </div>
                )}

                {script.estimatedDuration && (
                  <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
                    <p className="text-xs text-gray-400">⏱️ Estimated Duration: <span className="text-white font-medium">{script.estimatedDuration}</span></p>
                  </div>
                )}

                <button onClick={() => {
                  const text = [script.hook, ...(script.sections?.map((s: any) => `${s.title}:\n${s.script}`) || []), script.cta].filter(Boolean).join('\n\n');
                  navigator.clipboard.writeText(text);
                  toast.success('Script copied! 📋');
                }} className="w-full py-2.5 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300"
                  style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
                  📋 Copy Full Script
                </button>

                <button onClick={() => {
                  setForm(p => ({ ...p, description: script.hook || script.sections?.[0]?.script || '' }));
                  setStep('publish');
                }} className="w-full py-3 rounded-xl text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  Use This Script & Publish →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Publish */}
      {step === 'publish' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">🚀 Publish Video</h2>
            <button onClick={() => setStep('script')} className="text-gray-400 hover:text-white text-sm">← Back</button>
          </div>

          <div className="card p-6 space-y-4">
            {/* Preview */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{VIDEO_TYPES.find(t => t.id === selectedType)?.icon}</span>
                <div>
                  <p className="text-white font-medium">{form.title || scriptInputs.topic || 'Untitled Video'}</p>
                  <p className="text-xs text-gray-400">{VIDEO_TYPES.find(t => t.id === selectedType)?.label} • {VIDEO_TYPES.find(t => t.id === selectedType)?.platform}</p>
                </div>
              </div>
              {form.description && <p className="text-sm text-gray-300 line-clamp-3">{form.description}</p>}
            </div>

            {/* Final hashtags */}
            {hashtags.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Selected Hashtags</p>
                <div className="flex flex-wrap gap-1">
                  {hashtags.slice(0, 20).map((h, i) => (
                    <span key={i} className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">📅 Schedule (optional)</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handlePublish('DRAFT')} disabled={createPost.isPending}
              className="py-3 rounded-xl text-sm font-semibold text-gray-300 card transition-all card-hover">
              💾 Save Draft
            </button>
            {form.scheduledAt && (
              <button onClick={() => handlePublish('SCHEDULED')} disabled={createPost.isPending}
                className="py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid #6366f1' }}>
                📅 Schedule
              </button>
            )}
            <button onClick={() => handlePublish('PUBLISHED')} disabled={createPost.isPending}
              className="py-3 rounded-xl text-sm font-semibold text-white col-span-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {createPost.isPending ? '⏳ Publishing...' : '🚀 Publish Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
