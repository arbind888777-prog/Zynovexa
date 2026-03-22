// ============================================================
// Zynovexa - Gamification & Retention API Routes
// Streaks, badges, reminders, habit-forming features
// ============================================================
import { Hono } from 'hono';
import { generateId, apiSuccess, apiError } from '../lib/utils';
import { authMiddleware } from '../lib/auth';

type Bindings = { DB: D1Database };
type Variables = { userId: string; userRole: string };
const gamification = new Hono<{ Bindings: Bindings; Variables: Variables }>();

gamification.use('*', authMiddleware);

// ── Badge definitions ───────────────────────────────────────
const BADGE_DEFINITIONS = [
  { type: 'first_post', name: 'First Post', icon: '🎯', condition: (stats: any) => stats.total_posts >= 1 },
  { type: 'streak_7', name: '7-Day Streak', icon: '🔥', condition: (stats: any) => stats.current_streak >= 7 },
  { type: 'streak_30', name: '30-Day Streak', icon: '💎', condition: (stats: any) => stats.current_streak >= 30 },
  { type: 'streak_100', name: '100-Day Legend', icon: '👑', condition: (stats: any) => stats.current_streak >= 100 },
  { type: 'posts_10', name: 'Content Creator', icon: '✍️', condition: (stats: any) => stats.total_posts >= 10 },
  { type: 'posts_50', name: 'Prolific Publisher', icon: '📚', condition: (stats: any) => stats.total_posts >= 50 },
  { type: 'posts_100', name: 'Content Machine', icon: '🏭', condition: (stats: any) => stats.total_posts >= 100 },
  { type: 'viral_post', name: 'Gone Viral', icon: '🚀', condition: (stats: any) => stats.highest_viral_score >= 90 },
  { type: 'ai_power_user', name: 'AI Power User', icon: '🤖', condition: (stats: any) => stats.total_ai_uses >= 50 },
  { type: 'multi_platform', name: 'Multi-Platform Pro', icon: '🌐', condition: (stats: any) => stats.connected_accounts >= 3 },
  { type: 'engaged', name: 'Community Engager', icon: '💬', condition: (stats: any) => stats.total_engagement >= 1000 },
  { type: 'growth_10k', name: '10K Club', icon: '⭐', condition: (stats: any) => stats.total_followers >= 10000 },
];

// XP rewards per action
const XP_REWARDS: Record<string, number> = {
  post_created: 10,
  post_published: 25,
  ai_generation: 5,
  streak_day: 15,
  badge_earned: 50,
  account_connected: 20,
};

// ── GET /api/gamification/profile — Gamification profile ────
gamification.get('/profile', async (c) => {
  const userId = c.get('userId');

  let streak = await c.env.DB.prepare('SELECT * FROM user_streaks WHERE user_id = ?').bind(userId).first() as any;
  if (!streak) {
    const id = generateId('str');
    await c.env.DB.prepare('INSERT INTO user_streaks (id, user_id) VALUES (?, ?)').bind(id, userId).run();
    streak = { id, user_id: userId, current_streak: 0, longest_streak: 0, xp_points: 0, level: 1, total_posts_count: 0, total_ai_uses: 0 };
  }

  const badges = await c.env.DB.prepare('SELECT badge_type, badge_name, badge_icon, earned_at FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC').bind(userId).all();

  const level = calculateLevel(streak.xp_points || 0);
  const nextLevelXp = getNextLevelXp(level);

  return c.json(apiSuccess({
    streak: {
      current: streak.current_streak || 0,
      longest: streak.longest_streak || 0,
      last_post_date: streak.last_post_date || null,
    },
    xp: {
      total: streak.xp_points || 0,
      level,
      next_level_xp: nextLevelXp,
      progress_percent: nextLevelXp > 0 ? Math.min(100, ((streak.xp_points || 0) / nextLevelXp * 100)).toFixed(0) : 100,
    },
    badges: badges.results || [],
    available_badges: BADGE_DEFINITIONS.map(b => ({
      type: b.type,
      name: b.name,
      icon: b.icon,
      earned: (badges.results || []).some((eb: any) => eb.badge_type === b.type),
    })),
    stats: {
      total_posts: streak.total_posts_count || 0,
      total_ai_uses: streak.total_ai_uses || 0,
    },
  }));
});

