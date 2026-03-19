// ============================================================
// Zynovexa - Main Application Entry Point
// Hono app with all routes, middleware, and page rendering
// ============================================================
import { Hono } from 'hono';
import { cors } from 'hono/cors';
// API Route modules
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import analyticsRoutes from './routes/analytics';
import accountsRoutes from './routes/accounts';
import aiRoutes from './routes/ai';
import monetizationRoutes from './routes/monetization';
import billingRoutes from './routes/billing';
import notificationsRoutes from './routes/notifications';
import adminRoutes from './routes/admin';
import videoAnalyticsRoutes from './routes/video-analytics';
import seoRoutes from './routes/seo';
// Page renderers
import { landingPage } from './pages/landing';
import { aboutPage } from './pages/about';
import { authPage } from './pages/auth';
import { onboardingPage } from './pages/onboarding';
import { dashboardPage } from './pages/dashboard';
import { adminPanelPage } from './pages/admin';
import { privacyPage } from './pages/privacy';
import { dataDeletionPage } from './pages/data-deletion';
import { termsPage } from './pages/terms';
const app = new Hono();
// ---- Auto-initialize database on first request ----
let dbInitialized = false;
app.use('*', async (c, next) => {
    if (!dbInitialized && c.env.DB) {
        try {
            await c.env.DB.prepare('SELECT 1 FROM users LIMIT 1').first();
            dbInitialized = true;
        }
        catch {
            // Tables don't exist - create them
            try {
                await c.env.DB.exec(`
          CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, avatar_url TEXT DEFAULT '', password_hash TEXT DEFAULT '', provider TEXT DEFAULT 'email', role TEXT DEFAULT 'user', niche TEXT DEFAULT '', onboarded INTEGER DEFAULT 0, plan TEXT DEFAULT 'free', stripe_customer_id TEXT DEFAULT '', timezone TEXT DEFAULT 'UTC', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
          CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, platform TEXT NOT NULL, platform_user_id TEXT DEFAULT '', platform_username TEXT DEFAULT '', access_token TEXT DEFAULT '', refresh_token TEXT DEFAULT '', token_expires_at TEXT DEFAULT '', avatar_url TEXT DEFAULT '', followers_count INTEGER DEFAULT 0, status TEXT DEFAULT 'connected', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, caption TEXT DEFAULT '', media_urls TEXT DEFAULT '[]', media_type TEXT DEFAULT 'text', platforms TEXT DEFAULT '[]', status TEXT DEFAULT 'draft', scheduled_at TEXT DEFAULT '', published_at TEXT DEFAULT '', publish_results TEXT DEFAULT '{}', ai_generated INTEGER DEFAULT 0, viral_score INTEGER DEFAULT 0, hashtags TEXT DEFAULT '[]', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS analytics (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, post_id TEXT DEFAULT '', account_id TEXT DEFAULT '', platform TEXT NOT NULL, metric_type TEXT NOT NULL, metric_value INTEGER DEFAULT 0, recorded_date TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS scheduled_jobs (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, user_id TEXT NOT NULL, platform TEXT NOT NULL, scheduled_at TEXT NOT NULL, status TEXT DEFAULT 'pending', attempts INTEGER DEFAULT 0, max_attempts INTEGER DEFAULT 3, last_error TEXT DEFAULT '', executed_at TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS ai_requests (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, request_type TEXT NOT NULL, input_text TEXT DEFAULT '', output_text TEXT DEFAULT '', tokens_used INTEGER DEFAULT 0, model TEXT DEFAULT 'gpt-4', created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS subscriptions (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL, plan TEXT DEFAULT 'free', status TEXT DEFAULT 'active', current_period_start TEXT DEFAULT '', current_period_end TEXT DEFAULT '', stripe_subscription_id TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, amount INTEGER DEFAULT 0, currency TEXT DEFAULT 'usd', status TEXT DEFAULT 'succeeded', description TEXT DEFAULT '', stripe_payment_id TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS brand_deals (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, brand_name TEXT NOT NULL, deal_value INTEGER DEFAULT 0, currency TEXT DEFAULT 'usd', platform TEXT DEFAULT '', status TEXT DEFAULT 'negotiating', deliverables TEXT DEFAULT '', deadline TEXT DEFAULT '', notes TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, message TEXT DEFAULT '', type TEXT DEFAULT 'info', read INTEGER DEFAULT 0, link TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE TABLE IF NOT EXISTS activity_logs (id TEXT PRIMARY KEY, user_id TEXT DEFAULT '', action TEXT NOT NULL, resource_type TEXT DEFAULT '', resource_id TEXT DEFAULT '', details TEXT DEFAULT '', ip_address TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')));
          CREATE TABLE IF NOT EXISTS media_library (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, file_url TEXT NOT NULL, file_name TEXT DEFAULT '', file_type TEXT DEFAULT 'image', file_size INTEGER DEFAULT 0, thumbnail_url TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
          CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
          CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
          CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id);
          CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(recorded_date);
          CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_status ON scheduled_jobs(status);
          CREATE INDEX IF NOT EXISTS idx_ai_requests_user ON ai_requests(user_id);
          CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
          CREATE INDEX IF NOT EXISTS idx_brand_deals_user ON brand_deals(user_id);
          CREATE TABLE IF NOT EXISTS video_metadata (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, user_id TEXT NOT NULL, title TEXT DEFAULT '', description TEXT DEFAULT '', tags TEXT DEFAULT '[]', category TEXT DEFAULT '', thumbnail_url TEXT DEFAULT '', duration_seconds INTEGER DEFAULT 0, video_url TEXT DEFAULT '', visibility TEXT DEFAULT 'public', seo_title TEXT DEFAULT '', seo_description TEXT DEFAULT '', seo_tags TEXT DEFAULT '[]', views INTEGER DEFAULT 0, watch_time_minutes INTEGER DEFAULT 0, avg_retention_pct REAL DEFAULT 0, ctr_pct REAL DEFAULT 0, likes INTEGER DEFAULT 0, comments INTEGER DEFAULT 0, subscribers_gained INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
          CREATE INDEX IF NOT EXISTS idx_video_meta_user ON video_metadata(user_id);
          CREATE INDEX IF NOT EXISTS idx_video_meta_post ON video_metadata(post_id);
        `);
                dbInitialized = true;
                console.log('[Zynovexa] Database initialized successfully');
            }
            catch (e) {
                console.error('[Zynovexa] DB init error:', e);
            }
        }
    }
    await next();
});
// ---- Global Middleware ----
app.use('/api/*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
// ---- API Routes ----
app.route('/api/auth', authRoutes);
app.route('/api/posts', postsRoutes);
app.route('/api/analytics', analyticsRoutes);
app.route('/api/accounts', accountsRoutes);
app.route('/api/ai', aiRoutes);
app.route('/api/monetization', monetizationRoutes);
app.route('/api/billing', billingRoutes);
app.route('/api/notifications', notificationsRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/video-analytics', videoAnalyticsRoutes);
app.route('/api/seo', seoRoutes);
// ---- Page Routes ----
// Landing page (public)
app.get('/', (c) => c.html(landingPage()));
app.get('/about', (c) => c.html(aboutPage()));
app.get('/privacy', (c) => c.html(privacyPage()));
app.get('/data-deletion', (c) => c.html(dataDeletionPage()));
app.get('/delete-account', (c) => c.redirect('/data-deletion', 301));
app.get('/terms', (c) => c.html(termsPage()));
// Auth pages
app.get('/login', (c) => c.html(authPage('login')));
app.get('/signup', (c) => c.html(authPage('signup')));
// Onboarding
app.get('/onboarding', (c) => c.html(onboardingPage()));
// Dashboard (all authenticated pages are single-page, JS handles routing)
app.get('/app', (c) => c.html(dashboardPage()));
app.get('/app/*', (c) => c.html(dashboardPage()));
// Admin panel
app.get('/admin', (c) => c.html(adminPanelPage()));
app.get('/admin/*', (c) => c.html(adminPanelPage()));
// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() }));
// DB initialization endpoint (for seeding demo data)
app.post('/api/init-demo', async (c) => {
    try {
        const existing = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
        if (existing && existing.count > 0) {
            return c.json({ success: true, message: 'Database already has data', count: existing.count });
        }
        // Seed demo data
        await c.env.DB.exec(`
      INSERT OR IGNORE INTO users (id, email, name, password_hash, provider, role, niche, onboarded, plan, timezone) VALUES ('usr_admin_001', 'admin@Zynovexa.ai', 'Admin User', '${await hashPw('admin123')}', 'email', 'admin', 'technology', 1, 'business', 'America/New_York');
      INSERT OR IGNORE INTO users (id, email, name, password_hash, provider, role, niche, onboarded, plan, timezone) VALUES ('usr_demo_001', 'creator@demo.com', 'Sarah Chen', '${await hashPw('demo123')}', 'email', 'user', 'lifestyle', 1, 'pro', 'America/Los_Angeles');
      INSERT OR IGNORE INTO subscriptions (id, user_id, plan, status, current_period_start, current_period_end) VALUES ('sub_001', 'usr_demo_001', 'pro', 'active', '2026-02-01', '2026-03-01');
      INSERT OR IGNORE INTO subscriptions (id, user_id, plan, status, current_period_start) VALUES ('sub_admin', 'usr_admin_001', 'business', 'active', '2026-01-01');
      INSERT OR IGNORE INTO accounts (id, user_id, platform, platform_username, followers_count, status) VALUES ('acc_001', 'usr_demo_001', 'instagram', '@sarahcreates', 45200, 'connected');
      INSERT OR IGNORE INTO accounts (id, user_id, platform, platform_username, followers_count, status) VALUES ('acc_002', 'usr_demo_001', 'youtube', 'Sarah Chen', 12800, 'connected');
      INSERT OR IGNORE INTO accounts (id, user_id, platform, platform_username, followers_count, status) VALUES ('acc_003', 'usr_demo_001', 'tiktok', '@sarahcreates', 89500, 'connected');
      INSERT OR IGNORE INTO posts (id, user_id, caption, media_type, platforms, status, viral_score, hashtags, created_at) VALUES ('post_001', 'usr_demo_001', '5 morning habits that changed my productivity forever. Thread below...', 'image', '["instagram","tiktok"]', 'published', 78, '["#productivity","#morningroutine"]', '2026-02-10 09:00:00');
      INSERT OR IGNORE INTO posts (id, user_id, caption, media_type, platforms, status, scheduled_at, viral_score, hashtags, created_at) VALUES ('post_003', 'usr_demo_001', 'The AI tools I use daily to save 3 hours of work', 'carousel', '["instagram","linkedin"]', 'scheduled', '2026-02-16 10:00:00', 82, '["#AI","#productivity"]', '2026-02-14 08:00:00');
      INSERT OR IGNORE INTO posts (id, user_id, caption, media_type, platforms, status, scheduled_at, viral_score, hashtags, created_at) VALUES ('post_005', 'usr_demo_001', 'How I grew from 0 to 50K followers in 6 months', 'video', '["youtube"]', 'scheduled', '2026-02-17 15:00:00', 91, '["#growth","#socialmedia"]', '2026-02-14 16:00:00');
      INSERT OR IGNORE INTO posts (id, user_id, caption, media_type, platforms, status, viral_score, hashtags, created_at) VALUES ('post_004', 'usr_demo_001', 'New video dropping this weekend! Sneak peek coming...', 'image', '["instagram"]', 'draft', 45, '["#comingsoon"]', '2026-02-15 11:00:00');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, account_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_001', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'impressions', 12400, '2026-02-10');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, account_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_002', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'likes', 890, '2026-02-10');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, account_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_003', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'comments', 124, '2026-02-10');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, account_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_004', 'usr_demo_001', 'post_001', 'acc_001', 'instagram', 'shares', 67, '2026-02-10');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_009', 'usr_demo_001', '', 'instagram', 'followers', 45200, '2026-02-15');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_010', 'usr_demo_001', '', 'instagram', 'followers', 44800, '2026-02-14');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_011', 'usr_demo_001', '', 'instagram', 'followers', 44100, '2026-02-13');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_012', 'usr_demo_001', '', 'instagram', 'followers', 43500, '2026-02-12');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_013', 'usr_demo_001', '', 'instagram', 'followers', 42900, '2026-02-11');
      INSERT OR IGNORE INTO analytics (id, user_id, post_id, platform, metric_type, metric_value, recorded_date) VALUES ('an_014', 'usr_demo_001', '', 'instagram', 'followers', 42200, '2026-02-10');
      INSERT OR IGNORE INTO brand_deals (id, user_id, brand_name, deal_value, platform, status, deliverables, deadline) VALUES ('deal_001', 'usr_demo_001', 'TechGear Pro', 250000, 'instagram', 'in_progress', '3 Instagram posts + 2 Stories', '2026-03-01');
      INSERT OR IGNORE INTO brand_deals (id, user_id, brand_name, deal_value, platform, status, deliverables, deadline) VALUES ('deal_002', 'usr_demo_001', 'FitLife App', 150000, 'youtube', 'confirmed', '1 Sponsored video', '2026-02-28');
      INSERT OR IGNORE INTO brand_deals (id, user_id, brand_name, deal_value, platform, status, deliverables, deadline) VALUES ('deal_003', 'usr_demo_001', 'CreativeCloud', 400000, 'instagram', 'negotiating', '6-month ambassador program', '2026-04-01');
      INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, read, link, created_at) VALUES ('notif_001', 'usr_demo_001', 'Post Published!', 'Your post was published on Instagram and TikTok', 'success', 1, '/app/analytics', '2026-02-10 09:01:00');
      INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, read, link, created_at) VALUES ('notif_002', 'usr_demo_001', 'Viral Alert!', 'Your TikTok post is trending - 45K impressions!', 'info', 0, '/app/analytics', '2026-02-11 12:00:00');
      INSERT OR IGNORE INTO notifications (id, user_id, title, message, type, read, link, created_at) VALUES ('notif_003', 'usr_demo_001', 'New Brand Deal', 'CreativeCloud wants to partner with you!', 'info', 0, '/app/monetization', '2026-02-14 10:00:00');
      INSERT OR IGNORE INTO video_metadata (id, post_id, user_id, title, description, tags, category, thumbnail_url, duration_seconds, video_url, visibility, seo_title, seo_description, seo_tags, views, watch_time_minutes, avg_retention_pct, ctr_pct, likes, comments, subscribers_gained) VALUES ('vmeta_001', 'post_005', 'usr_demo_001', 'How I grew from 0 to 50K followers in 6 months', 'My exact strategy for growing from zero to 50K followers. 0:00 Intro 1:30 Finding My Niche 4:00 Content Strategy 7:00 Consistency 10:00 Monetization 12:00 Key Takeaways. Subscribe for more!', '["growth","socialmedia","followers","creator","strategy"]', 'Education', '', 780, '', 'public', 'How to Grow from 0 to 50K Followers - Complete Guide 2026', 'Learn the exact strategy I used to grow from 0 to 50K followers in just 6 months.', '["growth","followers","socialmedia"]', 28400, 4200, 52.3, 8.7, 1240, 186, 320);
      INSERT OR IGNORE INTO video_metadata (id, post_id, user_id, title, description, tags, category, thumbnail_url, duration_seconds, video_url, visibility, seo_title, seo_description, seo_tags, views, watch_time_minutes, avg_retention_pct, ctr_pct, likes, comments, subscribers_gained) VALUES ('vmeta_002', 'post_001', 'usr_demo_001', '5 Morning Habits That Changed My Productivity', 'These 5 morning habits completely transformed my productivity. 0:00 Intro 0:45 Habit 1 2:00 Habit 2 3:30 Habit 3 5:00 Habit 4 6:30 Habit 5. Like and subscribe!', '["productivity","morningroutine","habits","lifestyle"]', 'Howto & Style', '', 480, '', 'public', '5 Morning Habits for Maximum Productivity (2026)', 'Discover the 5 morning habits that helped me 3x my productivity.', '["productivity","morning","habits"]', 15600, 2100, 45.8, 6.2, 890, 124, 145);
      INSERT OR IGNORE INTO video_metadata (id, post_id, user_id, title, description, tags, category, thumbnail_url, duration_seconds, video_url, visibility, seo_title, seo_description, seo_tags, views, watch_time_minutes, avg_retention_pct, ctr_pct, likes, comments, subscribers_gained) VALUES ('vmeta_003', 'post_003', 'usr_demo_001', 'The AI Tools I Use Daily to Save 3 Hours', 'Here are the AI tools I use every single day that save me at least 3 hours. 0:00 Intro 1:00 ChatGPT 3:00 AI Images 5:00 Scheduling 7:00 AI Analytics. Comment which tools you use!', '["AI","tools","productivity","automation"]', 'Science & Technology', '', 540, '', 'public', 'Best AI Tools for Creators in 2026 - Save 3 Hours Daily', 'These AI tools will save you 3 hours every day as a content creator.', '["AI","tools","creator"]', 9200, 1400, 48.1, 7.5, 620, 98, 88);
    `);
        return c.json({ success: true, message: 'Demo data seeded' });
    }
    catch (e) {
        return c.json({ success: false, message: e.message }, 500);
    }
});
async function hashPw(pw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pw + 'Zynovexa_salt_2026');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
export default app;
