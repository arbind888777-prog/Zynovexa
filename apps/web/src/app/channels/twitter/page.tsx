import type { Metadata } from 'next';
import ChannelPageTemplate from '@/components/ChannelPageTemplate';

export const metadata: Metadata = {
  title: 'Twitter / X Scheduler & Thread Generator | Zynovexa',
  description: 'Schedule tweets and threads on Twitter/X, generate viral thread content with AI, track engagement analytics, and grow your X following. Start free.',
  alternates: { canonical: 'https://zynovexa.com/channels/twitter' },
};

export default function TwitterPage() {
  return (
    <ChannelPageTemplate
      icon="𝕏"
      platform="Twitter / X"
      tagline="Schedule tweets, generate viral threads, grow your X following."
      description="Twitter/X rewards volume, consistency, and sharp thinking. Zynovexa helps you schedule tweets, write viral thread content with AI, repurpose your long-form content into threads, and track performance."
      color="#1da1f2"
      stats={[['Thread AI','Viral-optimized'],['Tweet queue','Auto-scheduler'],['Analytics','Full metrics'],['Repurpose','Blog→Thread']]}
      features={[
        { icon: '🧵', title: 'Thread Generator', desc: 'Turn any idea, blog post, or YouTube video into an engaging Twitter thread with AI. Hook to CTA in seconds.' },
        { icon: '📅', title: 'Tweet Scheduler', desc: 'Queue tweets and threads for optimal posting times. Best time AI uses your personal follower activity data.' },
        { icon: '♻️', title: 'Evergreen Recycling', desc: 'Your best-performing tweets automatically re-queue after a set period to maximise their reach.' },
        { icon: '📊', title: 'X Analytics', desc: 'Impressions, engagements, link clicks, replies, retweets, profile visits, follower growth, and chart breakdowns.' },
        { icon: '🔄', title: 'Content Repurposing', desc: 'Convert blog posts, YouTube scripts, and LinkedIn articles into Twitter-native threads automatically.' },
        { icon: '💬', title: 'Reply Suggestions', desc: 'AI generates thoughtful, on-brand replies to trending tweets in your niche to boost your visibility.' },
      ]}
      tips={[
        'Threads with 5-10 tweets get 3x more impressions than single tweets on most topics.',
        'Tweet between 8-10AM in your target timezone for maximum morning-scroll engagement.',
        'The first tweet of a thread must promise extreme value — treat it like a landing page headline.',
        'Reply to accounts bigger than you in your niche every day to get discovered by their audience.',
        'Images and charts in tweets get 150% more engagement than text-only posts.',
      ]}
    />
  );
}
