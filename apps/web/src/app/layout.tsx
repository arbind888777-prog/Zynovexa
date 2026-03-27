import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/providers';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://zynovexa.com';

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Zynovexa — AI Social Media Manager for Creators',
    template: '%s | Zynovexa',
  },
  description:
    'Zynovexa is the #1 AI-powered social media management platform for creators. Schedule posts, generate viral captions, track analytics, and grow across Instagram, YouTube, TikTok, Twitter, LinkedIn & more — all in one place.',
  keywords: [
    'AI social media manager',
    'social media scheduler',
    'AI content generator for creators',
    'Instagram scheduler',
    'TikTok scheduler',
    'YouTube content planner',
    'viral caption generator',
    'AI hashtag generator',
    'creator tool',
    'influencer marketing platform',
    'social media analytics',
    'content creation AI',
    'post scheduler',
    'Zynovexa',
  ],
  authors: [{ name: 'Zynovexa', url: APP_URL }],
  creator: 'Zynovexa',
  publisher: 'Zynovexa',
  category: 'Technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Zynovexa',
    title: 'Zynovexa — AI Social Media Manager for Creators',
    description:
      'Schedule posts, generate viral AI content, and grow your audience across 7 platforms. Join 50,000+ creators using Zynovexa.',
    images: [
      {
        url: `${APP_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Zynovexa — AI Social Media Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zynovexa — AI Social Media Manager for Creators',
    description:
      'Schedule posts, generate viral AI content, and grow your audience across 7 platforms. Join 50,000+ creators.',
    images: [`${APP_URL}/og-image.svg`],
    creator: '@zynovexa',
    site: '@zynovexa',
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    // Add your Google Search Console verification token here
    // google: 'your-google-verification-token',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${APP_URL}/#organization`,
      name: 'Zynovexa',
      url: APP_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/logo.svg`,
      },
      sameAs: [
        'https://twitter.com/zynovexa',
        'https://instagram.com/zynovexa',
        'https://linkedin.com/company/zynovexa',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      url: APP_URL,
      name: 'Zynovexa',
      description: 'AI-powered social media management platform for creators',
      publisher: { '@id': `${APP_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${APP_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Zynovexa',
      operatingSystem: 'Web',
      applicationCategory: 'BusinessApplication',
      offers: [
        { '@type': 'Offer', name: 'Free Plan', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Starter Plan', price: '5', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro Plan', price: '9', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Growth Plan', price: '19', priceCurrency: 'USD' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '2840',
        bestRating: '5',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('zynovexa-theme');var c=document.documentElement.classList;if(t==='light'){c.add('light')}else{c.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body style={{ background: '#06061a', color: '#e2e8f0', fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-semibold" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          Skip to content
        </a>
        <Providers><main id="main-content">{children}</main></Providers>
      </body>
    </html>
  );
}
