import type { Metadata } from 'next';
import ChannelPageTemplate from '@/components/ChannelPageTemplate';

export const metadata: Metadata = {
  title: 'LinkedIn Scheduler & AI Content for Professionals | Zynovexa',
  description: 'Schedule LinkedIn posts, generate professional content with AI, grow your personal brand, and track LinkedIn analytics. Built for founders, executives, and professionals.',
  alternates: { canonical: 'https://zynovexa.com/channels/linkedin' },
};

export default function LinkedInPage() {
  return (
    <ChannelPageTemplate
      icon="💼"
      platform="LinkedIn"
      tagline="Grow your professional brand on LinkedIn with AI-powered content."
      description="LinkedIn is the #1 platform for B2B leads, personal branding, and professional growth. Zynovexa helps you post consistently with AI-crafted thought leadership content that builds authority and drives real business results."
      color="#0077b5"
      stats={[['AI content','Thought leadership'],['Post scheduler','Optimal timing'],['Analytics','Engagement track'],['B2B leads','Content strategy']]}
      features={[
        { icon: '💡', title: 'Thought Leadership Posts', desc: 'AI generates authoritative, insight-packed LinkedIn posts that position you as an industry expert.' },
        { icon: '📊', title: 'Carousel Post Creator', desc: 'Create LinkedIn document carousels — the format with the highest organic reach on the platform.' },
        { icon: '📅', title: 'LinkedIn Scheduler', desc: 'Schedule posts at peak professional hours. AI identifies when your connections are most active.' },
        { icon: '📈', title: 'LinkedIn Analytics', desc: 'Impressions, clicks, reactions, comments, shares, follower growth, and post-level performance data.' },
        { icon: '🎯', title: 'Audience Targeting Content', desc: 'AI tailors your content style based on whether you\'re targeting founders, executives, HR, developers, or marketers.' },
        { icon: '♻️', title: 'Content Repurposing', desc: 'Convert podcast episodes, blog posts, and YouTube videos into LinkedIn-native posts and carousels.' },
      ]}
      tips={[
        'Personal profiles get 10x more reach than company pages — build your personal brand first.',
        'Start posts with a line that creates curiosity or controversy to trigger the "see more" click.',
        'Post 3-5 times per week. Consistency is more important than perfection on LinkedIn.',
        'Document (carousel) posts currently have the highest organic reach of any LinkedIn format.',
        'Engage with comments within the first 60 minutes to boost algorithm distribution.',
      ]}
    />
  );
}
