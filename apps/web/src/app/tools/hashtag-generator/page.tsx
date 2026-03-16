import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import HashtagGeneratorClient from './HashtagGeneratorClient';

const APP_URL = 'https://zynovexa.com';

export const metadata: Metadata = {
  title: 'Free Hashtag Generator — Instagram, TikTok, YouTube & More | Zynovexa',
  description:
    'Find the perfect hashtags for your niche and platform. Curated hashtag sets for Instagram, TikTok, YouTube, LinkedIn and X. 100% free.',
  keywords: [
    'hashtag generator',
    'free hashtag generator',
    'instagram hashtag generator',
    'tiktok hashtag generator',
    'niche hashtag tool',
    'social media hashtags',
    'hashtag research',
  ],
  alternates: { canonical: `${APP_URL}/tools/hashtag-generator` },
  openGraph: {
    title: 'Free Hashtag Generator | Zynovexa',
    description:
      'Find the perfect hashtags to boost your reach. Curated for your niche and platform. Free, no signup.',
    url: `${APP_URL}/tools/hashtag-generator`,
    type: 'website',
    siteName: 'Zynovexa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Hashtag Generator | Zynovexa',
    description:
      'Curated hashtag sets for Instagram, TikTok, YouTube, LinkedIn & more. Free hashtag research tool.',
  },
};

const SEO_SECTIONS = [
  {
    title: 'Why hashtags still matter for discovery',
    paragraphs: [
      'Hashtags are no longer the only discovery lever, but they still help content platforms understand context, niche relevance, and audience signals. The best hashtag strategy is not about stuffing 30 random tags under every post. It is about combining broad category tags, niche tags, and intent-rich tags that match the actual topic of the post. That mix helps content reach more qualified viewers instead of only chasing empty impressions.',
      'A good hashtag generator speeds up that process by removing guesswork. Instead of manually researching tags every time you publish, creators can start with a curated set that reflects their niche and platform. This page is now built to serve both users and search engines by pairing the interactive tool with educational content about discovery, reach, and smarter hashtag selection.',
    ],
  },
  {
    title: 'How to choose better hashtags for Instagram, TikTok, and YouTube',
    paragraphs: [
      'The strongest hashtag sets usually include three layers. First, a few broad tags describe the market, such as fitness, fashion, tech, or business. Second, niche tags narrow the audience, such as strength training, sustainable fashion, SaaS growth, or creator education. Third, contextual tags connect the post to a specific moment, campaign, offer, or format. This layered method creates better targeting than repeating the same viral tags on every post.',
      'Platform context matters too. Instagram often rewards a well-balanced set of relevant tags. TikTok depends more heavily on content quality and watch behavior, but hashtags still support context and trend alignment. YouTube uses metadata differently, yet strategic tags can still support organization and discoverability. That is why a flexible hashtag tool is more useful than a one-size-fits-all tag list.',
    ],
  },
  {
    title: 'What makes this hashtag generator more SEO-friendly',
    paragraphs: [
      'Search-friendly tool pages need more than an input and output box. They need useful explanations, structured headings, internal linking, and content that answers adjacent questions. By adding long-form guidance, this page can now better support search intent around free hashtag generator, Instagram hashtag tool, TikTok hashtag ideas, and niche hashtag research for creators and brands.',
      'The content also connects naturally to adjacent pages inside Zynovexa, including AI caption generation, content creation, scheduling, and analytics. That internal linking matters because it helps users discover the full workflow while helping search engines understand how the site covers the broader topic of social media growth. In practical terms, this page now works harder as both a tool and a landing page.',
    ],
  },
];

const FAQS = [
  {
    q: 'How many hashtags should I use?',
    a: 'There is no universal number. The right count depends on platform and post quality, but relevance matters more than volume. A smaller, tighter set of targeted hashtags often performs better than a large list of unrelated ones.',
  },
  {
    q: 'Do hashtags help on TikTok?',
    a: 'Yes, but they are only one part of the system. TikTok still cares more about the strength of the hook, watch time, replays, shares, and engagement. Hashtags help by giving the algorithm clearer context about the post.',
  },
  {
    q: 'Should I reuse the same hashtags every time?',
    a: 'Not usually. It is better to keep a few stable niche tags and rotate the rest based on the exact topic, campaign angle, or content format. That gives each post a better contextual fit.',
  },
];

function JsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Zynovexa Hashtag Generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `${APP_URL}/tools/hashtag-generator`,
    description: 'Free hashtag generator for Instagram, TikTok, YouTube, LinkedIn and X. Curated niche hashtag sets.',
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </>
  );
}

export default function HashtagGeneratorPage() {
  return (
    <MarketingLayout>
      <JsonLd />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-pink w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🆓 Free Tool</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            Hashtag<br /><span className="gradient-text">Generator</span>
          </h1>
          <p className="text-slate-400 text-xl">Find the perfect hashtags to boost your reach. Curated for your niche and platform.</p>
        </div>
      </section>

      {/* Interactive tool (client component) */}
      <HashtagGeneratorClient />

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Smarter hashtag research for modern social growth</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">Helpful content for visitors searching for a free hashtag generator, Instagram hashtag strategy, or niche discovery tags.</p>
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
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-black text-white mb-6">FAQ: Hashtag strategy</h2>
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
              <h2 className="text-xl font-bold text-white mb-4">Related tools and pages</h2>
              <div className="space-y-3 text-sm">
                <Link href="/tools/ai-caption-generator" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">AI Caption Generator</span><span className="interactive-card-arrow">→</span></Link>
                <Link href="/features/create" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">AI Creation Suite</span><span className="interactive-card-arrow">→</span></Link>
                <Link href="/features/publish" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">Publish & Schedule</span><span className="interactive-card-arrow">→</span></Link>
                <Link href="/signup" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">Start Free in Zynovexa</span><span className="interactive-card-arrow">→</span></Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Upsell */}
      <section className="py-16 px-4 sm:px-6 text-center" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-3">Want AI-optimised hashtags with every post?</h2>
          <p className="text-slate-400 mb-6 text-sm">Zynovexa automatically suggests the best hashtags when you write your posts. No more manual research.</p>
          <Link href="/signup" className="btn btn-primary">Try Zynovexa Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