// ── POST /api/gamification/record-action — Track actions ────
gamification.post('/record-action', async (c) => {
  const userId = c.get('userId');
  const { action } = await c.req.json();

  if (!action || !XP_REWARDS[action]) {
    return c.json(apiError('Invalid action'), 400);
  }

  const xpEarned = XP_REWARDS[action];
  let streak = await c.env.DB.prepare('SELECT * FROM user_streaks WHERE user_id = ?').bind(userId).first() as any;

  if (!streak) {
    const id = generateId('str');
    await c.env.DB.prepare('INSERT INTO user_streaks (id, user_id) VALUES (?, ?)').bind(id, userId).run();
    streak = { id, user_id: userId, current_streak: 0, longest_streak: 0, xp_points: 0, level: 1, total_posts_count: 0, total_ai_uses: 0, last_post_date: '' };
  }

  const today = new Date().toISOString().split('T')[0];
  let newStreak = streak.current_streak || 0;
  const updates: string[] = [];

  // Update streak for post actions
  if (action === 'post_created' || action === 'post_published') {
    const lastDate = streak.last_post_date || '';
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      newStreak = (lastDate === yesterday) ? newStreak + 1 : 1;
      updates.push('streak updated');
    }
    await c.env.DB.prepare(`
      UPDATE user_streaks SET current_streak = ?, longest_streak = MAX(longest_streak, ?), last_post_date = ?, total_posts_count = total_posts_count + 1, xp_points = xp_points + ?, updated_at = datetime('now') WHERE user_id = ?
    `).bind(newStreak, newStreak, today, xpEarned, userId).run();
  } else if (action === 'ai_generation') {
    await c.env.DB.prepare('UPDATE user_streaks SET total_ai_uses = total_ai_uses + 1, xp_points = xp_points + ?, updated_at = datetime(\'now\') WHERE user_id = ?').bind(xpEarned, userId).run();
  } else {
    await c.env.DB.prepare('UPDATE user_streaks SET xp_points = xp_points + ?, updated_at = datetime(\'now\') WHERE user_id = ?').bind(xpEarned, userId).run();
  }

  // Check for new badges
  const newBadges = await checkAndAwardBadges(c, userId);

  return c.json(apiSuccess({
    xp_earned: xpEarned,
    new_streak: newStreak,
    new_badges: newBadges,
    updates,
  }));
});

// ── GET /api/gamification/leaderboard — Top users ───────────
gamification.get('/leaderboard', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT u.name, u.avatar_url, s.current_streak, s.xp_points, s.total_posts_count
    FROM user_streaks s JOIN users u ON s.user_id = u.id
    ORDER BY s.xp_points DESC LIMIT 20
  `).all();
  return c.json(apiSuccess({ leaderboard: result.results }));
});

// ── GET /api/gamification/reminders — User's reminders ──────
gamification.get('/reminders', async (c) => {
  const userId = c.get('userId');
  const result = await c.env.DB.prepare(
    "SELECT id, reminder_type, title, message, created_at FROM user_reminders WHERE user_id = ? AND sent = 0 ORDER BY created_at DESC LIMIT 10"
  ).bind(userId).all();
  return c.json(apiSuccess({ reminders: result.results }));
});

// ── Helper functions ────────────────────────────────────────

function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2500) return 6;
  if (xp < 4000) return 7;
  if (xp < 6000) return 8;
  if (xp < 9000) return 9;
  return 10;
}

function getNextLevelXp(level: number): number {
  const thresholds = [100, 300, 600, 1000, 1500, 2500, 4000, 6000, 9000, 99999];
  return thresholds[Math.min(level, thresholds.length - 1)];
}

async function checkAndAwardBadges(c: any, userId: string): Promise<any[]> {
  // Get current stats
  const [streak, postCount, aiCount, accountCount, topScore, totalFollowers] = await Promise.all([
    c.env.DB.prepare('SELECT current_streak FROM user_streaks WHERE user_id = ?').bind(userId).first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').bind(userId).first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM ai_requests WHERE user_id = ?').bind(userId).first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM accounts WHERE user_id = ?').bind(userId).first(),
    c.env.DB.prepare('SELECT MAX(viral_score) as max_score FROM posts WHERE user_id = ?').bind(userId).first(),
    c.env.DB.prepare('SELECT SUM(followers_count) as total FROM accounts WHERE user_id = ?').bind(userId).first(),
  ]);

  const existingBadges = await c.env.DB.prepare('SELECT badge_type FROM user_badges WHERE user_id = ?').bind(userId).all();
  const earned = new Set((existingBadges.results || []).map((b: any) => b.badge_type));

  const stats = {
    current_streak: (streak as any)?.current_streak || 0,
    total_posts: (postCount as any)?.count || 0,
    total_ai_uses: (aiCount as any)?.count || 0,
    connected_accounts: (accountCount as any)?.count || 0,
    highest_viral_score: (topScore as any)?.max_score || 0,
    total_followers: (totalFollowers as any)?.total || 0,
    total_engagement: 0,
  };

  const newBadges: any[] = [];
  for (const badge of BADGE_DEFINITIONS) {
    if (!earned.has(badge.type) && badge.condition(stats)) {
      const badgeId = generateId('bdg');
      await c.env.DB.prepare('INSERT INTO user_badges (id, user_id, badge_type, badge_name, badge_icon) VALUES (?, ?, ?, ?, ?)').bind(badgeId, userId, badge.type, badge.name, badge.icon).run();
      // Award bonus XP for badge
      await c.env.DB.prepare('UPDATE user_streaks SET xp_points = xp_points + ? WHERE user_id = ?').bind(XP_REWARDS.badge_earned, userId).run();
      newBadges.push({ type: badge.type, name: badge.name, icon: badge.icon });
    }
  }

  return newBadges;
}

export default gamification;
