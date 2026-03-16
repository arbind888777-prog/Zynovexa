import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'AI Assistant — Viral Captions, Scripts & Images in Seconds | Zynovexa',
  description: 'Generate viral social media captions, video scripts, hashtag sets, and AI images powered by GPT-4o and DALL-E 3. 500+ templates. Start free.',
  alternates: { canonical: 'https://zynovexa.com/features/ai-assistant' },
};

const AI_TOOLS = [
  { icon: '✍️', title: 'Caption Generator', desc: 'Platform-optimized captions with hooks, CTAs, and emojis. Tone control: funny, professional, viral.', badge: 'Most Used', href: '/tools/ai-caption-generator', cta: 'Open caption tool' },
  { icon: '🎬', title: 'Video Script Writer', desc: 'Full TikTok, YouTube & Reels scripts with intros, hooks, body and CTAs. Structured for virality.', badge: null, href: '/features/create', cta: 'See creation suite' },
  { icon: '#️⃣', title: 'Hashtag Generator', desc: '30 targeted hashtags blending trending + niche + branded tags, optimized per platform.', badge: null, href: '/tools/hashtag-generator', cta: 'Open hashtag tool' },
  { icon: '🎨', title: 'AI Image Generator', desc: 'Create stunning social images from text prompts. DALL-E 3. Instagram-ready HD quality.', badge: 'New', href: '/features/create', cta: 'See image workflow' },
  { icon: '💬', title: 'Zyx Chatbot', desc: 'Your 24/7 personal creator advisor. Strategy sessions, content ideas, growth plans.', badge: null, href: '#zyx-chatbot', cta: 'Jump to chatbot info' },
  { icon: '🔄', title: 'Content Repurposer', desc: 'Convert a YouTube video → Twitter thread, blog post → Instagram carousel, podcast → shorts.', badge: null, href: '#content-repurposer', cta: 'Jump to repurposing' },
  { icon: '📧', title: 'Bio Optimizer', desc: 'AI-rewrite your profile bios for maximum discoverability and follower conversion.', badge: null, href: '#bio-optimizer', cta: 'Jump to bio optimization' },
  { icon: '📈', title: 'Trend Analyzer', desc: 'Real-time trending topics and sounds surfaced for your niche. Never miss a viral moment.', badge: null, href: '/features/analyze', cta: 'Open analytics workflow' },
];

const TOOL_DETAILS = [
  { id: 'zyx-chatbot', title: 'Zyx chatbot', desc: 'The chatbot is useful when you need strategy help, ideation support, or a faster way to turn rough concepts into structured content plans.' },
  { id: 'content-repurposer', title: 'Content repurposer', desc: 'Repurposing tools help one strong idea become multiple platform-ready outputs without rewriting everything from scratch.' },
  { id: 'bio-optimizer', title: 'Bio optimizer', desc: 'Profile bios affect conversion and discoverability. Optimizing them is a small change that can influence follower growth and click-throughs.' },
];

const HERO_STATS = [
  { icon: '⚡', title: '2-second generation', desc: 'Fast drafts for captions, hooks, scripts, and image prompts.' },
  { icon: '🧩', title: '8 creator tools', desc: 'One AI workspace for ideation, writing, visuals, and trend spotting.' },
  { icon: '🔥', title: 'Viral-first outputs', desc: 'Hooks, CTAs, and platform nuance built into each result.' },
];

