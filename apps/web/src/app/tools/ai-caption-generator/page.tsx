import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import CaptionGeneratorClient from './CaptionGeneratorClient';

const APP_URL = 'https://zynovexa.com';

export const metadata: Metadata = {
  title: 'Free AI Caption Generator — Instagram, YouTube & More | Zynovexa',
  description:
    'Generate scroll-stopping social media captions for Instagram, LinkedIn, YouTube, Facebook and X. AI-powered, 100% free. No signup required.',
  keywords: [
    'ai caption generator',
    'free caption generator',
    'instagram caption generator',
    'social media caption tool',
    'ai caption writer',
    'caption ideas for creators',
  ],
  alternates: { canonical: `${APP_URL}/tools/ai-caption-generator` },
  openGraph: {
    title: 'Free AI Caption Generator | Zynovexa',
    description:
      'Generate viral captions for Instagram, YouTube, LinkedIn & more. Powered by AI. 100% free.',
    url: `${APP_URL}/tools/ai-caption-generator`,
    type: 'website',
    siteName: 'Zynovexa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Caption Generator | Zynovexa',
    description:
      'Generate scroll-stopping captions for any social platform. AI-powered, free, no signup.',
  },
};

const SEO_SECTIONS = [
  {
    title: 'What makes a strong AI caption generator useful',
    paragraphs: [
      'A useful AI caption generator does more than rewrite a sentence with emojis. It helps creators find a stronger hook, a clearer message, a better CTA, and a style that fits the platform. Instagram captions often need story and emotion. LinkedIn copy usually needs a sharper point of view. A good generator understands that context and produces copy that feels native instead of robotic.',
      'This free tool is designed as a fast starting point for that workflow. It gives creators a practical way to test ideas, explore tones, and move from a blank screen to usable copy quickly. That matters for SEO as well because users searching for free AI caption generator or Instagram caption generator are usually looking for a working tool plus clear guidance on how to use it effectively. This page now serves both needs.',
    ],
  },
  {
    title: 'How to write captions that improve reach and engagement',
    paragraphs: [
      'High-performing captions usually do three things well. First, they create curiosity in the first line. Second, they reward the reader with value, story, entertainment, or clarity. Third, they tell the audience what to do next, whether that is save, comment, click, share, or watch to the end. Most underperforming captions fail because they are too generic or because they bury the best idea in the middle of the copy.',
      'The fastest improvement is to start with one outcome. Ask whether the post is supposed to teach, sell, connect, or entertain. Once that is clear, the caption becomes easier to structure. Use a stronger opening, keep the middle focused, and end with a direct action. If you want a full workflow beyond this free generator, Zynovexa also connects caption writing with content planning, scheduling, hashtag research, and performance tracking.',
    ],
  },
  {
    title: 'Why this page now supports better SEO intent',
    paragraphs: [
      'Search engines rank pages that solve the user problem more completely. A thin tool page might provide one quick action, but it often fails to explain when the tool is useful, how it should be used, and what the next logical step is. By adding educational content, keyword-aligned headings, and internal links, this page becomes more relevant for both informational and transactional searches around caption generation.',
      'That means the page can support discovery for phrases such as free AI caption generator, social media caption tool, caption ideas for creators, and Instagram caption writing assistant while still driving users into deeper product pages. This kind of structure is especially effective when paired with adjacent pages for AI creation, scheduling, analytics, and hashtag generation, because it builds stronger topical authority across the site.',
    ],
  },
];

const FAQS = [
  {
    q: 'Is this AI caption generator free to use?',
    a: 'Yes. This page is designed as a free tool so creators can quickly generate caption ideas, test tone variations, and move faster without committing to a full workflow immediately.',
  },
  {
    q: 'Which platforms is this caption generator best for?',
    a: 'It is useful for Instagram, LinkedIn, Facebook, YouTube, and X. The strongest results come when you choose the platform first and adapt the hook to the audience expectation for that channel.',
  },
  {
    q: 'How do I get better results from AI captions?',
    a: 'Be specific about the topic, the audience, and the desired tone. Strong prompts produce better hooks, better structure, and more relevant CTAs. After that, edit the result to sound like your brand voice.',
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
    name: 'Zynovexa AI Caption Generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `${APP_URL}/tools/ai-caption-generator`,
    description: 'Free AI-powered caption generator for Instagram, YouTube, LinkedIn, Facebook and X.',
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </>
  );
}

export default function AICaptionGeneratorPage() {
  return (
    <MarketingLayout>
      <JsonLd />

      {/* Hero */}
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

      {/* Interactive tool (client component) */}
      <CaptionGeneratorClient />

      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Free AI caption help for creators, brands, and marketers</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">Useful content for users searching for a free AI caption generator, better caption ideas, and social media writing support.</p>
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
              <h2 className="text-2xl font-black text-white mb-6">FAQ: AI caption generator</h2>
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
              <h2 className="text-xl font-bold text-white mb-4">Go deeper</h2>
              <div className="space-y-3 text-sm">
                <Link href="/features/create" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">AI Content Creation</span><span className="interactive-card-arrow">→</span></Link>
                <Link href="/features/ai-assistant" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">AI Assistant</span><span className="interactive-card-arrow">→</span></Link>
                <Link href="/tools/hashtag-generator" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">Hashtag Generator</span><span className="interactive-card-arrow">→</span></Link>
                <Link href="/signup" className="interactive-card-link flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"><span className="interactive-card-label">Start Free in Zynovexa</span><span className="interactive-card-arrow">→</span></Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Upsell */}
      <section className="py-16 px-4 sm:px-6 text-center" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-3">Want AI captions for every post, automatically?</h2>
          <p className="text-slate-400 mb-6 text-sm">Zynovexa Pro schedules your posts AND writes your captions using AI — consistently, at scale.</p>
          <Link href="/signup" className="btn btn-primary">Try Zynovexa Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
