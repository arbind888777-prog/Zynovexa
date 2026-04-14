'use client';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi, aiEngineApi, unwrapApiResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

type Tool = 'caption' | 'hashtags' | 'script' | 'image' | 'video' | 'chat' | 'besttime' | 'hook' | 'scorer';
const AI_STUDIO_TRANSFER_KEY = 'zynovexa.aiStudioDraft';
const DEMO_TOKEN = 'demo-token-zynovexa';

function getApiErrorMessage(error: any, fallback: string) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 401 || status === 403) {
    return 'AI tools use karne ke liye valid logged-in account chahiye. Demo session backend se authorize nahi hoti.';
  }

  if (Array.isArray(message) && message.length) {
    return message.join(' ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}

const TOOLS = [
  { id: 'caption', icon: '✍️', name: 'Caption Writer', desc: 'Generate viral captions for any platform' },
  { id: 'hashtags', icon: '#️⃣', name: 'Hashtag Generator', desc: 'Find the best hashtags for your content' },
  { id: 'script', icon: '🎬', name: 'Video Script', desc: 'Write scripts for YouTube and Reels' },
  { id: 'image', icon: '🎨', name: 'Image Generator', desc: 'Create AI images with Google Nano Banana' },
  { id: 'video', icon: '🎥', name: 'Video Generator', desc: 'Create short AI videos with Google Veo 3.1' },
  { id: 'chat', icon: '💬', name: 'Zyx Chatbot', desc: 'Your 24/7 creator growth advisor' },
  { id: 'besttime', icon: '⏰', name: 'Best Time to Post', desc: 'AI-powered posting schedule optimizer' },
  { id: 'hook', icon: '🎯', name: 'Hook Generator', desc: 'Platform-specific hooks that stop the scroll' },
  { id: 'scorer', icon: '📊', name: 'Content Scorer', desc: 'Score your content for viral & engagement potential' },
] as const;

const PROVIDER_BADGES = [
  { label: 'Text', tone: 'text-cyan-200 border-cyan-500/30 bg-cyan-500/10' },
  { label: 'Images', tone: 'text-fuchsia-200 border-fuchsia-500/30 bg-fuchsia-500/10' },
  { label: 'Video', tone: 'text-emerald-200 border-emerald-500/30 bg-emerald-500/10' },
] as const;

const PLATFORM_MAP: Record<string, string> = {
  instagram: 'INSTAGRAM',
  youtube: 'YOUTUBE',
  twitter: 'TWITTER',
  x: 'TWITTER',
  linkedin: 'LINKEDIN',
  facebook: 'FACEBOOK',
  snapchat: 'SNAPCHAT',
  shorts: 'YOUTUBE',
};

function buildDemoToolPrompt(activeTool: Tool, fields: {
  description: string;
  niche: string;
  tone: string;
  platforms: string;
  topic: string;
  duration: string;
  content: string;
  prompt: string;
  platform: string;
  timezone: string;
  language: string;
  brandVoice: string;
}) {
  const voice = fields.brandVoice ? `Brand voice: ${fields.brandVoice}.` : '';
  const language = fields.language || 'English';
  const platforms = fields.platforms || fields.platform || 'social media';

  switch (activeTool) {
    case 'caption':
      return `Generate 3 high-quality ${fields.tone} social captions in ${language} for ${platforms}. Niche: ${fields.niche || 'general'}. Description: ${fields.description}. Include emojis and hashtags. ${voice}`.trim();
    case 'hashtags':
      return `Generate 25 relevant hashtags in ${language} for this content: ${fields.content}. Niche: ${fields.niche || 'general'}. Platforms: ${platforms}. Return hashtags only in a clean list. ${voice}`.trim();
    case 'script':
      return `Write a ${fields.duration || '60'} second ${fields.platform || 'short-form'} video script in ${language}. Topic: ${fields.topic}. Niche: ${fields.niche || 'general'}. Tone: ${fields.tone}. Include hook, sections, CTA, and simple visual notes. ${voice}`.trim();
    case 'besttime':
      return `Suggest the best posting times in JSON-like bullet format for platform ${fields.platform || 'all'} in timezone ${fields.timezone || 'UTC'}. Niche: ${fields.niche || 'general'}. Include top days and brief reasoning.`;
    case 'hook':
      return `Generate 5 scroll-stopping hooks in ${language} for ${fields.platform || 'instagram'}. Topic: ${fields.topic || fields.description}. Niche: ${fields.niche || 'general'}. Tone: ${fields.tone}. Return a numbered list only. ${voice}`.trim();
    default:
      return '';
  }
}

function normalizeDemoToolResult(activeTool: Tool, reply: string) {
  if (activeTool === 'hashtags') {
    const hashtags = reply
      .split(/\s|,|\n/)
      .map((tag) => tag.trim())
      .filter((tag) => /^#/.test(tag));
    return { hashtags: hashtags.length ? hashtags : [reply] };
  }

  if (activeTool === 'caption') {
    const captions = reply
      .split(/\n\s*\n|\n(?=\d+[\).\s])|\n(?=- )/)
      .map((item) => item.replace(/^\d+[\).\s-]*/, '').trim())
      .filter(Boolean);
    return { captions: captions.length ? captions : [reply] };
  }

  if (activeTool === 'script') {
    return { script: reply };
  }

  if (activeTool === 'besttime') {
    return { insights: reply, bestTimes: [] };
  }

  if (activeTool === 'hook') {
    return { hookContent: reply, hookScore: null };
  }

  return { reply };
}

function normalizePlatforms(values: string[]) {
  return values
    .map((value) => PLATFORM_MAP[value.trim().toLowerCase()])
    .filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index);
}

