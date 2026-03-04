import ChannelPageTemplate from '@/components/ChannelPageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa for Google Business Profile | Schedule & Manage GBP Posts',
  description: 'Manage your Google Business Profile with Zynovexa. Schedule GBP posts, respond to reviews, and track local SEO performance — all in one dashboard.',
};

export default function GoogleBusinessProfilePage() {
  return (
    <ChannelPageTemplate
      icon="🏪"
      platform="Google Business Profile"
      color="#4285F4"
      tagline="Manage your local business presence on Google from one dashboard"
      description="Schedule Google Business Profile posts, track local SEO rankings, respond to customer reviews, and get AI-generated updates that drive foot traffic and calls."
      stats={[
        ['1B+', 'Monthly GBP searches'],
        ['76%', 'Local searches convert'],
        ['4.7×', 'More likely to be trusted'],
        ['5 min', 'To schedule a week of posts'],
      ]}
      features={[
        {
          icon: '📅',
          title: 'Schedule GBP Posts',
          desc: 'Plan and schedule your What\'s New, Offers, Events, and Product posts weeks in advance.',
        },
        {
          icon: '🤖',
          title: 'AI-Written Updates',
          desc: 'Our AI writes compelling GBP posts optimised for local search and customer engagement.',
        },
        {
          icon: '⭐',
          title: 'Review Management',
          desc: 'Get notified of new reviews and reply to them directly from your Zynovexa dashboard.',
        },
        {
          icon: '📊',
          title: 'Local Insights',
          desc: 'Track searches, views, calls, and direction requests. See exactly how customers find you.',
        },
        {
          icon: '🏷️',
          title: 'Offer & Event Posts',
          desc: 'Promote your special offers and events on Google Search and Maps with rich, formatted posts.',
        },
        {
          icon: '📸',
          title: 'Photo Management',
          desc: 'Upload and manage your business photos to attract more local customers browsing Google Maps.',
        },
      ]}
      tips={[
        'Post to Google Business Profile at least 2-3 times per week — businesses that post regularly receive 7× more engagement.',
        'Include your phone number and a CTA like "Call Now" or "Book Online" in every GBP post to drive direct actions.',
        'Respond to every Google review within 24 hours — this significantly boosts your local search ranking.',
        'Use Zynovexa\'s AI to create GBP posts that include local keywords like your city name and neighbourhood.',
        'Upload high-quality interior and exterior photos. Businesses with 100+ photos get 520% more calls than those with fewer.',
        'Schedule seasonal offers and event posts in advance so you\'re always showing fresh content on Google.',
      ]}
    />
  );
}
