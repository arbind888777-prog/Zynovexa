import { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://zynovexa.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/signup',
          '/pricing',
          '/features',
          '/features/',
          '/channels/',
          '/solutions/',
          '/tools/',
          '/blog',
          '/blog/',
          '/templates',
          '/help',
          '/changelog',
          '/about',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard',
          '/(dashboard)',
          '/api/',
          '/create',
          '/posts',
          '/analytics',
          '/accounts',
          '/ai',
          '/video',
          '/settings',
          '/admin',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard', '/api/', '/(dashboard)'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
