import { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/public-env';

const APP_URL = getPublicSiteUrl();

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
          '/contact',
          '/privacy',
          '/terms',
          '/refund-policy',
          '/return-policy',
          '/disclaimer',
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
