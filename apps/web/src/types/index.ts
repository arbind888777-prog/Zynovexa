export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'GROWTH' | 'BUSINESS';
export type Role = 'USER' | 'ADMIN';
export type Platform = 'INSTAGRAM' | 'YOUTUBE' | 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'SNAPCHAT';
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'TEXT' | 'STORY' | 'REEL' | 'SHORT';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  handle?: string;
  socialLinks?: Record<string, string>;
  role: Role;
  plan: Plan;
  isVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: Plan;
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING';
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  displayName: string;
  platformUserId?: string;
  avatarUrl?: string;
  followersCount: number;
  isActive: boolean;
}

export interface YoutubeVideoInsight {
  videoId: string;
  title: string;
  thumbnail?: string;
  publishedAt: string;
  duration?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface YoutubeInsights {
  account: SocialAccount;
  channel: {
    channelId: string;
    title: string;
    handle?: string | null;
    thumbnail?: string;
    subscriberCount: number;
    videoCount: number;
    viewCount: number;
  };
  totals: {
    totalLikes: number;
    totalComments: number;
    totalVideoViews: number;
  };
  recentVideos: YoutubeVideoInsight[];
}

export interface Post {
  id: string;
  title?: string;
  caption: string;
  mediaUrls: string[];
  mediaType: MediaType;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string;
  hashtags: string[];
  viralScore: number;
  createdAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  draftPosts: number;
  connectedAccounts: number;
  aiRequestsThisMonth: number;
  aiRequestLimit: number | null;
}

export interface AnalyticsOverview {
  totalFollowers: number;
  totalImpressions: number;
  totalEngagements: number;
  avgEngagementRate: number;
  totalPosts: number;
  publishedPosts: number;
}

export interface ChartDataPoint {
  date: string;
  impressions: number;
  engagements: number;
  reach: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// ── Account Deep Analytics ──────────────────────────────────────────────
export interface AccountInsightsResponse {
  account: SocialAccount;
  platform: string;
  analyticsAvailable: boolean;
  message?: string;
  overview: {
    channel?: {
      channelId: string;
      title: string;
      handle?: string | null;
      thumbnail?: string;
      subscriberCount: number;
      videoCount: number;
      viewCount: number;
    };
    totals?: {
      totalLikes: number;
      totalComments: number;
      totalVideoViews: number;
    };
    analytics?: {
      views: number;
      estimatedMinutesWatched: number;
      averageViewDuration: number;
      subscribersGained: number;
      subscribersLost: number;
      likes: number;
      dislikes: number;
      comments: number;
      shares: number;
    } | null;
    timeSeries: {
      date: string;
      views: number;
      estimatedMinutesWatched: number;
      subscribersGained: number;
      likes: number;
      comments: number;
    }[];
  };
  content: {
    recentVideos: YoutubeVideoInsight[];
    topVideos: {
      videoId: string;
      title?: string;
      thumbnail?: string | null;
      publishedAt?: string | null;
      views: number;
      estimatedMinutesWatched: number;
      averageViewDuration: number;
      likes: number;
      comments: number;
      shares: number;
    }[];
    trafficSources: {
      source: string;
      views: number;
      estimatedMinutesWatched: number;
    }[];
  };
  audience: {
    demographics: {
      ageGroups: { ageGroup: string; viewerPercentage: number }[];
      genderBreakdown: { gender: string; viewerPercentage: number }[];
    };
    countries: { country: string; views: number; estimatedMinutesWatched: number }[];
    devices: { device: string; views: number; estimatedMinutesWatched: number }[];
  };
}
