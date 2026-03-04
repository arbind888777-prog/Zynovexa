import type { Metadata } from 'next';
import ChannelPageTemplate from '@/components/ChannelPageTemplate';

export const metadata: Metadata = {
  title: 'YouTube Scheduler & Script Generator | Zynovexa',
  description: 'Plan and schedule YouTube videos, generate AI scripts and titles, optimize descriptions for SEO, and track YouTube analytics. Grow your YouTube channel faster.',
  alternates: { canonical: 'https://zynovexa.com/channels/youtube' },
};

export default function YouTubePage() {
  return (
    <ChannelPageTemplate
      icon="▶️"
      platform="YouTube"
      tagline="AI scripts, SEO titles, and YouTube scheduling. Grow your channel."
      description="YouTube rewards consistency and quality. Zynovexa helps you batch-produce AI-powered scripts, optimize titles and descriptions for search, schedule community posts, and track what drives subscriptions."
      color="#ff0000"
      stats={[['AI Scripts','Full episodes'],['SEO titles','Algorithm-ready'],['Community','Post scheduling'],['Analytics','Channel growth']]}
      features={[
        { icon: '🎬', title: 'YouTube Script Writer', desc: 'Full video scripts including intro hook, main content sections, calls to action, and outro. Structured for retention.' },
        { icon: '🔍', title: 'SEO Title & Description', desc: 'AI generates keyword-rich titles and descriptions optimized for YouTube search and suggested video algorithm.' },
        { icon: '📌', title: 'Community Post Scheduler', desc: 'Schedule polls, images, and text community posts to keep subscribers engaged between video uploads.' },
        { icon: '📊', title: 'YouTube Analytics', desc: 'Views, watch time, subscribers gained/lost, revenue estimates, CTR, and audience retention graphs.' },
        { icon: '🖼️', title: 'Thumbnail Concepts', desc: 'AI generates thumbnail concepts and text overlay suggestions based on your target keyword and video topic.' },
        { icon: '🔔', title: 'Upload Strategy', desc: 'AI recommends ideal upload schedule, frequency, and the best day/time based on your subscriber analytics.' },
      ]}
      tips={[
        'Your title should include a target search term AND be emotionally compelling — not just clickbait.',
        'The first 30 seconds of a video determine if it will be recommended. Start with the payoff.',
        'Upload consistently on the same days each week — YouTube rewards predictable upload schedules.',
        'Use chapters (timestamps) in descriptions — they improve Watch Time by 15-20% on average.',
        'Shorts that funnel to long-form content can grow your channel 3x faster in 2025.',
      ]}
    />
  );
}
