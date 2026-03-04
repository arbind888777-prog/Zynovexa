'use client';
import MarketingLayout from '@/components/MarketingLayout';
import { useState } from 'react';

const PLATFORMS = ['Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'Facebook', 'YouTube'];
const TONES = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational', 'Promotional'];

const EXAMPLES: Record<string, string[]> = {
  Instagram: [
    "✨ The secret to growth isn't posting more — it's posting smarter. Here's what changed everything for me 👇 #ContentCreator #GrowthTips",
    "POV: You finally found a tool that schedules, analyzes, AND writes your captions 🙌 Game. Changer. Link in bio! 🔗",
    "3 things I wish I knew before starting my creator journey 🧵 Save this — you'll need it later.",
  ],
  TikTok: [
    "Wait for it… 👀 This one tip grew my account by 10K in 30 days. #GrowthHack #CreatorTips #Viral",
    "Tell me you're a content creator without telling me 😂 #fyp #contentcreator #relatable",
    "The algorithm doesn't hate you. You're just doing THIS wrong 📱 Watch till the end. #TikTokTips",
  ],
  LinkedIn: [
    "I turned down a $200K job offer. Here's what I learned about knowing your worth. 👇 (Thread)",
    "5 lessons from 5 years of building in public that nobody talks about. This one will surprise you.",
    "Hot take: Hustle culture is killing your creativity. What actually builds sustainable success 👇",
  ],
  'Twitter/X': [
    "Unpopular opinion: consistency > creativity when you're just starting. Change my mind.",
    "3-month update: Posted every day. Here's what the data actually shows 🧵",
    "The best time to start was yesterday. The second best time is now. Stop waiting. Go.",
  ],
  Facebook: [
    "We're so excited to share this with our community! 🎉 After months of work, it's finally here. Read more to find out what's been cooking 👇",
    "Question for our community: What's the #1 challenge you face with social media? Drop it below — we read every comment!",
    "Behind the scenes of how we create content that actually converts 📱 Swipe to see our full process →",
  ],
  YouTube: [
    "I tested every social media scheduling tool for 30 days. The results shocked me. Everything you need to know is in this video.",
    "From 0 to 100K subscribers: The exact strategy I used, broken down step by step. No fluff. No gatekeeping.",
    "Why your YouTube growth has stalled (and exactly how to fix it in 2026). Watch this before posting your next video.",
  ],
};

export default function AICaptionGeneratorPage() {
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Casual');
  const [topic, setTopic] = useState('');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenerated(true);
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const captions = EXAMPLES[platform] || EXAMPLES['Instagram'];

  return (
    <MarketingLayout>
      <section className="pt-32 pb-12 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🆓 Free Tool</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            AI Caption<br /><span className="gradient-text">Generator</span>
          </h1>
          <p className="text-slate-400 text-xl">Generate scroll-stopping captions for any platform in seconds. Powered by AI. 100% free.</p>
        </div>
      </section>

      {/* Generator tool */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => { setPlatform(p); setGenerated(false); }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${platform === p ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                      style={{ background: platform === p ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${tone === t ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                      style={{ background: tone === t ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">What's your post about?</label>
              <textarea rows={3} className="input-field w-full resize-none"
                placeholder="e.g. Launching my new YouTube channel about personal finance for Gen Z..."
                value={topic} onChange={e => { setTopic(e.target.value); setGenerated(false); }} />
            </div>

            <button onClick={handleGenerate} disabled={!topic.trim()}
              className="btn btn-primary w-full py-3 font-bold disabled:opacity-40">
              ✨ Generate Captions
            </button>
          </div>

          {/* Results */}
          {generated && (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-slate-500">3 captions generated for <strong className="text-purple-300">{platform}</strong> ({tone} tone)</p>
              {captions.map((cap, i) => (
                <div key={i} className="card p-5 relative group">
                  <p className="text-slate-200 text-sm leading-relaxed pr-10">{cap}</p>
                  <button onClick={() => handleCopy(i, cap)}
                    className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white transition-colors">
                    {copied === i ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upsell */}
      <section className="py-16 px-4 sm:px-6 text-center" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-3">Want AI captions for every post, automatically?</h2>
          <p className="text-slate-400 mb-6 text-sm">Zynovexa Pro schedules your posts AND writes your captions using AI — consistently, at scale.</p>
          <a href="/signup" className="btn btn-primary">Try Zynovexa Free →</a>
        </div>
      </section>
    </MarketingLayout>
  );
}
