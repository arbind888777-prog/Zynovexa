import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'AI Assistant — Viral Captions, Scripts & Images in Seconds | Zynovexa',
  description: 'Generate viral social media captions, video scripts, hashtag sets, and AI images powered by GPT-4o and DALL-E 3. 500+ templates. Start free.',
  alternates: { canonical: 'https://zynovexa.com/features/ai-assistant' },
};

const AI_TOOLS = [
  { icon: '✍️', title: 'Caption Generator', desc: 'Platform-optimized captions with hooks, CTAs, and emojis. Tone control: funny, professional, viral.', badge: 'Most Used' },
  { icon: '🎬', title: 'Video Script Writer', desc: 'Full TikTok, YouTube & Reels scripts with intros, hooks, body and CTAs. Structured for virality.', badge: null },
  { icon: '#️⃣', title: 'Hashtag Generator', desc: '30 targeted hashtags blending trending + niche + branded tags, optimized per platform.', badge: null },
  { icon: '🎨', title: 'AI Image Generator', desc: 'Create stunning social images from text prompts. DALL-E 3. Instagram-ready HD quality.', badge: 'New' },
  { icon: '💬', title: 'Zyx Chatbot', desc: 'Your 24/7 personal creator advisor. Strategy sessions, content ideas, growth plans.', badge: null },
  { icon: '🔄', title: 'Content Repurposer', desc: 'Convert a YouTube video → Twitter thread, blog post → Instagram carousel, podcast → shorts.', badge: null },
  { icon: '📧', title: 'Bio Optimizer', desc: 'AI-rewrite your profile bios for maximum discoverability and follower conversion.', badge: null },
  { icon: '📈', title: 'Trend Analyzer', desc: 'Real-time trending topics and sounds surfaced for your niche. Never miss a viral moment.', badge: null },
];

export default function AIAssistantPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-20 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-20 -right-10 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">🤖 Powered by GPT-4o · DALL-E 3</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Your AI-powered<br /><span className="gradient-text">content machine</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Stop staring at blank screens. Generate viral captions, scripts, hashtags, and stunning images in seconds — for every platform, every niche.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Try AI Free</Link>
            <Link href="/features" className="btn btn-secondary btn-xl">← All Features</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['500+','AI Templates'],['1M+','Captions Generated'],['GPT-4o','Latest Model'],['2s','Average Speed']].map(([v,l]) => (
            <div key={l} className="card text-center p-5 card-hover">
              <div className="text-2xl font-black text-white mb-1">{v}</div>
              <div className="text-xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">8 AI tools. Infinite content.</h2>
            <p className="text-slate-400">Everything you need to never run out of ideas again.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AI_TOOLS.map(t => (
              <div key={t.title} className="card card-hover p-5 relative">
                {t.badge && (
                  <span className="absolute top-4 right-4 badge badge-purple text-xs">{t.badge}</span>
                )}
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="text-white font-semibold mb-2">{t.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it compares */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">AI that actually understands creators</h2>
          <div className="space-y-4">
            {[
              ['Without Zynovexa AI', '2-3 hours writing captions, scripts, hashtags manually', 'text-red-400', '✗'],
              ['With Zynovexa AI', '30 seconds per post. Better quality. More viral.', 'text-green-400', '✓'],
            ].map(([title, desc, color, icon]) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <span className={`text-2xl font-black ${color} shrink-0`}>{icon}</span>
                <div>
                  <p className={`font-semibold ${color} mb-1`}>{title}</p>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">20 free AI credits every day</h2>
          <p className="text-slate-400 mb-6">Start generating content for free. Upgrade when you want unlimited access.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Start Creating Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
