'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type Tool = 'caption' | 'hashtags' | 'script' | 'image' | 'chat' | 'besttime';

const TOOLS = [
  { id: 'caption', icon: '✍️', name: 'Caption Writer', desc: 'Generate viral captions for any platform' },
  { id: 'hashtags', icon: '#️⃣', name: 'Hashtag Generator', desc: 'Find the best hashtags for your content' },
  { id: 'script', icon: '🎬', name: 'Video Script', desc: 'Write scripts for TikTok, YouTube, Reels' },
  { id: 'image', icon: '🎨', name: 'Image Generator', desc: 'Create AI images with DALL-E 3' },
  { id: 'chat', icon: '💬', name: 'Zyx Chatbot', desc: 'Your 24/7 creator growth advisor' },
  { id: 'besttime', icon: '⏰', name: 'Best Time to Post', desc: 'AI-powered posting schedule optimizer' },
] as const;

export default function AIStudioPage() {
  const [activeTool, setActiveTool] = useState<Tool>('caption');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatMsg, setChatMsg] = useState('');

  const { data: usage } = useQuery({ queryKey: ['ai-usage'], queryFn: () => aiApi.getUsage().then(r => r.data) });

  const [fields, setFields] = useState({ description: '', niche: '', tone: 'casual', platforms: '', topic: '', duration: '60', content: '', prompt: '', platform: '', timezone: 'UTC' });
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFields(p => ({ ...p, [k]: e.target.value }));

  const runTool = async () => {
    setLoading(true); setResult(null);
    try {
      let res: any;
      const plats = fields.platforms.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
      if (activeTool === 'caption') res = await aiApi.generateCaption({ description: fields.description, niche: fields.niche, tone: fields.tone, platforms: plats, includeHashtags: true, includeEmojis: true });
      else if (activeTool === 'hashtags') res = await aiApi.generateHashtags({ content: fields.content, niche: fields.niche });
      else if (activeTool === 'script') res = await aiApi.generateScript({ topic: fields.topic, platform: fields.platform, durationSeconds: parseInt(fields.duration), niche: fields.niche });
      else if (activeTool === 'image') res = await aiApi.generateImage({ prompt: fields.prompt });
      else if (activeTool === 'besttime') res = await aiApi.getBestTimes({ platform: fields.platform, niche: fields.niche, timezone: fields.timezone });
      setResult(res?.data);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'AI failed'); }
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
      const res = await aiApi.chat({ message: msg, history: chatHistory });
      setChatHistory([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (e: any) { toast.error('Chat failed'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500";
  const inputStyle = { background: 'var(--surface)', border: '1px solid var(--border)' };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🤖 AI Studio</h1>
          <p className="text-sm text-gray-400 mt-1">Powered by GPT-4o & DALL-E 3</p>
        </div>
        {usage && (
          <div className="text-right">
            <p className="text-sm text-gray-400">AI Usage: <span className="text-white font-mono">{usage.used} / {usage.limit ?? '∞'}</span></p>
            <p className="text-xs text-purple-400">{usage.plan}</p>
          </div>
        )}
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => { setActiveTool(t.id as Tool); setResult(null); }}
            className={`p-4 rounded-xl text-center transition-all hover:scale-[1.02] ${activeTool === t.id ? 'glow' : ''}`}
            style={{ background: activeTool === t.id ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))' : 'var(--card)', border: `1px solid ${activeTool === t.id ? '#6366f1' : 'var(--border)'}` }}>
            <div className="text-2xl mb-2">{t.icon}</div>
            <p className="text-xs font-medium text-white">{t.name}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">{TOOLS.find(t => t.id === activeTool)?.name}</h2>
          <p className="text-xs text-gray-400 mb-5">{TOOLS.find(t => t.id === activeTool)?.desc}</p>

          {activeTool === 'chat' ? (
            <div>
              <div className="h-64 overflow-y-auto space-y-3 mb-4 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
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
            </div>
          ) : (
            <div className="space-y-4">
              {activeTool === 'caption' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Post Description *</label><textarea value={fields.description} onChange={f('description')} rows={3} placeholder="What's your post about?" className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="lifestyle, fitness, tech..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Tone</label><select value={fields.tone} onChange={f('tone') as any} className={inputClass} style={inputStyle}>{['casual', 'professional', 'funny', 'inspirational'].map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Platforms (comma-separated)</label><input value={fields.platforms} onChange={f('platforms')} placeholder="instagram, tiktok, youtube" className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'hashtags' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Content Description *</label><textarea value={fields.content} onChange={f('content')} rows={3} placeholder="Describe your content..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="fitness, travel, food..." className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'script' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Video Topic *</label><input value={fields.topic} onChange={f('topic')} placeholder="5 tips to grow on TikTok..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Platform</label><select value={fields.platform} onChange={f('platform') as any} className={inputClass} style={inputStyle}>{['tiktok', 'youtube', 'instagram', 'shorts'].map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label><input type="number" value={fields.duration} onChange={f('duration')} className={inputClass} style={inputStyle} /></div>
              </>}
              {activeTool === 'image' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Image Prompt *</label><textarea value={fields.prompt} onChange={f('prompt')} rows={4} placeholder="A stunning sunset over mountains, professional photography, cinematic..." className={inputClass + ' resize-none'} style={inputStyle} /></div>
              </>}
              {activeTool === 'besttime' && <>
                <div><label className="block text-xs text-gray-400 mb-1">Platform</label><select value={fields.platform} onChange={f('platform') as any} className={inputClass} style={inputStyle}>{['', 'instagram', 'tiktok', 'youtube', 'twitter', 'linkedin'].map(p => <option key={p} value={p}>{p || 'All platforms'}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">Niche</label><input value={fields.niche} onChange={f('niche')} placeholder="lifestyle, fitness..." className={inputClass} style={inputStyle} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Timezone</label><input value={fields.timezone} onChange={f('timezone')} placeholder="America/New_York" className={inputClass} style={inputStyle} /></div>
              </>}
              <button onClick={runTool} disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50 transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                {loading ? '✨ Generating...' : '✨ Generate'}
              </button>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Results</h2>
          {!result && !loading && <p className="text-sm text-gray-500 text-center py-12">Your AI-generated content will appear here.</p>}
          {loading && activeTool !== 'chat' && <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>}
          {result && activeTool !== 'chat' && (
            <div className="space-y-4">
              {activeTool === 'caption' && result.captions?.map((c: string, i: number) => (
                <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
                  <p className="text-sm text-gray-200 mb-3">{c}</p>
                  <button onClick={() => navigator.clipboard.writeText(c).then(() => toast.success('Copied!'))} className="text-xs text-purple-400 hover:text-purple-300">📋 Copy</button>
                </div>
              ))}
              {activeTool === 'hashtags' && result.hashtags && (
                <div className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
                  <p className="text-sm text-gray-200 mb-3 leading-relaxed">{result.hashtags.join(' ')}</p>
                  <button onClick={() => navigator.clipboard.writeText(result.hashtags.join(' ')).then(() => toast.success('Copied!'))} className="text-xs text-purple-400">📋 Copy all</button>
                </div>
              )}
              {activeTool === 'script' && (
                <div className="space-y-3">
                  {result.hook && <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}><p className="text-xs text-purple-400 font-medium mb-1">🎣 Hook</p><p className="text-sm text-gray-200">{result.hook}</p></div>}
                  {result.sections?.map((s: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                      <p className="text-xs text-purple-400 font-medium mb-1">{s.title} ({s.duration}s)</p>
                      <p className="text-sm text-gray-200">{s.script}</p>
                    </div>
                  ))}
                  {result.cta && <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}><p className="text-xs text-purple-400 font-medium mb-1">📢 CTA</p><p className="text-sm text-gray-200">{result.cta}</p></div>}
                  {result.bRoll && <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}><p className="text-xs text-gray-400 font-medium mb-2">🎬 B-Roll Ideas</p>{result.bRoll.map((b: string, i: number) => <p key={i} className="text-xs text-gray-300">• {b}</p>)}</div>}
                </div>
              )}
              {activeTool === 'image' && result.imageUrl && (
                <div>
                  <img src={result.imageUrl} alt="Generated" className="w-full rounded-xl mb-3" />
                  {result.revisedPrompt && <p className="text-xs text-gray-500 mb-2">Revised: {result.revisedPrompt}</p>}
                  <a href={result.imageUrl} download className="block text-center text-sm text-purple-400 hover:text-purple-300">↓ Download</a>
                </div>
              )}
              {activeTool === 'besttime' && result.bestTimes && (
                <div className="space-y-3">
                  {result.insights && <p className="text-sm text-gray-300 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>{result.insights}</p>}
                  {result.bestTimes.map((bt: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                      <p className="text-sm font-medium text-white mb-1">{bt.day}</p>
                      <p className="text-xs text-gray-400">{bt.times?.join(', ')} · <span className="text-green-400">{bt.expectedReach} reach</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
