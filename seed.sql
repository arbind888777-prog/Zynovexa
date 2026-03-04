-- ============================================================
-- Zynovexa Seed Data - Demo/Development
-- ============================================================

-- Demo Admin User (password: admin123)
INSERT OR IGNORE INTO users (id, email, name, avatar_url, password_hash, provider, role, niche, onboarded, plan, timezone) VALUES
  ('usr_admin_001', 'admin@zynovexa.ai', 'Admin User', '', '65e6354e2943d0408c231edaa307f321e2bd5f68c7d7cf642a1ec41685b4501c', 'email', 'admin', 'technology', 1, 'business', 'America/New_York');

-- Demo Creator Users (password: demo123)
INSERT OR IGNORE INTO users (id, email, name, avatar_url, password_hash, provider, role, niche, onboarded, plan, timezone) VALUES
  ('usr_demo_001', 'demo@zynovexa.com', 'Sarah Chen', '', 'c1c7907ca46f170f3546854ac191be635e04c457ce843bcb289ce5f71673ea21', 'email', 'user', 'lifestyle', 1, 'pro', 'America/Los_Angeles'),
  ('usr_demo_002', 'alex@zynovexa.com', 'Alex Rivera', '', 'c1c7907ca46f170f3546854ac191be635e04c457ce843bcb289ce5f71673ea21', 'email', 'user', 'tech', 1, 'free', 'Europe/London'),
  ('usr_demo_003', 'maya@zynovexa.com', 'Maya Johnson', '', 'c1c7907ca46f170f3546854ac191be635e04c457ce843bcb289ce5f71673ea21', 'email', 'user', 'fitness', 1, 'pro', 'America/Chicago');

-- Connected Social Accounts
INSERT OR IGNORE INTO accounts (id, user_id, platform, platform_username, followers_count, status) VALUES
  ('acc_001', 'usr_demo_001', 'instagram', '@sarahcreates', 45200, 'connected'),
  ('acc_002', 'usr_demo_001', 'youtube', 'Sarah Chen', 12800, 'connected'),
  ('acc_003', 'usr_demo_001', 'tiktok', '@sarahcreates', 89500, 'connected'),
  ('acc_004', 'usr_demo_001', 'linkedin', 'Sarah Chen', 5600, 'connected'),
  ('acc_005', 'usr_demo_002', 'youtube', 'Alex Tech', 34000, 'connected'),
  ('acc_006', 'usr_demo_002', 'twitter', '@alextech', 15200, 'connected'),
  ('acc_007', 'usr_demo_003', 'instagram', '@mayafitness', 120000, 'connected'),
  ('acc_008', 'usr_demo_003', 'tiktok', '@mayafitness', 250000, 'connected');

-- Sample Posts
INSERT OR IGNORE INTO posts (id, user_id, caption, media_type, platforms, status, scheduled_at, viral_score, hashtags, created_at) VALUES
  ('post_001', 'usr_demo_001', '5 morning habits that changed my productivity forever. Thread below...', 'image', '["instagram","tiktok"]', 'published', '', 78, '["#productivity","#morningroutine","#lifestyle"]', '2026-02-10 09:00:00'),
  ('post_002', 'usr_demo_001', 'Behind the scenes of my content creation setup! What do you think?', 'video', '["youtube","instagram"]', 'published', '', 65, '["#contentcreator","#bts","#setup"]', '2026-02-12 14:00:00'),
  ('post_003', 'usr_demo_001', 'The AI tools I use daily to save 3 hours of work', 'carousel', '["instagram","linkedin"]', 'scheduled', '2026-02-16 10:00:00', 82, '["#AI","#productivity","#tools"]', '2026-02-14 08:00:00'),
  ('post_004', 'usr_demo_001', 'New video dropping this weekend! Sneak peek of what is coming...', 'image', '["instagram","tiktok"]', 'draft', '', 45, '["#comingsoon","#sneakpeek"]', '2026-02-15 11:00:00'),
  ('post_005', 'usr_demo_001', 'How I grew from 0 to 50K followers in 6 months - a complete breakdown', 'video', '["youtube"]', 'scheduled', '2026-02-17 15:00:00', 91, '["#growth","#socialmedia","#tips"]', '2026-02-14 16:00:00');