const SEO_SECTIONS = [
  {
    title: 'What an AI assistant for creators should really solve',
    paragraphs: [
      'Most creators do not need more generic AI text. They need faster ways to move from idea to finished asset without losing quality. A proper AI assistant for creators should help with ideation, hooks, short-form scripting, caption writing, hashtag research, image prompt support, and repurposing. It should also understand that each platform has its own language and audience expectation. That is the difference between an AI novelty and an AI production system.',
      'Zynovexa is built around this production mindset. Instead of forcing creators to open separate tools for captions, scripts, visuals, and strategy, it brings them into one workspace. That saves time, but it also reduces inconsistency. Your messaging, offers, and brand positioning stay tighter because the same system supports the full creation flow. For search visibility, this page now speaks more directly to users looking for an AI social media assistant, caption writer, script generator, or creator copilot.',
    ],
  },
  {
    title: 'How AI improves content velocity without hurting quality',
    paragraphs: [
      'Content velocity matters because social growth usually rewards repetition, experimentation, and learning loops. But speed without structure leads to weak posts and audience fatigue. AI improves velocity when it helps teams create more variations, test more hooks, and repurpose more intelligently. A creator can start with one strong topic, then generate an Instagram caption, a TikTok script, a YouTube description, a LinkedIn angle, and a supporting hashtag set in one working session.',
      'The quality stays high when the workflow still includes intent, context, and editing. That is why Zynovexa keeps the creator in control while removing repetitive tasks. You choose the angle, tone, and objective; the AI accelerates output and variation. This makes the tool useful for growth, but it also creates better topical coverage for brands that need content across social channels, blogs, landing pages, and campaign assets.',
    ],
  },
  {
    title: 'Best use cases for an AI social media assistant',
    paragraphs: [
      'The strongest use cases include launching a content calendar faster, rebuilding consistency after a break, scaling a solo creator business, supporting agency production, and turning long-form ideas into short-form assets. Teams also use AI assistants to accelerate testing: different hooks, different CTAs, different audience angles, and different structure patterns. That kind of experimentation is usually what reveals the next growth lever.',
      'Because this page now contains deeper explanatory copy, it is better equipped to rank for long-tail searches around AI content assistant workflows and creator productivity. It also helps visitors understand where to go next inside the product, whether they want the free caption generator, the hashtag tool, the analytics workflow, or the publishing system. That internal path is good for both users and SEO structure.',
    ],
  },
];

export default function AIAssistantPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-20 hidden lg:block" />
        <div className="orb orb-pink w-72 h-72 top-20 -right-10 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Powered by GPT-4o · DALL-E 3
          </div>
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
          <div className="hero-panel mt-10 grid gap-3 p-4 sm:grid-cols-3 sm:p-5 text-left">
            {HERO_STATS.map(stat => (
              <div key={stat.title} className="hero-stat-chip">
                <span className="text-xl shrink-0">{stat.icon}</span>
                <div>
                  <strong>{stat.title}</strong>
                  <span>{stat.desc}</span>
                </div>
              </div>
            ))}
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
              <Link key={t.title} href={t.href} className="card card-hover interactive-card-link p-5 relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                {t.badge && (
                  <span className="absolute top-4 right-4 badge badge-purple text-xs">{t.badge}</span>
                )}
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="text-white font-semibold mb-2">{t.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                <div className="interactive-card-cta">
                  <span className="interactive-card-label">{t.cta}</span>
                  <span className="interactive-card-arrow">{t.href.startsWith('#') ? '↓' : '→'}</span>
                </div>
              </Link>
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

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid gap-5 md:grid-cols-3">
          {TOOL_DETAILS.map(item => (
            <article key={item.id} id={item.id} className="card p-6 scroll-mt-28">
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-7 text-sm sm:text-base">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">An AI assistant built for creator workflows</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">Expanded content for people searching for AI caption tools, script generators, creator copilots, and social media automation support.</p>
          </div>
          <div className="space-y-6">
            {SEO_SECTIONS.map(section => (
              <article key={section.title} className="card p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <div className="space-y-4 text-sm sm:text-base leading-8 text-slate-300">
                  {section.paragraphs.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/tools/ai-caption-generator" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">Try the caption tool</p><p className="text-slate-400 text-sm">Generate fast hooks and platform-ready captions.</p></Link>
            <Link href="/tools/hashtag-generator" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">Find better hashtags</p><p className="text-slate-400 text-sm">Get niche-targeted discovery tags in seconds.</p></Link>
            <Link href="/features/create" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">See full creation suite</p><p className="text-slate-400 text-sm">Explore the complete AI content workflow.</p></Link>
            <Link href="/features/analyze" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">Measure performance</p><p className="text-slate-400 text-sm">Track what your AI-assisted content actually improves.</p></Link>
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
