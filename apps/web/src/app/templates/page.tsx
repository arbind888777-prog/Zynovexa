import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import UseTemplateButton from '@/components/UseTemplateButton';

export const metadata: Metadata = {
  title: 'Social Media Templates — 500+ Free Templates | Zynovexa',
  description: '500+ free social media post templates for Instagram, YouTube, LinkedIn, and more. Ready-to-use captions, scripts, and content frameworks.',
  alternates: { canonical: 'https://zynovexa.com/templates' },
};

const TEMPLATE_CATEGORIES = [
  {
    icon: '📸',
    platform: 'Instagram',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    templates: [
      { title: 'Product Showcase Caption', tags: ['Sales', 'Business'] },
      { title: 'Motivational Quote Post', tags: ['Engagement', 'Personal Brand'] },
      { title: 'Behind the Scenes Story', tags: ['Authenticity', 'Creator'] },
      { title: 'Tutorial Carousel Script', tags: ['Education', 'Value'] },
      { title: 'Giveaway Announcement', tags: ['Growth', 'Engagement'] },
    ],
  },
  {
    icon: '🎵',
    platform: 'YouTube Shorts',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    templates: [
      { title: 'Trending Sound Hook Script', tags: ['Viral', 'Entertainment'] },
      { title: 'Day in My Life Voiceover', tags: ['Lifestyle', 'Creator'] },
      { title: 'Product Review Script', tags: ['Reviews', 'Business'] },
      { title: 'Educational How-To Script', tags: ['Education', 'Value'] },
      { title: 'Story Time Script', tags: ['Storytelling', 'Entertainment'] },
    ],
  },
  {
    icon: '▶️',
    platform: 'YouTube',
    color: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
    templates: [
      { title: 'YouTube Video Intro Script', tags: ['Hook', 'Retention'] },
      { title: 'Tutorial Video Framework', tags: ['Education', 'SEO'] },
      { title: 'Opinion/Review Body Script', tags: ['Reviews', 'Authority'] },
      { title: 'Community Post Engagement', tags: ['Subscribers', 'Engagement'] },
      { title: 'Video Description SEO', tags: ['Search', 'Discoverability'] },
    ],
  },
  {
    icon: '💼',
    platform: 'LinkedIn',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    templates: [
      { title: 'Thought Leadership Post', tags: ['Authority', 'B2B'] },
      { title: 'Personal Story Post', tags: ['Authentic', 'Engagement'] },
      { title: 'Listicle Thread', tags: ['Value', 'Viral'] },
      { title: 'Company Update Post', tags: ['Brand', 'Business'] },
      { title: 'Achievement Announcement', tags: ['Milestone', 'Personal Brand'] },
    ],
  },
  {
    icon: '𝕏',
    platform: 'Twitter / X',
    color: 'from-slate-500/20 to-zinc-500/20',
    border: 'border-slate-500/30',
    templates: [
      { title: 'Viral Thread Framework', tags: ['Threads', 'Reach'] },
      { title: 'Hot Take Tweet', tags: ['Engagement', 'Controversial'] },
      { title: 'Value-Dense Tweet', tags: ['Authority', 'Saves'] },
      { title: 'Question for Engagement', tags: ['Replies', 'Reach'] },
    ],
  },
];

export default function TemplatesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-15 hidden lg:block" />
        <div className="max-w-3xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">📚 Template Library</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            <span className="gradient-text">500+ templates</span> for every platform
          </h1>
          <p className="text-slate-400 text-lg mb-6">Ready-to-use captions, scripts, and content frameworks. Pick one, customize with AI, and post.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Unlock All Templates</Link>
        </div>
      </section>

      {/* Template categories */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {TEMPLATE_CATEGORIES.map(cat => (
            <div key={cat.platform}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h2 className="text-xl font-bold text-white">{cat.platform} Templates</h2>
                <span className="badge badge-purple text-xs">{cat.templates.length} templates</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {cat.templates.map(t => (
                  <div key={t.title} className={`card card-hover p-5 border ${cat.border} relative overflow-hidden group`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative">
                      <p className="text-white text-sm font-medium mb-2 leading-snug">{t.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {t.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400">{tag}</span>
                        ))}
                      </div>
                      <UseTemplateButton title={t.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Unlock all 500+ templates</h2>
          <p className="text-slate-400 mb-6">Templates are available on all plans. Start free to access 50+ starter templates.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Get Started Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
