import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sitemap — Zynovexa',
  description:
    'Browse all pages on Zynovexa including features, tools, channels, solutions, resources, legal policies, and support pages.',
  alternates: { canonical: 'https://zynovexa.com/sitemap-page' },
};

const SECTIONS = [
  {
    heading: 'Core',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Login', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
    ],
  },
  {
    heading: 'Features',
    links: [
      { label: 'All Features', href: '/features' },
      { label: 'Create Content', href: '/features/create' },
      { label: 'Publish & Schedule', href: '/features/publish' },
      { label: 'AI Assistant', href: '/features/ai-assistant' },
      { label: 'Analytics', href: '/features/analyze' },
      { label: 'Collaborate', href: '/features/collaborate' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Start Page', href: '/tools/start-page' },
      { label: 'AI Caption Generator', href: '/tools/ai-caption-generator' },
      { label: 'Hashtag Generator', href: '/tools/hashtag-generator' },
      { label: 'Free Marketing Tools', href: '/free-marketing-tools' },
      { label: 'Integrations', href: '/tools/integrations' },
    ],
  },
  {
    heading: 'Channels',
    links: [
      { label: 'Instagram', href: '/channels/instagram' },
      { label: 'TikTok', href: '/channels/tiktok' },
      { label: 'YouTube', href: '/channels/youtube' },
      { label: 'Twitter / X', href: '/channels/twitter' },
      { label: 'LinkedIn', href: '/channels/linkedin' },
      { label: 'Facebook', href: '/channels/facebook' },
      { label: 'Google Business Profile', href: '/channels/google-business-profile' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Creators', href: '/solutions/creators' },
      { label: 'Small Business', href: '/solutions/small-business' },
      { label: 'Agencies', href: '/solutions/agencies' },
      { label: 'Nonprofits', href: '/solutions/nonprofits' },
      { label: 'Higher Education', href: '/solutions/higher-education' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Social Media Insights', href: '/blog/social-media-insights' },
      { label: 'Social Media Glossary', href: '/blog/social-media-glossary' },
      { label: 'Resource Library', href: '/resource-library' },
      { label: 'Template Library', href: '/templates' },
      { label: 'Community', href: '/community' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    heading: 'Compare',
    links: [
      { label: 'All Comparisons', href: '/compare' },
      { label: 'vs Gudsho', href: '/compare/gudsho-alternative' },
      { label: 'vs Buffer', href: '/compare/buffer-alternative' },
      { label: 'vs Hootsuite', href: '/compare/hootsuite-alternative' },
      { label: 'vs Later', href: '/compare/later-alternative' },
      { label: 'vs Sprout Social', href: '/compare/sprout-social-alternative' },
      { label: 'vs SocialBee', href: '/compare/socialbee-alternative' },
      { label: 'vs Planable', href: '/compare/planable-alternative' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partner Program', href: '/partner-program' },
      { label: 'Legal', href: '/legal' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Return Policy', href: '/return-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Cookie Policy', href: '/legal/cookies' },
      { label: 'GDPR Notice', href: '/legal/gdpr' },
      { label: 'Data Processing Agreement', href: '/legal/dpa' },
      { label: 'Copyright Policy', href: '/legal/copyright' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Request a Feature', href: '/request-feature' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'System Status', href: '/status' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">Sitemap</h1>
            <p className="text-slate-400 text-lg">Browse all pages on Zynovexa</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SECTIONS.map(section => (
              <div key={section.heading} className="card p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider gradient-text mb-4">{section.heading}</h2>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
