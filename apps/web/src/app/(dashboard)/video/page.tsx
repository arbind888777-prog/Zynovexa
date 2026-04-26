'use client';
import { useState } from 'react';
import TagsInput, { formatTagsAsInput, parseTagValue } from '@/components/TagsInput';
import VideoSelector, { type VideoSelectorOption } from '@/components/VideoSelector';
import { aiApi } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const VIDEO_TYPES: VideoSelectorOption[] = [
  { id: 'REEL', label: 'Instagram Reel', icon: '📱', duration: '15–90 sec', platform: 'INSTAGRAM', color: '#E1306C' },
  { id: 'SHORT', label: 'YouTube Short', icon: '▶️', duration: '< 60 sec', platform: 'YOUTUBE', color: '#FF0000' },
  { id: 'STORY', label: 'Story', icon: '⭕', duration: '15 sec', platform: 'INSTAGRAM', color: '#8A3AB9' },
  { id: 'VIDEO', label: 'YouTube Video', icon: '🎬', duration: 'Any length', platform: 'YOUTUBE', color: '#FF0000' },
  { id: 'LINKEDIN_VIDEO', label: 'LinkedIn Video', icon: '💼', duration: '3 sec – 10 min', platform: 'LINKEDIN', color: '#0A66C2' },
];

const SCRIPT_STYLES = ['Energetic & Hype', 'Educational & Calm', 'Funny & Entertaining', 'Inspirational', 'Tutorial Step-by-step', 'Storytelling'];
const VIDEO_STUDIO_TRANSFER_KEY = 'zynovexa.videoStudioDraft';