function toHashtagTokens(values: string[]) {
  return values.map((value) => value.startsWith('#') ? value : `#${value.replace(/\s+/g, '')}`);
}

function nextDateForDayTime(day: string, time: string) {
  const targetDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetIndex = targetDays.findIndex((item) => item.toLowerCase() === day.toLowerCase());
  if (targetIndex === -1) return '';

  const [hours = '9', minutes = '0'] = time.split(':');
  const now = new Date();
  const target = new Date(now);
  target.setHours(Number(hours), Number(minutes), 0, 0);

  let diff = targetIndex - now.getDay();
  if (diff < 0 || (diff === 0 && target <= now)) diff += 7;
  target.setDate(now.getDate() + diff);

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
}

export default function AIStudioPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const isDemoSession = accessToken === DEMO_TOKEN;
  const [activeTool, setActiveTool] = useState<Tool>('caption');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatMsg, setChatMsg] = useState('');

  const { data: usage } = useQuery({
    queryKey: ['ai-usage'],
    queryFn: () => aiApi.getUsage().then(unwrapApiResponse),
    enabled: !isDemoSession,
  });

  const [fields, setFields] = useState({
    description: '',
    niche: '',
    tone: 'casual',
    platforms: '',
    topic: '',
    duration: '60',
    content: '',
    prompt: '',
    platform: '',
    timezone: 'UTC',
    language: 'English',
    brandVoice: '',
    videoAspectRatio: '16:9',
    videoDuration: '6',
  });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFields(p => ({ ...p, [k]: e.target.value }));

  const sendToCreatePost = (draft: Record<string, unknown>, successMessage: string) => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(AI_STUDIO_TRANSFER_KEY, JSON.stringify(draft));
    toast.success(successMessage);
    router.push('/create?source=ai');
  };

  const runTool = async () => {
    setLoading(true); setResult(null);
    try {
      if (isDemoSession) {
        if (activeTool === 'image' || activeTool === 'video') {
          toast.error('Demo session me media generation available nahi hai. Real account se login karke try karo.');
          return;
        }

        if (activeTool === 'scorer') {
          const res = await aiEngineApi.scoreContent({ content: fields.content, platform: fields.platform || 'instagram' });
          setResult(unwrapApiResponse(res));
          return;
        }

        const prompt = buildDemoToolPrompt(activeTool, fields);
        if (!prompt) {
          toast.error('Yeh AI tool demo mode me abhi supported nahi hai.');
          return;
        }

        const res = await aiApi.publicChat({
          message: prompt,
          history: [],
          language: fields.language,
          brandVoice: fields.brandVoice,
        });
        const payload = unwrapApiResponse<{ reply: string }>(res);
        setResult(normalizeDemoToolResult(activeTool, payload.reply));
        return;
      }

      let res: any;
      const plats = fields.platforms.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
      if (activeTool === 'caption') res = await aiApi.generateCaption({ description: fields.description, niche: fields.niche, tone: fields.tone, platforms: plats, includeHashtags: true, includeEmojis: true, language: fields.language, brandVoice: fields.brandVoice });
      else if (activeTool === 'hashtags') res = await aiApi.generateHashtags({ content: fields.content, niche: fields.niche, language: fields.language, platforms: plats });
      else if (activeTool === 'script') res = await aiApi.generateScript({ topic: fields.topic, platform: fields.platform, durationSeconds: parseInt(fields.duration), niche: fields.niche, language: fields.language, brandVoice: fields.brandVoice });
      else if (activeTool === 'image') res = await aiApi.generateImage({ prompt: fields.prompt });
      else if (activeTool === 'video') res = await aiApi.generateVideo({ prompt: fields.prompt, aspectRatio: fields.videoAspectRatio, durationSeconds: parseInt(fields.videoDuration, 10) });
      else if (activeTool === 'besttime') res = await aiApi.getBestTimes({ platform: fields.platform, niche: fields.niche, timezone: fields.timezone });
      else if (activeTool === 'hook') {
        res = await aiEngineApi.generate({ niche: fields.niche || 'general', platform: fields.platform || 'instagram', tone: fields.tone, audience: 'general', contentType: 'hook', topic: fields.topic || fields.description });
        const hookData = unwrapApiResponse(res) as any;
        setResult({ hookContent: hookData?.content, hookScore: hookData?.score }); return;
      }
      else if (activeTool === 'scorer') {
        res = await aiEngineApi.scoreContent({ content: fields.content, platform: fields.platform || 'instagram' });
      }
      setResult(unwrapApiResponse(res));
    } catch (e: any) { toast.error(getApiErrorMessage(e, 'AI failed')); }
    finally { setLoading(false); }
  };

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    const msg = chatMsg;
    setChatMsg('');
    const newHistory = [...chatHistory, { role: 'user', content: msg }];
    setChatHistory(newHistory);
    setLoading(true);
    try {
      const res = await (accessToken === DEMO_TOKEN
        ? aiApi.publicChat({ message: msg, history: chatHistory, language: fields.language, brandVoice: fields.brandVoice })
        : aiApi.chat({ message: msg, history: chatHistory, language: fields.language, brandVoice: fields.brandVoice }));
      const payload = unwrapApiResponse<{ reply: string }>(res);
      setChatHistory([...newHistory, { role: 'assistant', content: payload.reply }]);
    } catch (e: any) { toast.error(getApiErrorMessage(e, 'Chat failed')); }
    finally { setLoading(false); }
  };

  const exportMemory = async () => {
    try {
      const server = await aiApi.getChatMemory();
      const serverPayload = unwrapApiResponse<{ messages?: unknown[] }>(server);
      const payload = {
        exportedAt: new Date().toISOString(),
        localMessages: chatHistory,
        serverMessages: serverPayload?.messages || [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zynovexa-ai-memory-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('AI memory exported');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Memory export failed');
    }
  };

  const resetMemory = async () => {
    if (!confirm('Reset AI chat memory? This will clear local and server chat memory.')) return;
    try {
      await aiApi.resetChatMemory();
      setChatHistory([]);
      localStorage.removeItem('zynovexa-ai-chat-memory');
      toast.success('AI memory reset complete');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Memory reset failed');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500";
  const inputStyle = { background: 'var(--surface)', border: '1px solid var(--border)' };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('zynovexa-ai-chat-memory');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setChatHistory(parsed.slice(-80));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('zynovexa-ai-chat-memory', JSON.stringify(chatHistory.slice(-80)));
    } catch {}
  }, [chatHistory]);

  return (
    <div className="dashboard-content-shell animate-fade-in">
      <div className="dashboard-headerband mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Creator Intelligence</p>
          <h1 className="mt-2 text-2xl font-bold text-white">🤖 AI Studio</h1>
          <p className="mt-2 text-sm text-gray-400">Captions, tags, scripts, images, videos aur chat ke liye ek focused workspace.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROVIDER_BADGES.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${badge.tone}`}
              >
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>
        {usage && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-sm text-gray-400">AI Usage: <span className="text-white font-mono">{usage.used} / {usage.limit ?? '∞'}</span></p>
            <p className="text-xs text-purple-400">{usage.plan === 'DEV' ? 'Local mode' : usage.plan}</p>
          </div>
        )}
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-9 gap-3 mb-8">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => { setActiveTool(t.id as Tool); setResult(null); }}
            className={`dashboard-tab p-4 text-center transition-all hover:scale-[1.02] ${activeTool === t.id ? 'dashboard-tab-active glow text-white' : 'text-gray-400 hover:text-white'}`}>
            <div className="text-2xl mb-2">{t.icon}</div>
            <p className="text-xs font-medium text-white">{t.name}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="dashboard-surface p-6">
          <h2 className="font-semibold text-white mb-4">{TOOLS.find(t => t.id === activeTool)?.name}</h2>
          <p className="text-xs text-gray-400 mb-5">{TOOLS.find(t => t.id === activeTool)?.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Language</label>
              <select value={fields.language} onChange={f('language') as any} className={inputClass} style={inputStyle}>
                {['English', 'Hindi', 'Hinglish'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Brand Voice</label>
              <input value={fields.brandVoice} onChange={f('brandVoice')} placeholder="Bold, witty, motivational..." className={inputClass} style={inputStyle} />
            </div>
          </div>

          {activeTool === 'chat' ? (
            <div>
              <div className="dashboard-surface-muted h-64 overflow-y-auto space-y-3 mb-4 p-3">
                {chatHistory.length === 0 && <p className="text-xs text-gray-500 text-center py-4">Ask Zyx anything about growing as a creator...</p>}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'text-white' : 'text-gray-200'}`}
                      style={{ background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--card)' }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="flex justify-start"><div className="px-4 py-2 rounded-2xl text-sm text-gray-400" style={{ background: 'var(--card)' }}>Thinking...</div></div>}
              </div>
              <div className="flex gap-2">
                <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Ask Zyx anything..." className={`flex-1 ${inputClass}`} style={inputStyle} />
                <button onClick={sendChat} disabled={loading} className="px-4 py-2 rounded-lg text-white font-medium" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Send</button>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={exportMemory} className="px-3 py-1.5 rounded-lg text-xs text-purple-300 border border-purple-500/40 hover:bg-purple-500/10 transition-all">
                  Export Memory
                </button>
                <button onClick={resetMemory} className="px-3 py-1.5 rounded-lg text-xs text-red-300 border border-red-500/40 hover:bg-red-500/10 transition-all">
                  Reset Memory
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTool === 'caption' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Post Description *</label><textarea value={fields.description} onChange={f('description')} rows={3} placeholder="What's your post about?" className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="lifestyle, fitness, tech..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Tone</label><select value={fields.tone} onChange={f('tone') as any} className={inputClass} style={inputStyle}>{['casual', 'professional', 'funny', 'inspirational'].map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Platforms (comma-separated)</label><input value={fields.platforms} onChange={f('platforms')} placeholder="instagram, youtube, linkedin" className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'hashtags' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Content Description *</label><textarea value={fields.content} onChange={f('content')} rows={3} placeholder="Describe your content..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="fitness, travel, food..." className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'script' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Video Topic *</label><input value={fields.topic} onChange={f('topic')} placeholder="5 tips to grow on YouTube Shorts..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Platform</label><select value={fields.platform} onChange={f('platform') as any} className={inputClass} style={inputStyle}>{['youtube', 'instagram', 'shorts'].map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label><input type="number" value={fields.duration} onChange={f('duration')} className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'image' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Image Prompt *</label><textarea value={fields.prompt} onChange={f('prompt')} rows={4} placeholder="A stunning sunset over mountains, professional photography, cinematic..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
              </>}
              {activeTool === 'video' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Video Prompt *</label><textarea value={fields.prompt} onChange={f('prompt')} rows={4} placeholder="Cinematic product ad, smooth camera motion, realistic lighting, synced ambience..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Aspect Ratio</label><select value={fields.videoAspectRatio} onChange={f('videoAspectRatio') as any} className={inputClass} style={inputStyle}>{['16:9', '9:16'].map((ratio) => <option key={ratio}>{ratio}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Duration</label><select value={fields.videoDuration} onChange={f('videoDuration') as any} className={inputClass} style={inputStyle}>{['4', '6', '8'].map((duration) => <option key={duration} value={duration}>{duration} seconds</option>)}</select></div>
              </>}
              {activeTool === 'besttime' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Platform</label><select value={fields.platform} onChange={f('platform') as any} className={inputClass} style={inputStyle}>{['', 'instagram', 'youtube', 'twitter', 'linkedin'].map(p => <option key={p} value={p}>{p || 'All platforms'}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="lifestyle, fitness..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Timezone</label><input value={fields.timezone} onChange={f('timezone')} placeholder="America/New_York" className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'hook' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Topic / Idea *</label><textarea value={fields.topic || fields.description} onChange={f('topic')} rows={3} placeholder="What's the hook about? e.g., morning routine tips..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Platform</label><select value={fields.platform} onChange={f('platform') as any} className={inputClass} style={inputStyle}>{['instagram', 'youtube', 'twitter', 'linkedin'].map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="fitness, tech, food..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Tone</label><select value={fields.tone} onChange={f('tone') as any} className={inputClass} style={inputStyle}>{['casual', 'professional', 'hinglish', 'humorous', 'motivational'].map(t => <option key={t}>{t}</option>)}</select></div>
              </>}
              {activeTool === 'scorer' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Paste your content *</label><textarea value={fields.content} onChange={f('content')} rows={5} placeholder="Paste your caption, script, or any content to score..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Platform</label><select value={fields.platform} onChange={f('platform') as any} className={inputClass} style={inputStyle}>{['instagram', 'youtube', 'twitter', 'linkedin'].map(p => <option key={p}>{p}</option>)}</select></div>
              </>}
              <button onClick={runTool} disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50 transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                {loading ? '✨ Generating...' : '✨ Generate'}
              </button>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="dashboard-surface p-6">
          <h2 className="font-semibold text-white mb-4">Results</h2>
          {!result && !loading && <p className="text-sm text-gray-500 text-center py-12">Your AI-generated content will appear here.</p>}
          {loading && activeTool !== 'chat' && <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>}
          {result && activeTool !== 'chat' && (
            <div className="space-y-4">
              {typeof result.qualityScore === 'number' && (
                <div className="dashboard-surface-muted p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-400">AI Quality Score</p>
                    <p className="text-sm font-semibold text-white">{result.qualityScore}/100</p>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, result.qualityScore))}%`,
                        background: 'linear-gradient(90deg, #22c55e, #84cc16, #eab308)',
                      }}
                    />
                  </div>
                </div>
              )}

              {activeTool === 'caption' && result.captions?.map((c: string, i: number) => (
                <div key={i} className="dashboard-surface-muted p-4">
                  <p className="text-sm text-gray-200 mb-3">{c}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <button onClick={() => navigator.clipboard.writeText(c).then(() => toast.success('Copied!'))} className="text-purple-400 hover:text-purple-300">📋 Copy</button>
                    <button
                      onClick={() => sendToCreatePost({
                        caption: c,
                        hashtags: result.hashtags ? toHashtagTokens(result.hashtags) : [],
                        platforms: normalizePlatforms(fields.platforms.split(',')),
                        mediaType: 'TEXT',
                      }, 'Caption draft Create Post me bhej diya gaya.')}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Use this result
                    </button>
                  </div>
                </div>
              ))}
              {activeTool === 'hashtags' && result.hashtags && (
                <div className="dashboard-surface-muted p-4">
                  <p className="text-sm text-gray-200 mb-3 leading-relaxed">{result.hashtags.join(' ')}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <button onClick={() => navigator.clipboard.writeText(result.hashtags.join(' ')).then(() => toast.success('Copied!'))} className="text-purple-400">📋 Copy all</button>
                    <button
                      onClick={() => sendToCreatePost({
                        caption: fields.content || fields.description,
                        hashtags: toHashtagTokens(result.hashtags),
                        platforms: normalizePlatforms(fields.platforms.split(',')),
                        mediaType: 'TEXT',
                      }, 'Hashtags Create Post me bhej diye gaye.')}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Use this result
                    </button>
                  </div>
                </div>
              )}
              {activeTool === 'script' && (
                <div className="space-y-3">
                  {result.hook && <div className="dashboard-surface-muted p-3"><p className="text-xs text-purple-400 font-medium mb-1">🎣 Hook</p><p className="text-sm text-gray-200">{result.hook}</p></div>}
                  {result.sections?.map((s: any, i: number) => (
                    <div key={i} className="dashboard-surface-muted p-3">
                      <p className="text-xs text-purple-400 font-medium mb-1">{s.title} ({s.duration}s)</p>
                      <p className="text-sm text-gray-200">{s.script}</p>
                    </div>
                  ))}
                  {result.cta && <div className="dashboard-surface-muted p-3"><p className="text-xs text-purple-400 font-medium mb-1">📢 CTA</p><p className="text-sm text-gray-200">{result.cta}</p></div>}
                  {result.bRoll && <div className="dashboard-surface-muted p-3"><p className="text-xs text-gray-400 font-medium mb-2">🎬 B-Roll Ideas</p>{result.bRoll.map((b: string, i: number) => <p key={i} className="text-xs text-gray-300">• {b}</p>)}</div>}
                  <button
                    onClick={() => sendToCreatePost({
                      title: fields.topic,
                      caption: [result.hook, ...(result.sections?.map((section: any) => section.script) || []), result.cta].filter(Boolean).join('\n\n'),
                      platforms: normalizePlatforms([fields.platform]),
                      mediaType: 'TEXT',
                    }, 'Script draft Create Post me bhej diya gaya.')}
                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Use this result in Create Post →
                  </button>
                </div>
              )}
              {activeTool === 'image' && result.imageUrl && (
                <div>
                  <img src={result.imageUrl} alt="Generated" className="w-full rounded-xl mb-3" />
                  {result.revisedPrompt && <p className="text-xs text-gray-500 mb-2">Revised: {result.revisedPrompt}</p>}
                  <div className="flex items-center justify-between gap-3">
                    <button onClick={() => { fetch(result.imageUrl).then(r => r.blob()).then(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'zynovexa-ai-image.png'; a.click(); URL.revokeObjectURL(a.href); }); }} className="text-sm text-purple-400 hover:text-purple-300">↓ Download</button>
                    <button
                      onClick={() => sendToCreatePost({
                        caption: fields.description || fields.prompt,
                        mediaUrl: result.imageUrl,
                        mediaType: 'IMAGE',
                        platforms: normalizePlatforms(fields.platforms.split(',')),
                      }, 'AI image Create Post me bhej di gayi.')}
                      className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Use this result
                    </button>
                  </div>
                </div>
              )}
              {activeTool === 'video' && result.operationName && (
                <div className="space-y-3">
                  <div className="dashboard-surface-muted p-4">
                    <p className="text-xs text-emerald-300 font-medium mb-2">Veo 3.1 job started</p>
                    <p className="text-xs text-slate-400 break-all">{result.operationName}</p>
                    {result.videoUrl && (
                      <video controls className="mt-3 w-full rounded-xl" src={result.videoUrl} />
                    )}
                  </div>
                  {result.videoUrl && (
                    <button
                      onClick={() => sendToCreatePost({
                        title: fields.prompt.slice(0, 80),
                        caption: fields.prompt,
                        videoUrl: result.videoUrl,
                        platforms: normalizePlatforms([]),
                        mediaType: 'VIDEO',
                      }, 'AI video Create Post me bhej diya gaya.')}
                      className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Use this result
                    </button>
                  )}
                </div>
              )}
              {activeTool === 'besttime' && result.bestTimes && (
                <div className="space-y-3">
                  {result.insights && <p className="dashboard-surface-muted p-3 text-sm text-gray-300">{result.insights}</p>}
                  {result.bestTimes.map((bt: any, i: number) => (
                    <div key={i} className="dashboard-surface-muted p-3">
                      <p className="text-sm font-medium text-white mb-1">{bt.day}</p>
                      <p className="text-xs text-gray-400 mb-2">{bt.times?.join(', ')} · <span className="text-green-400">{bt.expectedReach} reach</span></p>
                      <button
                        onClick={() => sendToCreatePost({
                          caption: fields.description || fields.content || fields.topic,
                          platforms: normalizePlatforms(fields.platform ? [fields.platform] : fields.platforms.split(',')),
                          scheduledAt: bt.times?.[0] ? nextDateForDayTime(bt.day, bt.times[0]) : '',
                          mediaType: 'TEXT',
                        }, 'Best time suggestion Create Post me bhej diya gaya.')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Use this result
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {activeTool === 'hook' && result.hookContent && (
                <div className="space-y-3">
                  <div className="dashboard-surface-muted p-4">
                    <p className="text-xs text-purple-400 font-medium mb-2">🎯 Generated Hook</p>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{result.hookContent}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs">
                      <button onClick={() => navigator.clipboard.writeText(result.hookContent).then(() => toast.success('Copied!'))} className="text-purple-400 hover:text-purple-300">📋 Copy</button>
                      <button onClick={() => sendToCreatePost({ caption: result.hookContent, platforms: normalizePlatforms([fields.platform]), mediaType: 'TEXT' }, 'Hook Create Post me bhej diya gaya.')} className="text-emerald-400 hover:text-emerald-300">Use this result</button>
                    </div>
                  </div>
                  {result.hookScore && (
                    <div className="dashboard-surface-muted p-4">
                      <p className="text-xs text-purple-400 font-medium mb-2">Content Score</p>
                      <div className="grid grid-cols-4 gap-2">
                        {['overall', 'hook', 'readability', 'engagement'].map(k => (
                          <div key={k} className="text-center p-2 rounded-lg bg-white/5">
                            <p className={`text-lg font-bold ${(result.hookScore[k] || 0) >= 80 ? 'text-green-400' : (result.hookScore[k] || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{result.hookScore[k] || 0}</p>
                            <p className="text-[10px] text-gray-400 capitalize">{k}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTool === 'scorer' && result && (typeof result.overall === 'number' || typeof result.score === 'number') && (
                <div className="space-y-3">
                  <div className="dashboard-surface-muted p-4">
                    <p className="text-xs text-purple-400 font-medium mb-3">📊 Content Score</p>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {['overall', 'hook', 'readability', 'engagement'].map(k => (
                        <div key={k} className="text-center p-2 rounded-lg bg-white/5">
                          <p className={`text-lg font-bold ${(result[k] || 0) >= 80 ? 'text-green-400' : (result[k] || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{result[k] || 0}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{k}</p>
                        </div>
                      ))}
                    </div>
                    {result.suggestions?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400">Suggestions</p>
                        {result.suggestions.map((s: string, i: number) => (
                          <p key={i} className="text-xs text-gray-300 flex items-start gap-1"><span className="text-blue-400">→</span> {s}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
