-- ============================================================
-- Zynovexa Growth Platform Upgrade
-- New tables for: Testimonials, Case Studies, Roadmap,
-- AI Growth Coach, Gamification, Competitor Tracking,
-- Pro Analytics, Retention System
-- ============================================================

-- TESTIMONIALS: Social proof system
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT '',
  company TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  result_text TEXT DEFAULT '',
  before_followers INTEGER DEFAULT 0,
  after_followers INTEGER DEFAULT 0,
  before_engagement REAL DEFAULT 0,
  after_engagement REAL DEFAULT 0,
  growth_percentage REAL DEFAULT 0,
  video_url TEXT DEFAULT '',
  rating INTEGER DEFAULT 5,
  featured INTEGER DEFAULT 0,
  approved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- CASE STUDIES: Before/after analytics
CREATE TABLE IF NOT EXISTS case_studies (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT '',
  title TEXT NOT NULL,
  niche TEXT DEFAULT '',
  duration_days INTEGER DEFAULT 30,
  before_metrics TEXT DEFAULT '{}',
  after_metrics TEXT DEFAULT '{}',
  strategy_used TEXT DEFAULT '',
  tools_used TEXT DEFAULT '[]',
  growth_followers INTEGER DEFAULT 0,
  growth_engagement REAL DEFAULT 0,
  growth_revenue INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ROADMAP: Public product roadmap (kanban)
CREATE TABLE IF NOT EXISTS roadmap_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'feature',
  status TEXT DEFAULT 'planned',         -- planned | in_progress | released
  priority INTEGER DEFAULT 0,
  votes INTEGER DEFAULT 0,
  target_date TEXT DEFAULT '',
  released_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- GROWTH COACH: Daily AI recommendations
CREATE TABLE IF NOT EXISTS growth_recommendations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  recommendation_type TEXT NOT NULL,     -- what_to_post | when_to_post | why_it_works | improvement
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  action_url TEXT DEFAULT '',
  priority TEXT DEFAULT 'medium',        -- low | medium | high | critical
  dismissed INTEGER DEFAULT 0,
  acted_on INTEGER DEFAULT 0,
  expires_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- WEEKLY REPORTS: Auto-generated performance summaries
CREATE TABLE IF NOT EXISTS weekly_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  total_posts INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  follower_change INTEGER DEFAULT 0,
  top_post_id TEXT DEFAULT '',
  engagement_rate REAL DEFAULT 0,
  improvement_suggestions TEXT DEFAULT '[]',
  summary_text TEXT DEFAULT '',
  email_sent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- COMPETITOR TRACKING: Pro Mode
CREATE TABLE IF NOT EXISTS competitor_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  competitor_username TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  avg_engagement_rate REAL DEFAULT 0,
  last_synced_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS competitor_snapshots (
  id TEXT PRIMARY KEY,
  competitor_id TEXT NOT NULL,
  followers_count INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  posts_this_week INTEGER DEFAULT 0,
  top_post_likes INTEGER DEFAULT 0,
  recorded_date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (competitor_id) REFERENCES competitor_profiles(id) ON DELETE CASCADE
);

-- GAMIFICATION: Streaks and badges
CREATE TABLE IF NOT EXISTS user_streaks (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_post_date TEXT DEFAULT '',
  total_posts_count INTEGER DEFAULT 0,
  total_ai_uses INTEGER DEFAULT 0,
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT DEFAULT '',
  earned_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DAILY REMINDERS: Retention alerts
CREATE TABLE IF NOT EXISTS user_reminders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reminder_type TEXT NOT NULL,           -- missed_post | weekly_report | growth_insight | streak_warning
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  channel TEXT DEFAULT 'in_app',         -- in_app | email | push
  sent INTEGER DEFAULT 0,
  sent_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI PROMPT TEMPLATES: Niche-specific prompt library
CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,                -- caption | script | hook | hashtag | growth
  platform TEXT DEFAULT 'all',           -- all | instagram | youtube | tiktok | linkedin | twitter
  audience_type TEXT DEFAULT 'general',
  tone TEXT DEFAULT 'professional',      -- casual | professional | hinglish | humorous | motivational
  template_text TEXT NOT NULL,
  variables TEXT DEFAULT '[]',
  score_weight_hook REAL DEFAULT 0.4,
  score_weight_readability REAL DEFAULT 0.3,
  score_weight_engagement REAL DEFAULT 0.3,
  usage_count INTEGER DEFAULT 0,
  is_premium INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- CONTENT SCORES: AI-generated quality scores
CREATE TABLE IF NOT EXISTS content_scores (
  id TEXT PRIMARY KEY,
  post_id TEXT DEFAULT '',
  user_id TEXT NOT NULL,
  content_text TEXT DEFAULT '',
  overall_score INTEGER DEFAULT 0,
  hook_score INTEGER DEFAULT 0,
  readability_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  keyword_density REAL DEFAULT 0,
  suggestions TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published);
CREATE INDEX IF NOT EXISTS idx_roadmap_status ON roadmap_items(status);
CREATE INDEX IF NOT EXISTS idx_growth_rec_user ON growth_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_user ON weekly_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_competitor_user ON competitor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON user_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_cat ON ai_prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_content_scores_user ON content_scores(user_id);