export default function VideoStudioPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState<'type' | 'details' | 'script' | 'publish'>('type');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoDuration, setVideoDuration] = useState('6');
  const [videoGenerationLoading, setVideoGenerationLoading] = useState(false);
  const [videoGenerationStatus, setVideoGenerationStatus] = useState('');
  const [videoOperationName, setVideoOperationName] = useState('');
  const [videoReady, setVideoReady] = useState(false);

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

  const getAspectRatio = () => {
    if (selectedType === 'REEL' || selectedType === 'SHORT' || selectedType === 'STORY') {
      return '9:16';
    }
    return '16:9';
  };

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
    if (!scriptInputs.topic) return toast.error('Please enter a video topic');
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
    if (!scriptInputs.topic && !form.description) return toast.error('Please enter a topic or description first');
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
    if (!scriptInputs.topic && !form.description) return toast.error('Please enter a topic first');
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

  const pollVideoStatus = async (operationName: string) => {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const res = await aiApi.checkVideoStatus({ operationName });
      const payload = res?.data;

      if (payload?.status === 'COMPLETED' && payload?.videoUrl) {
        setForm((prev) => ({ ...prev, videoUrl: payload.videoUrl }));
        setVideoGenerationStatus('✅ Your AI video is ready!');
        setVideoReady(true);
        toast.success('AI video ready! You can now preview and use it.');
        return;
      }

      if (payload?.status === 'FAILED') {
        setVideoGenerationStatus(`❌ ${payload?.message || 'Video generation failed.'}`);
        setVideoReady(false);
        throw new Error(payload?.message || 'Video generation failed.');
      }

      setVideoGenerationStatus('⏳ Still generating... AI is rendering your video (usually 2–3 min)');
      await new Promise((resolve) => window.setTimeout(resolve, 5000));
    }

    setVideoGenerationStatus('⏳ Video processing timed out. Click "Check Status" to try again in a minute.');
  };

  const handleGenerateVideo = async () => {
    const prompt = videoPrompt.trim() || scriptInputs.topic.trim() || form.description.trim();
    if (!prompt) {
      toast.error('Video prompt ya topic dalo.');
      return;
    }

    setVideoGenerationLoading(true);
    setVideoGenerationStatus('🚀 Sending request to Google Veo 3...');
    setVideoReady(false);

    try {
      const res = await aiApi.generateVideo({
        prompt,
        aspectRatio: getAspectRatio(),
        durationSeconds: parseInt(videoDuration, 10),
      });

      const payload = res?.data;
      const operationName = payload?.operationName;
      if (!operationName) {
        throw new Error('Operation ID missing');
      }

      setVideoOperationName(operationName);
      setVideoGenerationStatus('⏳ Video queued! AI is now generating it — this takes about 2–3 minutes...');
      await pollVideoStatus(operationName);
    } catch (e: any) {
      setVideoGenerationStatus('❌ Video generation failed. Check your API key or try again.');
      toast.error(e?.response?.data?.message || e?.message || 'Video generation failed');
    } finally {
      setVideoGenerationLoading(false);
    }
  };

  const handleCheckVideoStatus = async () => {
    if (!videoOperationName.trim()) {
      toast.error('Please generate a video first.');
      return;
    }

    setVideoGenerationLoading(true);
    try {
      await pollVideoStatus(videoOperationName.trim());
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Video status check failed');
    } finally {
      setVideoGenerationLoading(false);
    }
  };

  const hasVideoPrompt = !!(videoPrompt.trim() || scriptInputs.topic.trim() || form.description.trim());

  const handleSendToCreatePost = () => {
    if (!form.videoUrl.trim()) {
      toast.error('Create Post me bhejne se pehle video URL ya final rendered video add karo.');
      return;
    }

    const selectedTags = hashtags.length > 0 ? parseTagValue(hashtags) : parseTagValue(form.hashtags);

    const payload = {
      title: form.title || scriptInputs.topic,
      caption: form.description || script?.hook || '',
      videoUrl: form.videoUrl.trim(),
      hashtags: selectedTags.map((tag) => `#${tag.replace(/\s+/g, '')}`),
      scheduledAt: form.scheduledAt || '',
      platforms: form.platforms,
      mediaType: 'VIDEO',
    };

    window.sessionStorage.setItem(VIDEO_STUDIO_TRANSFER_KEY, JSON.stringify(payload));
    toast.success('Video draft Create Post ke liye ready hai.');
    router.push('/create?source=studio');
  };

  const isLocked = true;
  if (isLocked) {
    return (
      <div className="dashboard-content-shell max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="relative w-20 h-20 bg-black/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-white/5">
          <span className="text-4xl grayscale opacity-50">🎬</span>
          <span className="absolute bottom-0 right-0 text-xl translate-x-1 translate-y-1">🔒</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Video Studio is Locked</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          This feature is currently locked. You can upgrade your plan later to unlock AI-powered video generation and scripts.
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content-shell max-w-6xl mx-auto">
      {/* Header */}
      <div className="dashboard-headerband mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">AI-Powered Video Creation</p>
          <h1 className="mt-2 text-3xl font-bold text-white">🎬 Video Studio</h1>
          <p className="mt-2 text-gray-400">Create AI videos, write scripts, and schedule them — step by step.</p>
        </div>
        {/* Step indicator with labels */}
        <div className="flex flex-wrap items-center gap-1">
          {([
            { key: 'type', label: 'Format' },
            { key: 'details', label: 'Details' },
            { key: 'script', label: 'Script' },
            { key: 'publish', label: 'Publish' },
          ] as const).map(({ key, label }, i) => {
            const steps = ['type', 'details', 'script', 'publish'] as const;
            const currentIdx = steps.indexOf(step);
            const isActive = step === key;
            const isDone = currentIdx > i;
            return (
              <div key={key} className="flex items-center gap-1">
                <button
                  onClick={() => step !== 'type' && setStep(key)}
                  className="flex flex-col items-center gap-1 px-2"
                >
                  <div
                    className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${isActive ? 'text-white' : isDone ? 'text-white opacity-70' : 'text-gray-500'}`}
                    style={{
                      background: isActive ? 'linear-gradient(135deg, #6366f1, #a855f7)' : isDone ? 'rgba(99,102,241,0.3)' : 'var(--surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-purple-400' : isDone ? 'text-slate-500' : 'text-gray-600'}`}>{label}</span>
                </button>
                {i < 3 && <div className="w-5 h-0.5 mb-4" style={{ background: isDone ? '#6366f1' : 'var(--border)' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Video Type Selection */}
      {step === 'type' && (
        <div className="space-y-6">
          {/* Beginner guide */}
          <div className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span className="text-2xl mt-0.5">💡</span>
            <div>
              <p className="text-sm font-semibold text-white mb-1">How Video Studio works</p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li><span className="text-slate-300 font-medium">Pick a format</span> — Reel, Short, Story, or YouTube Video</li>
                <li><span className="text-slate-300 font-medium">Generate video with AI</span> — just type a description, Veo 3 creates it</li>
                <li><span className="text-slate-300 font-medium">Write a script</span> (optional) — AI writes hook, body, and CTA for you</li>
                <li><span className="text-slate-300 font-medium">Send to Create Post</span> — schedule and publish to your platforms</li>
              </ol>
            </div>
          </div>
          <VideoSelector
            title="Step 1 — What kind of video are you making? 📱"
            description="Choose the format below. Each format is optimized for a specific platform and length."
            options={VIDEO_TYPES}
            selectedId={selectedType}
            onSelect={selectVideoType}
          />
        </div>
      )}

      {/* STEP 2: Video Details */}
      {step === 'details' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="dashboard-surface p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{VIDEO_TYPES.find(t => t.id === selectedType)?.icon}</span>
                <div>
                  <h2 className="text-white font-semibold">{VIDEO_TYPES.find(t => t.id === selectedType)?.label}</h2>
                  <p className="text-gray-400 text-xs">{VIDEO_TYPES.find(t => t.id === selectedType)?.duration}</p>
                </div>
                <button onClick={() => setStep('type')} className="ml-auto text-gray-400 hover:text-white text-sm">← Change</button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="dashboard-inline-stat px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Format</p>
                  <p className="mt-1 text-sm font-semibold text-white">{VIDEO_TYPES.find(t => t.id === selectedType)?.label}</p>
                </div>
                <div className="dashboard-inline-stat px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Length</p>
                  <p className="mt-1 text-sm font-semibold text-white">{VIDEO_TYPES.find(t => t.id === selectedType)?.duration}</p>
                </div>
                <div className="dashboard-inline-stat px-3 py-3 col-span-2 sm:col-span-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Target Platform</p>
                  <p className="mt-1 text-sm font-semibold text-white">{VIDEO_TYPES.find(t => t.id === selectedType)?.platform}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Video Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Video title..." className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description / Caption</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                  placeholder="Describe your video content..."
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

              <TagsInput
                label="🏷️ Tags"
                tags={parseTagValue(form.hashtags)}
                onChange={(tags) => setForm((prev) => ({ ...prev, hashtags: formatTagsAsInput(tags) }))}
                placeholder="Add a tag and press Enter"
                helperText="YouTube-style tags, hashtags copy, aur chip editing"
              />

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
            <div className="dashboard-surface p-5">
              <h3 className="text-white font-semibold mb-1">⚡ AI Tools</h3>
              <p className="text-xs text-slate-400 mb-4">Use these to generate captions, hashtags, and your actual video.</p>

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
                      <div key={i} className="dashboard-surface-muted p-3">
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
                  <div className="dashboard-surface-muted p-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {hashtags.slice(0, 15).map((h, i) => (
                        <span key={i} className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                    <button onClick={() => setForm(p => ({ ...p, hashtags: formatTagsAsInput(parseTagValue(hashtags)) }))} className="text-purple-400 text-xs hover:text-purple-300">← Apply all</button>
                  </div>
                )}

                <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)' }}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">🎥 Generate Video with AI</p>
                      <p className="text-xs text-slate-400 mt-0.5">Powered by Google Veo 3 — just describe your video idea</p>
                    </div>
                    <span className="text-[11px] rounded-full px-2 py-1 text-emerald-300 border border-emerald-500/30">{getAspectRatio()}</span>
                  </div>

                  {/* Prompt examples */}
                  <div className="mb-3 flex flex-wrap gap-1">
                    {['Product launch ad', 'Gym motivation reel', 'Tutorial intro'].map(eg => (
                      <button key={eg} onClick={() => setVideoPrompt(eg + ', cinematic lighting, smooth camera')}
                        className="text-[11px] text-emerald-300 px-2 py-1 rounded-full hover:bg-emerald-900/30 transition-colors"
                        style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
                        {eg} →
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={3}
                    placeholder="Describe your video... e.g. 'Cinematic product ad with soft lighting, smooth camera motion, modern aesthetic'"
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  />

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Duration</label>
                      <select
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      >
                        <option value="4">4 seconds</option>
                        <option value="6">6 seconds</option>
                        <option value="8">8 seconds</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        onClick={handleGenerateVideo}
                        disabled={videoGenerationLoading || !hasVideoPrompt}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                        style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                      >
                        {videoGenerationLoading ? '⏳ Generating...' : '✨ Generate Video'}
                      </button>
                    </div>
                  </div>

                  {/* Status display */}
                  {videoGenerationStatus && (
                    <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${videoReady ? 'text-emerald-300 bg-emerald-900/20' : 'text-slate-400 bg-black/20'}`}>
                      {videoGenerationStatus}
                    </div>
                  )}

                  {/* Check status button — shown only while in progress */}
                  {videoOperationName && !videoReady && !videoGenerationLoading && (
                    <button
                      onClick={handleCheckVideoStatus}
                      className="mt-2 w-full py-2 rounded-lg text-xs font-medium text-emerald-300 hover:text-white transition-colors"
                      style={{ border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      🔄 Check if video is ready
                    </button>
                  )}

                  {form.videoUrl && (
                    <div className="mt-3 space-y-2">
                      <video controls className="w-full rounded-xl" src={form.videoUrl} />
                      <p className="text-xs text-emerald-400 text-center font-medium">✅ Video ready! Scroll down to continue →</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Tips */}
            <div className="dashboard-surface p-5">
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
          <div className="dashboard-surface p-6 space-y-5">
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
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Key Points (one per line)</label>
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
          <div className="dashboard-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">📄 Generated Script</h3>
              {script && <button onClick={() => setStep('publish')} className="text-sm text-purple-400 hover:text-purple-300 font-medium">Continue to Publish →</button>}
            </div>

            {scriptLoading && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">AI is writing your script...</p>
              </div>
            )}

            {!script && !scriptLoading && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-gray-400">Enter a topic and hit Generate</p>
                <p className="text-gray-500 text-xs mt-2">AI will write your script</p>
              </div>
            )}

            {script && !scriptLoading && (
              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                {script.hook && (
                  <div className="dashboard-surface-muted p-4" style={{ borderColor: 'rgba(239,68,68,0.26)' }}>
                    <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">🪝 Hook (First 3 sec)</p>
                    <p className="text-sm text-white">{script.hook}</p>
                  </div>
                )}

                {script.sections?.map((section: any, i: number) => (
                  <div key={i} className="dashboard-surface-muted p-4">
                    <p className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                      {section.timeCode && <span className="text-gray-500 mr-2">[{section.timeCode}]</span>}
                      {section.title}
                    </p>
                    <p className="text-sm text-white leading-relaxed">{section.script}</p>
                    {section.visualNote && <p className="text-xs text-gray-500 mt-2 italic">📸 Visual: {section.visualNote}</p>}
                  </div>
                ))}

                {script.cta && (
                  <div className="dashboard-surface-muted p-4" style={{ borderColor: 'rgba(34,197,94,0.24)' }}>
                    <p className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wider">📣 Call to Action</p>
                    <p className="text-sm text-white">{script.cta}</p>
                  </div>
                )}

                {script.estimatedDuration && (
                  <div className="dashboard-surface-muted p-3 text-center">
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
                  Use This Script →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Send to Create Post */}
      {step === 'publish' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">🚀 Send To Create Post</h2>
            <button onClick={() => setStep('script')} className="text-gray-400 hover:text-white text-sm">← Back</button>
          </div>

          <div className="dashboard-surface p-6 space-y-4">
            <div className="rounded-2xl p-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
              <p className="text-sm font-semibold text-white">Next step: quick scheduling in Create Post</p>
              <p className="text-xs text-slate-400 mt-1">Yahan se video draft transfer hoga. Final post copy, platform selection, media review aur publish action Create Post page par complete hoga.</p>
            </div>

            {/* Preview */}
            <div className="dashboard-surface-muted p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{VIDEO_TYPES.find(t => t.id === selectedType)?.icon}</span>
                <div>
                  <p className="text-white font-medium">{form.title || scriptInputs.topic || 'Untitled Video'}</p>
                  <p className="text-xs text-gray-400">{VIDEO_TYPES.find(t => t.id === selectedType)?.label} • {VIDEO_TYPES.find(t => t.id === selectedType)?.platform}</p>
                </div>
              </div>
              {form.description && <p className="text-sm text-gray-300 line-clamp-3">{form.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="dashboard-inline-stat px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Draft Type</p>
                <p className="mt-1 text-sm font-semibold text-white">{VIDEO_TYPES.find(t => t.id === selectedType)?.label}</p>
              </div>
              <div className="dashboard-inline-stat px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Hashtags</p>
                <p className="mt-1 text-sm font-semibold text-white">{hashtags.length || parseTagValue(form.hashtags).length}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Final video source</p>
              <div className="dashboard-surface-muted px-3 py-3 text-sm">
                {form.videoUrl ? form.videoUrl : 'No video URL added yet'}
              </div>
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

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => setStep('details')}
              className="py-3 rounded-xl text-sm font-semibold text-gray-300 card transition-all card-hover">
              ← Back To Details
            </button>
            <button onClick={handleSendToCreatePost}
              className="py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              Send to Create Post →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
