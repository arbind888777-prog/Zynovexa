import type { Metadata } from 'next';
import ChannelPageTemplate from '@/components/ChannelPageTemplate';

export const metadata: Metadata = {
  title: 'Instagram Scheduler & Analytics — Grow Your Instagram | Zynovexa',
  description: 'Schedule Instagram posts, Reels, and Stories. AI captions, hashtag generator, engagement analytics, and best time to post. Grow your Instagram faster.',
  alternates: { canonical: 'https://zynovexa.com/channels/instagram' },
};

export default function InstagramPage() {
  return (
    <ChannelPageTemplate
      icon="📸"
      platform="Instagram"
      tagline="Schedule posts, Reels & Stories. Grow faster on Instagram."
      description="Manage your entire Instagram presence from one AI-powered platform. Auto-schedule feed posts, Reels, and Stories, generate viral captions and hashtags, and track your growth in real time."
      color="#e1306c"
      stats={[['Auto-post','Reels & Feed'],['AI hashtags','30 per post'],['1-year','Analytics history'],['Best time','AI-optimized']]}
      features={[
        { icon: '📸', title: 'Feed Post Scheduling', desc: 'Auto-publish photos and carousels at AI-determined optimal times for maximum reach.' },
        { icon: '🎬', title: 'Reels Scheduling', desc: 'Schedule Reels with auto-preview, video trim, and platform-optimized caption formatting.' },
        { icon: '📱', title: 'Stories Reminders', desc: 'Mobile push notifications when it\'s time to post Stories that require manual publishing.' },
        { icon: '🎨', title: 'AI Captions for Instagram', desc: 'Generate platform-perfect captions with hooks, emojis, and CTAs tuned for Instagram\'s algorithm.' },
        { icon: '#️⃣', title: 'Hashtag Research', desc: '30 Instagram hashtags mixing trending, niche, and micro tags for maximum discoverability.' },
        { icon: '📊', title: 'Instagram Analytics', desc: 'Follower growth, reach, impressions, engagement rate, profile visits, and link-in-bio clicks.' },
      ]}
      tips={[
        'Post Reels 4-5x per week — they get 22% more reach than standard posts in 2025.',
        'Use 3-5 niche hashtags instead of 30 generic ones for better algorithm targeting.',
        'The first 3 lines of your caption are crucial — use a strong hook to prevent the fold.',
        'Post carousels for education content — they get 3x more saves than single images.',
        'Reply to every comment within the first hour to boost your engagement score.',
      ]}
    />
  );
}
