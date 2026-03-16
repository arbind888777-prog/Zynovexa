import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Content with AI | Zynovexa',
  description: 'Create stunning social media content in seconds with Zynovexa\'s AI-powered creation tools. Captions, scripts, images, hashtags and more.',
};

const TOOLS = [
  { icon: '✍️', title: 'AI Caption Writer', desc: 'Generate scroll-stopping captions for any platform. Just describe your post and let AI do the rest.', badge: 'Most Popular', href: '/tools/ai-caption-generator', cta: 'Open caption tool' },
  { icon: '🎬', title: 'Video Script Generator', desc: 'Full YouTube/TikTok scripts with hooks, body, CTA — tailored to your niche and style.', badge: null, href: '/features/ai-assistant', cta: 'See AI assistant' },
  { icon: '#️⃣', title: 'Hashtag Generator', desc: 'Data-driven hashtag sets that actually reach your target audience. Up to 30 tags per post.', badge: null, href: '/tools/hashtag-generator', cta: 'Open hashtag tool' },
  { icon: '🖼️', title: 'AI Image Creator', desc: 'Generate on-brand graphics, thumbnails, and post visuals with a single text prompt.', badge: 'New', href: '/features/ai-assistant', cta: 'See image workflow' },
  { icon: '🔁', title: 'Content Repurposer', desc: 'Turn one blog post into 10 social media posts. Turn YouTube videos into Threads threads.', badge: null, href: '#content-repurposing', cta: 'Jump to repurposing' },
  { icon: '💬', title: 'Zyx AI Chatbot', desc: 'Your 24/7 content strategist. Brainstorm ideas, write bios, plan campaigns — anything.', badge: null, href: '/features/ai-assistant', cta: 'Meet the AI copilot' },
];

const FORMATS = [
  { platform: 'Instagram', formats: ['Feed posts', 'Reels captions', 'Story ideas', 'Bio writer'], href: '/channels/instagram' },
  { platform: 'TikTok', formats: ['Viral hooks', 'Video concepts', 'Sound suggestions', 'Trending sounds'], href: '/channels/tiktok' },
  { platform: 'YouTube', formats: ['Full scripts', 'Titles & descriptions', 'End-card CTAs', 'Chapter markers'], href: '/channels/youtube' },
  { platform: 'LinkedIn', formats: ['Thought leadership', 'Job posts', 'Company updates', 'Carousels'], href: '/channels/linkedin' },
  { platform: 'Twitter / X', formats: ['Tweet threads', 'Single tweets', 'Poll ideas', 'Reply templates'], href: '/channels/twitter' },
  { platform: 'Facebook', formats: ['Page posts', 'Group content', 'Event descriptions', 'Ad copy'], href: '/channels/facebook' },
];

const HERO_STATS = [
  { icon: '⚡', title: '10x faster output', desc: 'From blank page to publish-ready copy in seconds.' },
  { icon: '🧠', title: 'Multi-format AI', desc: 'Captions, scripts, hashtags, visuals, and repurposing.' },
  { icon: '🎯', title: 'Platform aware', desc: 'Built for Instagram, TikTok, YouTube, LinkedIn, and more.' },
];

const SEO_SECTIONS = [
  {
    title: 'Why creators need an AI content creation platform',
    paragraphs: [
      'Modern content teams do not struggle because they lack ideas. They struggle because every platform demands a different format, a different hook, a different publishing rhythm, and a different level of polish. A creator may need an Instagram carousel caption in the morning, a TikTok hook at lunch, and a YouTube description before the day ends. That is exactly where an AI content creation platform becomes valuable. Instead of starting from zero every time, creators can use one workflow to plan, generate, refine, and repurpose content for every channel.',
      'Zynovexa is built for that real workflow. Instead of giving you one generic AI writer, it combines an AI caption generator, script writing support, hashtag suggestions, AI image prompts, and repurposing tools in one place. This improves speed, but more importantly it improves consistency. Your voice, your message, and your publishing cadence become easier to maintain across Instagram, TikTok, YouTube, LinkedIn, Facebook, and X. That consistency is what helps creators grow reach, improve engagement, and build a recognizable brand over time.',
    ],
  },
  {
    title: 'How to create better social media content with AI',
    paragraphs: [
      'The best AI content workflow starts with a clear input, not a random prompt. High-performing creators usually begin with one simple intent: educate, entertain, convert, or start a conversation. Once that intent is clear, AI can shape the hook, structure the body, suggest a CTA, and adapt the copy for the platform. For example, short-form video scripts benefit from tight hooks and quick emotional payoff, while LinkedIn posts often need a sharper point of view and a stronger opening line. AI works best when it is used as a strategic assistant rather than an autopilot button.',
      'That is why Zynovexa focuses on practical creation tasks instead of generic text generation. You can use it to turn one raw idea into multiple assets: a short caption, a video script, a repurposed thread, a supporting visual prompt, and an optimized hashtag set. This gives you more content depth without adding more manual work. Search engines also benefit from this structure because stronger content systems usually produce clearer brand themes, better keyword alignment, and richer topical coverage across your website, blog, social posts, and landing pages.',
    ],
  },
  {
    title: 'What makes Zynovexa different for SEO and growth',
    paragraphs: [
      'Many AI tools can generate copy, but very few are designed to support long-term discoverability. Zynovexa helps creators produce content that is easier to organize around topics, easier to repurpose into search-friendly assets, and easier to connect to monetization goals. When your content engine is structured, you can turn one campaign into social posts, evergreen landing page copy, educational email content, and video scripts without losing the core message. That improves both audience retention and topical authority.',
      'If your goal is to rank for terms such as AI caption generator, social media content creation tool, TikTok script generator, or Instagram content planner, the page itself needs more than a flashy hero section. It needs useful explanation, problem-solving content, and strong internal navigation. This page now does that job more effectively while still pushing visitors toward action with links to the AI assistant, publishing workflow, and free tools inside the Zynovexa ecosystem.',
    ],
  },
];

