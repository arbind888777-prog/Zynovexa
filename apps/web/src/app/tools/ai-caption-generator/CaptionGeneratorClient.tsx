'use client';
import { useState } from 'react';

const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook', 'YouTube'];
const TONES = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational', 'Promotional'];

/* ── Template‐based deterministic caption engine ─────────────────── */

const HOOKS: Record<string, string[]> = {
  Instagram: [
    '✨ {topic} — here\'s what changed everything for me 👇',
    'POV: You finally figured out {topic}. Game. Changer. 🙌',
    '3 things I learned about {topic} that nobody talks about 🧵',
  ],
  LinkedIn: [
    'I spent months studying {topic}. Here\'s what the data revealed. 👇',
    '{topic} is misunderstood by 90% of professionals. Here\'s why.',
    'Hot take: Everything you think about {topic} is wrong. Let me explain.',
  ],
  'Twitter/X': [
    'Unpopular opinion about {topic}: thread 🧵',
    'I went deep on {topic}. Here\'s what the data actually shows.',
    '{topic} in one sentence: stop overthinking and start executing.',
  ],
  Facebook: [
    'We\'re thrilled to share our journey with {topic}! 🎉 Here\'s the full story 👇',
    'Question for our community: What\'s your biggest challenge with {topic}? Drop it below!',
    'Behind the scenes of how we approach {topic} — swipe to see our full process →',
  ],
  YouTube: [
    'I tested everything about {topic} for 30 days. The results shocked me.',
    '{topic}: the exact strategy I used, broken down step by step. No fluff.',
    'Why your approach to {topic} has stalled (and exactly how to fix it).',
  ],
};

const TONE_CLOSERS: Record<string, string[]> = {
  Professional: [
    'Here\'s the strategic framework.',
    'Let\'s examine the key insights.',
    'The takeaway is clear and actionable.',
  ],
  Casual: [
    'Honestly, it\'s a vibe. You\'ll see 😉',
    'Trust me on this one. Just try it.',
    'Bookmark this — you\'ll thank yourself later.',
  ],
  Funny: [
    'My mom still doesn\'t understand what I do 😂',
    'Plot twist: the algorithm was right all along 🤯',
    'If this flops I\'m blaming Mercury retrograde 🪐',
  ],
  Inspirational: [
    'Start today. Your future self will thank you. 🚀',
    'The best time to start was yesterday. The second best is now.',
    'Every expert started as a beginner. Keep going. 💪',
  ],
  Educational: [
    'Save this for later — it\'s a masterclass in one caption.',
    'If you made it this far, you already know more than 95% of people.',
    'Share this with someone who needs to hear it. Knowledge compounds.',
  ],
  Promotional: [
    'Link in bio — limited spots available. Don\'t sleep on this.',
    'DM "START" and I\'ll send you the full breakdown. Seriously.',
    'This won\'t last forever. Grab it while you can →',
  ],
};

const PLATFORM_CTAS: Record<string, string[]> = {
  Instagram: ['💾 Save this for later', '💬 Comment below', '🔗 Link in bio'],
  LinkedIn: ['♻️ Repost if you agree', '👇 What\'s your take?', '🔔 Follow for more insights'],
  'Twitter/X': ['RT if this hits', '🧵 Thread incoming', '💬 Reply with yours'],
  Facebook: ['❤️ Like if you relate', '🔄 Share with your network', '👇 Tell us in the comments'],
  YouTube: ['🔔 Subscribe for more', '▶️ Watch the full video', '📝 Comment your thoughts'],
};

const TONE_EMOJIS: Record<string, string> = {
  Professional: '',
  Casual: ' 🔥',
  Funny: ' 😂',
  Inspirational: ' 💡',
  Educational: ' 📚',
  Promotional: ' 🛒',
};

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateCaptions(platform: string, tone: string, topic: string): string[] {
  const hooks = HOOKS[platform] || HOOKS['Instagram'];
  const closers = TONE_CLOSERS[tone] || TONE_CLOSERS['Casual'];
  const ctas = PLATFORM_CTAS[platform] || PLATFORM_CTAS['Instagram'];
  const emoji = TONE_EMOJIS[tone] || '';

  const seed = simpleHash(topic + platform + tone);
  const pick = (arr: string[], offset: number) => arr[(seed + offset) % arr.length];

  return [0, 1, 2].map(i => {
    const hook = hooks[i].replace(/\{topic\}/g, topic.trim());
    const closer = pick(closers, i);
    const cta = pick(ctas, i + 3);
    return `${hook}${emoji}\n\n${closer}\n\n${cta}`;
  });
}

export default function CaptionGeneratorClient() {
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Casual');
  const [topic, setTopic] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleGenerate = () => {
    setTouched(true);
    if (!topic.trim()) return;
    setLoading(true);
    setCaptions([]);
    setTimeout(() => {
      setCaptions(generateCaptions(platform, tone, topic));
      setLoading(false);
    }, 600);
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)}
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
            <textarea rows={3} className={`input-field w-full resize-none ${touched && !topic.trim() ? 'border-red-500/50 ring-1 ring-red-500/30' : ''}`}
              placeholder="e.g. Launching my new YouTube channel about personal finance for Gen Z..."
              value={topic} onChange={e => setTopic(e.target.value)} />
            {touched && !topic.trim() && (
              <p className="text-xs text-red-400 mt-1">Please describe your post topic to generate captions.</p>
            )}
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="btn btn-primary w-full py-3 font-bold disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </span>
            ) : '✨ Generate Captions'}
          </button>
        </div>

        {captions.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-500">3 captions generated for <strong className="text-purple-300">{platform}</strong> · <span className="text-slate-400">{tone}</span> tone · about <span className="text-slate-300 italic">&quot;{topic.trim()}&quot;</span></p>
            {captions.map((cap, i) => (
              <div key={i} className="card p-5 relative group border border-white/5">
                <p className="text-slate-200 text-sm leading-relaxed pr-20 whitespace-pre-line">{cap}</p>
                <button onClick={() => handleCopy(i, cap)}
                  className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:bg-white/10 text-slate-400 hover:text-white">
                  {copied === i ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
