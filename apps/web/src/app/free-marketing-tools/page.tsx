import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Marketing Tools | Zynovexa',
  description: 'Browse all of Zynovexa\'s free marketing tools — AI caption generator, hashtag generator, link-in-bio builder, and more.',
};

const TOOLS = [
  {
    icon: '✍️',
    name: 'AI Caption Generator',
    desc: 'Generate scroll-stopping captions for Instagram, TikTok, LinkedIn, and more in seconds.',
    href: '/tools/ai-caption-generator',
    tag: 'AI',
    popular: true,
  },
  {
    icon: '#',
    name: 'Hashtag Generator',
    desc: 'Find the most effective hashtags for your niche and platform to maximise discoverability.',
    href: '/tools/hashtag-generator',
    tag: 'Growth',
    popular: true,
  },
  {
    icon: '🔗',
    name: 'Start Page (Link-in-Bio)',
    desc: 'Create a beautiful, branded link-in-bio page. Connect unlimited links. No coding required.',
    href: '/tools/start-page',
    tag: 'Website',
    popular: false,
  },
  {
    icon: '🔌',
    name: 'Integrations Directory',
    desc: 'Browse 50+ apps and services that connect with Zynovexa for a seamless workflow.',
    href: '/tools/integrations',
    tag: 'Productivity',
    popular: false,
  },
  {
    icon: '📊',
    name: 'Analytics Benchmarks',
    desc: 'See how your engagement rate stacks up against the average for your industry and niche.',
    href: '/blog/social-media-insights',
    tag: 'Analytics',
    popular: false,
  },
  {
    icon: '📋',
    name: 'Content Calendar Template',
    desc: 'Free 30-day content calendar spreadsheet with post ideas and tracking built in.',
    href: '/resource-library',
    tag: 'Planning',
    popular: false,
  },
  {
    icon: '🎨',
    name: 'Template Library',
    desc: '500+ professionally designed templates for Reels, Stories, carousels, and more.',
    href: '/templates',
    tag: 'Design',
    popular: false,
  },
  {
    icon: '📖',
    name: 'Social Media Glossary',
    desc: 'The complete A-Z dictionary of social media terms, acronyms, and creator vocabulary.',
    href: '/blog/social-media-glossary',
    tag: 'Education',
    popular: false,
  },
];

const STATS = [
  ['8', 'Free tools'],
  ['100,000+', 'Monthly users'],
  ['0', 'Credit card required'],
  ['∞', 'Times you can use them'],
];

export default function FreeMarketingToolsPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-pink w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🆓 All Free</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Free Marketing<br /><span className="gradient-text">Tools</span>
          </h1>
          <p className="text-slate-400 text-xl mb-4 max-w-2xl mx-auto">
            Powerful tools for social media marketers and creators. No credit card. No sign-up required.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 sm:px-6 border-y" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(([v, l]) => (
            <div key={l}>
              <div className="text-3xl font-black gradient-text">{v}</div>
              <div className="text-sm text-slate-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map(tool => (
            <Link key={tool.name} href={tool.href}
              className="card card-hover p-6 flex flex-col group relative">
              {tool.popular && (
                <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>
                  Popular ✦
                </span>
              )}
              <span className="text-4xl mb-4 block">{tool.icon}</span>
              <div className="mb-1">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{tool.tag}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">{tool.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">{tool.desc}</p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                Use for free <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pro upsell */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Want to unlock the full power?</h2>
          <p className="text-slate-400 mb-6">Get all these tools built directly into your workflow. Schedule posts, track analytics, and generate content automatically — all in one place.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary">Start Free Trial</Link>
            <Link href="/pricing" className="btn btn-secondary">See Pricing</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
