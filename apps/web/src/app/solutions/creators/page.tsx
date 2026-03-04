import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Zynovexa for Creators — Grow Your Following & Monetize | Zynovexa',
  description: 'The ultimate social media platform for content creators. AI captions, video scripts, smart scheduling, deep analytics, and monetization tools. Join 50,000+ creators.',
  alternates: { canonical: 'https://zynovexa.com/solutions/creators' },
};

export default function CreatorsSolutionPage() {
  return (
    <MarketingLayout>
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-pink w-96 h-96 -top-20 -right-10 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-pink mb-6 inline-block">🎨 Made for Creators</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Create more.<br /><span className="gradient-text">Grow faster. Earn more.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Stop spending hours on captions and posting manually. Zynovexa handles the grind so you can focus on the craft that made you a creator.
          </p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Start Creating Free</Link>
        </div>
      </section>

      {/* Pain points vs solutions */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Built for how you actually work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { emoji: '🤖', title: 'AI That Knows Your Voice', desc: 'Train Zynovexa on your style. Generate captions that sound exactly like you — not like a robot.' },
              { emoji: '📅', title: 'Batch & Schedule', desc: 'Create a week of content in 2 hours on Sunday. Schedule. Go live your life the rest of the week.' },
              { emoji: '📊', title: 'Know What Goes Viral', desc: 'AI-predicted viral scores before you post. Double down on what your audience actually loves.' },
              { emoji: '💰', title: 'Monetization Insights', desc: 'Track which posts drive affiliate clicks, merch sales, and brand deal opportunities.' },
              { emoji: '#️⃣', title: 'Hashtag Strategy', desc: '30 niche-specific hashtags per post. Mix viral + niche + branded for maximum discovery.' },
              { emoji: '🎬', title: 'Video Studio', desc: 'Full scripts for TikTok, YouTube Shorts, and Reels. Hook → Body → CTA in 10 seconds.' },
            ].map(i => (
              <div key={i.title} className="card card-hover p-6 flex gap-4">
                <span className="text-3xl shrink-0">{i.emoji}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{i.title}</h3>
                  <p className="text-slate-400 text-sm">{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-10">Creators love Zynovexa</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: 'Rahul Sharma', role: 'YouTuber · 250K subs', text: 'I saved 15 hours a week. The AI script generator is genuinely better than what I was writing manually.', plan: 'Pro' },
              { name: 'Priya Gupta', role: 'Instagram Creator · 180K', text: 'My engagement jumped 340% in 3 months after using AI hashtags consistently. The analytics are mind-blowing.', plan: 'Business' },
              { name: 'Aarav Kapoor', role: 'TikTok Creator · 500K', text: 'I schedule an entire week of TikTok + Reels content on Sunday morning. Changed my life honestly.', plan: 'Pro' },
            ].map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_,j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}</div>
                <p className="text-slate-300 text-sm italic mb-4">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                  <span className="badge badge-purple text-xs">{t.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(236,72,153,0.25)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Join 50,000+ creators growing with AI</h2>
          <p className="text-slate-400 mb-6">Free plan available. No credit card. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Get Started Free →</Link>
            <Link href="/pricing" className="btn btn-secondary btn-xl">View Pricing</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
