-- ============================================================
-- CreatorOS Database Schema
-- Production-grade D1 SQLite schema for AI Creator Platform
-- ============================================================

-- USERS: Core user identity and profile
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  password_hash TEXT DEFAULT '',
  provider TEXT DEFAULT 'email',         -- email | google
  role TEXT DEFAULT 'user',              -- user | admin
  niche TEXT DEFAULT '',                 -- creator niche category
  onboarded INTEGER DEFAULT 0,          -- 0=not complete, 1=complete
  plan TEXT DEFAULT 'free',             -- free | pro | business
  stripe_customer_id TEXT DEFAULT '',
  timezone TEXT DEFAULT 'UTC',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- SOCIAL ACCOUNTS: Connected platform accounts per user
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,                -- instagram | facebook | youtube | linkedin | twitter | tiktok
  platform_user_id TEXT DEFAULT '',
  platform_username TEXT DEFAULT '',
  access_token TEXT DEFAULT '',          -- encrypted in production
  refresh_token TEXT DEFAULT '',
  token_expires_at TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  followers_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'connected',       -- connected | disconnected | expired
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- POSTS: All content created by users
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  caption TEXT DEFAULT '',
  media_urls TEXT DEFAULT '[]',          -- JSON array of media URLs
  media_type TEXT DEFAULT 'text',        -- text | image | video | carousel
  platforms TEXT DEFAULT '[]',           -- JSON array of target platforms
  status TEXT DEFAULT 'draft',           -- draft | scheduled | publishing | published | failed
  scheduled_at TEXT DEFAULT '',
  published_at TEXT DEFAULT '',
  publish_results TEXT DEFAULT '{}',     -- JSON: per-platform publish status
  ai_generated INTEGER DEFAULT 0,
  viral_score INTEGER DEFAULT 0,         -- 0-100 AI predicted virality
  hashtags TEXT DEFAULT '[]',            -- JSON array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ANALYTICS: Per-post and per-account performance metrics
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  post_id TEXT DEFAULT '',
  account_id TEXT DEFAULT '',
  platform TEXT NOT NULL,
  metric_type TEXT NOT NULL,             -- impressions | reach | likes | comments | shares | saves | clicks | followers
  metric_value INTEGER DEFAULT 0,
  recorded_date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SCHEDULED JOBS: Queue entries for publishing engine
CREATE TABLE IF NOT EXISTS scheduled_jobs (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT DEFAULT 'pending',         -- pending | processing | completed | failed | cancelled
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT DEFAULT '',
  executed_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI REQUESTS: Track all AI usage for billing and analytics
CREATE TABLE IF NOT EXISTS ai_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  request_type TEXT NOT NULL,            -- caption | ideas | script | hashtags | growth | viral_score
  input_text TEXT DEFAULT '',
  output_text TEXT DEFAULT '',
  tokens_used INTEGER DEFAULT 0,
  model TEXT DEFAULT 'gpt-4',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SUBSCRIPTIONS: Plan management
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',          -- active | cancelled | past_due | trialing
  current_period_start TEXT DEFAULT '',
  current_period_end TEXT DEFAULT '',
  stripe_subscription_id TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PAYMENTS: Transaction history
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER DEFAULT 0,             -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'succeeded',       -- succeeded | failed | refunded
  description TEXT DEFAULT '',
  stripe_payment_id TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- BRAND DEALS: Monetization tracking
CREATE TABLE IF NOT EXISTS brand_deals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  deal_value INTEGER DEFAULT 0,         -- in cents
  currency TEXT DEFAULT 'usd',
  platform TEXT DEFAULT '',
  status TEXT DEFAULT 'negotiating',     -- negotiating | confirmed | in_progress | completed | cancelled
  deliverables TEXT DEFAULT '',
  deadline TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NOTIFICATIONS: User notification system
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  type TEXT DEFAULT 'info',              -- info | success | warning | error
  read INTEGER DEFAULT 0,
  link TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ACTIVITY LOGS: Audit trail for admin and security
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT '',
  action TEXT NOT NULL,
  resource_type TEXT DEFAULT '',
  resource_id TEXT DEFAULT '',
  details TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- MEDIA LIBRARY: Reusable media assets
CREATE TABLE IF NOT EXISTS media_library (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT DEFAULT '',
  file_type TEXT DEFAULT 'image',        -- image | video | gif
  file_size INTEGER DEFAULT 0,
  thumbnail_url TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES for query performance
CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_platform ON accounts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(recorded_date);
CREATE INDEX IF NOT EXISTS idx_analytics_post ON analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_status ON scheduled_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_time ON scheduled_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_ai_requests_user ON ai_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_deals_user ON brand_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_media_library_user ON media_library(user_id);
