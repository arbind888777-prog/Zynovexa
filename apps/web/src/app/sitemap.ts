import { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/public-env';

const APP_URL = getPublicSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const page = (path: string, priority = 0.7, freq: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly') => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  });

  return [
    // Core
    page('/', 1.0, 'weekly'),
    page('/login', 0.8, 'monthly'),
    page('/signup', 0.9, 'monthly'),
    page('/pricing', 0.9, 'monthly'),

    // Features
    page('/features', 0.9, 'monthly'),
    page('/features/publish', 0.8),
    page('/features/ai-assistant', 0.8),
    page('/features/analyze', 0.8),
    page('/features/collaborate', 0.8),

    // Channels
    page('/channels/instagram', 0.8),
    page('/channels/youtube', 0.8),
    page('/channels/twitter', 0.8),
    page('/channels/linkedin', 0.8),
    page('/channels/facebook', 0.8),

    // Solutions
    page('/solutions/creators', 0.8),
    page('/solutions/small-business', 0.8),
    page('/solutions/agencies', 0.8),
    page('/solutions/higher-education', 0.7),

    // Tools
    page('/tools/start-page', 0.7),
    page('/tools/integrations', 0.7),
    page('/tools/ai-caption-generator', 0.8, 'weekly'),
    page('/tools/hashtag-generator', 0.8, 'weekly'),
    page('/free-marketing-tools', 0.8),

    // New feature pages
    page('/features/create', 0.8),

    // New solution pages
    page('/solutions/nonprofits', 0.7),

    // New channel pages
    page('/channels/google-business-profile', 0.8),

    // Compare
    page('/compare', 0.8),
    page('/compare/gudsho-alternative', 0.8),
    page('/compare/buffer-alternative', 0.8),
    page('/compare/hootsuite-alternative', 0.8),
    page('/compare/later-alternative', 0.8),
    page('/compare/sprout-social-alternative', 0.8),
    page('/compare/socialbee-alternative', 0.7),
    page('/compare/planable-alternative', 0.7),
    page('/compare/all', 0.8),

    // Sitemap page
    page('/sitemap-page', 0.5),

    // Community & resources
    page('/community', 0.7, 'weekly'),
    page('/resource-library', 0.7),
    page('/blog/social-media-glossary', 0.7),
    page('/blog/social-media-insights', 0.7, 'weekly'),

    // Feature requests & support
    page('/request-feature', 0.6),
    page('/status', 0.6, 'daily'),

    // Company
    page('/careers', 0.7, 'weekly'),
    page('/press', 0.6),
    page('/partner-program', 0.7),
    page('/legal', 0.6, 'monthly'),

    // Resources
    page('/blog', 0.8, 'weekly'),
    page('/templates', 0.7),
    page('/help', 0.7),
    page('/changelog', 0.6, 'weekly'),

    // Blog posts
    page('/blog/instagram-reels-algorithm-2026', 0.6, 'monthly'),
    page('/blog/ai-content-creation-workflow', 0.6, 'monthly'),
    page('/blog/linkedin-personal-brand', 0.6, 'monthly'),
    page('/blog/social-media-analytics-guide', 0.6, 'monthly'),
    page('/blog/youtube-shorts-strategy', 0.6, 'monthly'),
    page('/blog/creator-monetization-2026', 0.6, 'monthly'),
    page('/blog/ai-hashtag-strategy', 0.6, 'monthly'),

    // Company
    page('/about', 0.6),
    page('/contact', 0.6, 'monthly'),
    page('/privacy', 0.5, 'yearly'),
    page('/terms', 0.5, 'yearly'),
    page('/refund-policy', 0.5, 'yearly'),
    page('/return-policy', 0.5, 'yearly'),
    page('/disclaimer', 0.5, 'yearly'),

    // Legal subpages
    page('/legal/cookies', 0.4, 'yearly'),
    page('/legal/gdpr', 0.4, 'yearly'),
    page('/legal/dpa', 0.4, 'yearly'),
    page('/legal/copyright', 0.4, 'yearly'),
  ];
}
