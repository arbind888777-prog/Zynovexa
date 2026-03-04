import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Content with AI | Zynovexa',
  description: 'Create stunning social media content in seconds with Zynovexa\'s AI-powered creation tools. Captions, scripts, images, hashtags and more.',
};

const TOOLS = [
  { icon: '✍️', title: 'AI Caption Writer', desc: 'Generate scroll-stopping captions for any platform. Just describe your post and let AI do the rest.', badge: 'Most Popular' },
  { icon: '🎬', title: 'Video Script Generator', desc: 'Full YouTube/TikTok scripts with hooks, body, CTA — tailored to your niche and style.', badge: null },
  { icon: '#️⃣', title: 'Hashtag Generator', desc: 'Data-driven hashtag sets that actually reach your target audience. Up to 30 tags per post.', badge: null },
  { icon: '🖼️', title: 'AI Image Creator', desc: 'Generate on-brand graphics, thumbnails, and post visuals with a single text prompt.', badge: 'New' },
  { icon: '🔁', title: 'Content Repurposer', desc: 'Turn one blog post into 10 social media posts. Turn YouTube videos into Threads threads.', badge: null },
  { icon: '💬', title: 'Zyx AI Chatbot', desc: 'Your 24/7 content strategist. Brainstorm ideas, write bios, plan campaigns — anything.', badge: null },
];

const FORMATS = [
  { platform: 'Instagram', formats: ['Feed posts', 'Reels captions', 'Story ideas', 'Bio writer'] },
  { platform: 'TikTok', formats: ['Viral hooks', 'Video concepts', 'Sound suggestions', 'Trending sounds'] },
  { platform: 'YouTube', formats: ['Full scripts', 'Titles & descriptions', 'End-card CTAs', 'Chapter markers'] },
  { platform: 'LinkedIn', formats: ['Thought leadership', 'Job posts', 'Company updates', 'Carousels'] },
  { platform: 'Twitter / X', formats: ['Tweet threads', 'Single tweets', 'Poll ideas', 'Reply templates'] },
  { platform: 'Facebook', formats: ['Page posts', 'Group content', 'Event descriptions', 'Ad copy'] },
];

export default function CreatePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">✨ AI-Powered Creation</span>
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
              <div key={t.title} className="card card-hover p-6 relative">
                {t.badge && (
                  <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: t.badge === 'New' ? 'rgba(168,85,247,0.2)' : 'rgba(99,102,241,0.2)', color: t.badge === 'New' ? '#c084fc' : '#a5b4fc' }}>
                    {t.badge}
                  </span>
                )}
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{t.title}</h3>
                <p className="text-sm text-slate-400">{t.desc}</p>
              </div>
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
              <div key={f.platform} className="card p-6">
                <h3 className="text-white font-bold mb-3">{f.platform}</h3>
                <ul className="space-y-2">
                  {f.formats.map(fmt => (
                    <li key={fmt} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-green-400">✓</span> {fmt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
