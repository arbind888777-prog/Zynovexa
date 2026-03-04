import type { Metadata } from 'next';
import ChannelPageTemplate from '@/components/ChannelPageTemplate';

export const metadata: Metadata = {
  title: 'Facebook Scheduler & Page Management | Zynovexa',
  description: 'Schedule Facebook posts, manage your Facebook Page, generate AI content, and track Page analytics. Grow your Facebook audience with Zynovexa.',
  alternates: { canonical: 'https://zynovexa.com/channels/facebook' },
};

export default function FacebookPage() {
  return (
    <ChannelPageTemplate
      icon="📘"
      platform="Facebook"
      tagline="Schedule Facebook posts, manage your Page, and grow your audience."
      description="Despite being one of the oldest networks, Facebook still drives massive reach — especially for local businesses, communities, and events. Zynovexa's tools help you stay active, consistent, and growing on Facebook."
      color="#1877f2"
      stats={[['Auto-publish','Posts & Stories'],['Page analytics','Full metrics'],['AI captions','Engagement-tuned'],['Event posts','Scheduling']]}
      features={[
        { icon: '📝', title: 'Facebook Post Scheduling', desc: 'Schedule text, photo, video, and link posts to your Facebook Page and Groups with auto-publishing.' },
        { icon: '📣', title: 'Facebook Stories', desc: 'Schedule Facebook Stories alongside your feed posts for complete social coverage.' },
        { icon: '📊', title: 'Page Analytics', desc: 'Reach, impressions, engagement, page likes, video views, and post-level performance tracking.' },
        { icon: '🤖', title: 'AI Facebook Captions', desc: 'Captions written for Facebook\'s audience and algorithm — more conversational, community-focused, and engaging.' },
        { icon: '🎯', title: 'Audience Insights', desc: 'See demographic data, peak activity times, and content preferences for your specific Page audience.' },
        { icon: '🏪', title: 'Local Business Tools', desc: 'Templates and AI content specifically designed for local businesses — events, promos, and community posts.' },
      ]}
      tips={[
        'Videos (especially native uploads) get 5x the reach of external links on Facebook.',
        'Ask questions in your captions — posts with questions generate 3x more comments.',
        'Post at 1-3PM on weekdays for maximum Facebook reach with most audiences.',
        'Facebook Groups have higher organic reach than Pages — create a community around your brand.',
        'Live videos get 6x more engagement than regular videos on Facebook.',
      ]}
    />
  );
}