const FAQS = [
  {
    q: 'Can AI help me create content for multiple social platforms?',
    a: 'Yes. The strongest use case for AI is adapting one core idea into multiple platform-specific formats. Zynovexa helps you reshape a topic into captions, hooks, video scripts, hashtags, and repurposed content without losing your brand voice.',
  },
  {
    q: 'Is AI-generated content good for creator SEO?',
    a: 'It can be, if it is edited with real intent and paired with a clear content strategy. Search-friendly content still needs expertise, clarity, useful information, and internal linking. AI speeds up production, but strategy and structure create the SEO value.',
  },
  {
    q: 'What type of creators benefit most from an AI creation workflow?',
    a: 'Solo creators, agencies, small teams, coaches, educators, ecommerce brands, and media-first startups all benefit because they need to publish frequently while keeping quality high across several channels.',
  },
];

export default function CreatePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="orb orb-pink w-80 h-80 top-20 -right-16 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-4 text-sm px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Creation
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Create content<br /><span className="gradient-text">10× faster</span>
          </h1>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            Stop staring at a blank screen. Zynovexa's AI creates high-performing content for every platform, every format, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Start Creating Free</Link>
            <Link href="/tools/ai-caption-generator" className="btn btn-secondary btn-xl">Try Caption Generator →</Link>
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

      {/* AI Tools Grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">6 AI creation tools in one platform</h2>
            <p className="text-slate-400">Everything you need to create content that stops the scroll.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map(t => (
              <Link key={t.title} href={t.href} className="card card-hover interactive-card-link p-6 relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                {t.badge && (
                  <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: t.badge === 'New' ? 'rgba(168,85,247,0.2)' : 'rgba(99,102,241,0.2)', color: t.badge === 'New' ? '#c084fc' : '#a5b4fc' }}>
                    {t.badge}
                  </span>
                )}
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{t.title}</h3>
                <p className="text-sm text-slate-400">{t.desc}</p>
                <div className="interactive-card-cta">
                  <span className="interactive-card-label">{t.cta}</span>
                  <span className="interactive-card-arrow">{t.href.startsWith('#') ? '↓' : '→'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform formats */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">Optimized for every platform</h2>
            <p className="text-slate-400">Each piece of content is crafted with platform-specific best practices built in.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORMATS.map(f => (
              <Link key={f.platform} href={f.href} className="card p-6 block card-hover interactive-card-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                <h3 className="text-white font-bold mb-3">{f.platform}</h3>
                <ul className="space-y-2">
                  {f.formats.map(fmt => (
                    <li key={fmt} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-green-400">✓</span> {fmt}
                    </li>
                  ))}
                </ul>
                <div className="interactive-card-cta">
                  <span className="interactive-card-label">Open {f.platform} guide</span>
                  <span className="interactive-card-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="content-repurposing" className="py-16 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto card p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Content repurposing should be clickable because it is a workflow, not a label</h2>
          <p className="text-slate-400 leading-8 text-sm sm:text-base mb-6">When a creator clicks a card like Content Repurposer, they expect the next layer of detail. That may be a dedicated tool page, or at minimum a focused section explaining how one idea becomes many platform-ready assets. This anchor section gives that continuation instead of leaving the card as a dead visual tile.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/features/ai-assistant" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">AI Assistant</p><p className="text-slate-400 text-sm">See broader repurposing support inside the AI workflow.</p></Link>
            <Link href="/features/publish" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">Schedule repurposed content</p><p className="text-slate-400 text-sm">Move new variants into a real posting calendar.</p></Link>
            <Link href="/tools/ai-caption-generator" className="card card-hover p-5 text-left"><p className="text-white font-semibold mb-1">Generate fresh captions</p><p className="text-slate-400 text-sm">Turn one concept into multiple caption angles fast.</p></Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">AI content creation that ranks, converts, and scales</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">This page is designed to explain how a serious creator content workflow actually works, not just list features.</p>
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
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Frequently asked questions about AI content creation</h2>
            <div className="space-y-5">
              {FAQS.map(item => (
                <div key={item.q} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-slate-400 leading-7 text-sm sm:text-base">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">Explore related pages</h2>
            <div className="space-y-3 text-sm">
              <Link href="/features/ai-assistant" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">AI Assistant <span>→</span></Link>
              <Link href="/features/publish" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">Publish & Schedule <span>→</span></Link>
              <Link href="/tools/ai-caption-generator" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">Free AI Caption Generator <span>→</span></Link>
              <Link href="/tools/hashtag-generator" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">Free Hashtag Generator <span>→</span></Link>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">Ready to create your next viral post?</h2>
          <p className="text-slate-400 mb-8">Join 50,000+ creators who use Zynovexa to create content faster and smarter.</p>
          <Link href="/signup" className="btn btn-primary btn-xl">Get Started Free — No Credit Card</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