-- Analytics Data
INSERT OR IGNORE INTO analytics (id, user_id, post_id, account_id, platform, metric_type, metric_value, recorded_date) VALUES
  ('an_001', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'impressions', 12400, '2026-02-10'),
  ('an_002', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'likes', 890, '2026-02-10'),
  ('an_003', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'comments', 124, '2026-02-10'),
  ('an_004', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'shares', 67, '2026-02-10'),
  ('an_005', 'usr_demo_001', 'post_001', 'acc_003', 'tiktok', 'impressions', 45000, '2026-02-10'),
  ('an_006', 'usr_demo_001', 'post_001', 'acc_003', 'tiktok', 'likes', 3200, '2026-02-10'),
  ('an_007', 'usr_demo_001', 'post_002', 'acc_002', 'youtube', 'impressions', 8900, '2026-02-12'),
  ('an_008', 'usr_demo_001', 'post_002', 'acc_002', 'youtube', 'likes', 560, '2026-02-12'),
  ('an_009', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 45200, '2026-02-15'),
  ('an_010', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 44800, '2026-02-14'),
  ('an_011', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 44100, '2026-02-13'),
  ('an_012', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 43500, '2026-02-12'),
  ('an_013', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 42900, '2026-02-11'),
  ('an_014', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 42200, '2026-02-10'),
  ('an_015', 'usr_demo_001', '', 'acc_001', 'instagram', 'followers', 41500, '2026-02-09');

-- Subscriptions
INSERT OR IGNORE INTO subscriptions (id, user_id, plan, status, current_period_start, current_period_end) VALUES
  ('sub_001', 'usr_demo_001', 'pro', 'active', '2026-02-01', '2026-03-01'),
  ('sub_002', 'usr_demo_002', 'free', 'active', '2026-01-15', ''),
  ('sub_003', 'usr_demo_003', 'pro', 'active', '2026-02-01', '2026-03-01');

-- Brand Deals
INSERT OR IGNORE INTO brand_deals (id, user_id, brand_name, deal_value, platform, status, deliverables, deadline) VALUES
  ('deal_001', 'usr_demo_001', 'TechGear Pro', 250000, 'instagram', 'in_progress', '3 Instagram posts + 2 Stories', '2026-03-01'),
  ('deal_002', 'usr_demo_001', 'FitLife App', 150000, 'youtube', 'confirmed', '1 Sponsored video (60s integration)', '2026-02-28'),
  ('deal_003', 'usr_demo_001', 'CreativeCloud', 400000, 'instagram', 'negotiating', '6-month ambassador program', '2026-04-01');

-- Notifications
INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, read, link, created_at) VALUES
  ('notif_001', 'usr_demo_001', 'Post Published!', 'Your post "5 morning habits" was published on Instagram and TikTok', 'success', 1, '/app/analytics', '2026-02-10 09:01:00'),
  ('notif_002', 'usr_demo_001', 'Viral Alert!', 'Your TikTok post is trending - 45K impressions in 24 hours', 'info', 0, '/app/analytics', '2026-02-11 12:00:00'),
  ('notif_003', 'usr_demo_001', 'New Brand Deal', 'CreativeCloud wants to partner with you. Review the offer.', 'info', 0, '/app/monetization', '2026-02-14 10:00:00'),
  ('notif_004', 'usr_demo_001', 'Upcoming Post', 'Scheduled post "The AI tools I use daily" goes live in 24 hours', 'warning', 0, '/app/scheduled', '2026-02-15 10:00:00');

-- AI Request History
INSERT OR IGNORE INTO ai_requests (id, user_id, request_type, input_text, output_text, tokens_used, model, created_at) VALUES
  ('ai_001', 'usr_demo_001', 'caption', 'Write a caption about morning productivity habits', 'Rise and grind! Here are 5 morning habits that transformed my entire day...', 150, 'gpt-4', '2026-02-10 08:30:00'),
  ('ai_002', 'usr_demo_001', 'hashtags', 'productivity lifestyle morning routine', '#productivity #morningroutine #lifestyle #grindset #dailyhabits', 80, 'gpt-4', '2026-02-10 08:31:00'),
  ('ai_003', 'usr_demo_001', 'ideas', 'content ideas for tech lifestyle niche', '1. Day in the life of a content creator\n2. My favorite AI tools\n3. Setup tour\n4. How I edit my videos\n5. Social media growth tips', 200, 'gpt-4', '2026-02-13 15:00:00');
