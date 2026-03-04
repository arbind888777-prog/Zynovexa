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
        url: `${APP_URL}/og-image.png`,
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
    images: [`${APP_URL}/og-image.png`],
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
        url: `${APP_URL}/logo.png`,
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
        { '@type': 'Offer', name: 'Pro Plan', price: '29', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Business Plan', price: '79', priceCurrency: 'USD' },
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
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
