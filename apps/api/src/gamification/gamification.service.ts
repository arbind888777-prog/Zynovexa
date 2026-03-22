import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

const BADGE_DEFINITIONS: Record<string, { name: string; description: string; icon: string; condition: string }> = {
  first_post: { name: 'First Post', description: 'Published your first post', icon: '📝', condition: 'posts >= 1' },
  streak_3: { name: '3-Day Streak', description: 'Posted 3 days in a row', icon: '🔥', condition: 'streak >= 3' },
  streak_7: { name: 'Weekly Warrior', description: '7-day posting streak', icon: '⚡', condition: 'streak >= 7' },
  streak_30: { name: 'Monthly Machine', description: '30-day posting streak', icon: '🏆', condition: 'streak >= 30' },
  posts_10: { name: 'Content Creator', description: 'Published 10 posts', icon: '✨', condition: 'posts >= 10' },
  posts_50: { name: 'Prolific Creator', description: 'Published 50 posts', icon: '💎', condition: 'posts >= 50' },
  posts_100: { name: 'Content Legend', description: 'Published 100 posts', icon: '👑', condition: 'posts >= 100' },
  ai_10: { name: 'AI Explorer', description: 'Used AI 10 times', icon: '🤖', condition: 'ai >= 10' },
  viral_hit: { name: 'Viral Hit', description: 'A post scored 80+ viral score', icon: '🚀', condition: 'viral >= 80' },
  multi_platform: { name: 'Multi-Platform', description: 'Connected 3+ platforms', icon: '🌐', condition: 'platforms >= 3' },
  early_adopter: { name: 'Early Adopter', description: 'Joined during beta', icon: '🌟', condition: 'early' },
  level_5: { name: 'Rising Star', description: 'Reached level 5', icon: '⭐', condition: 'level >= 5' },
};

const XP_REWARDS: Record<string, number> = {
  post_created: 10,
  post_published: 25,
  ai_used: 5,
  streak_day: 15,
  badge_earned: 50,
  account_connected: 30,
};

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async getProfile(userId: string) {
    const streak = await this.getOrCreateStreak(userId);
    const badges = await this.prisma.userBadge.findMany({
      where: { streakId: streak.id },
      orderBy: { earnedAt: 'desc' },
    });

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalXp: streak.totalXp,
      level: streak.level,
      nextLevelXp: streak.level * 200,
      badges: badges.map((b) => ({
        key: b.badgeKey,
        earnedAt: b.earnedAt,
        ...BADGE_DEFINITIONS[b.badgeKey],
      })),
      allBadges: Object.entries(BADGE_DEFINITIONS).map(([key, def]) => ({
        key,
        ...def,
        earned: badges.some((b) => b.badgeKey === key),
      })),
    };
  }

  async recordAction(userId: string, action: string) {
    const streak = await this.getOrCreateStreak(userId);
    const xp = XP_REWARDS[action] || 5;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    let newStreak = streak.currentStreak;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastActive || lastActive.getTime() < yesterday.getTime()) {
      newStreak = 1; // streak broken or first action
    } else if (lastActive.getTime() === yesterday.getTime()) {
      newStreak = streak.currentStreak + 1; // extend streak
    }
    // if same day, streak stays same

    const newXp = streak.totalXp + xp;
    const newLevel = Math.floor(newXp / 200) + 1;

    await this.prisma.userStreak.update({
      where: { id: streak.id },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(streak.longestStreak, newStreak),
        totalXp: newXp,
        level: newLevel,
        lastActiveDate: new Date(),
      },
    });

    // Check for new badges
    const newBadges = await this.checkAndAwardBadges(userId, streak.id, {
      streak: newStreak,
      level: newLevel,
      action,
    });

    return {
      xpEarned: xp,
      totalXp: newXp,
      level: newLevel,
      currentStreak: newStreak,
      newBadges,
    };
  }

  async getLeaderboard(limit = 20) {
    const streaks = await this.prisma.userStreak.findMany({
      orderBy: { totalXp: 'desc' },
      take: limit,
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    return streaks.map((s, i) => ({
      rank: i + 1,
      userId: s.user.id,
      name: s.user.name,
      avatarUrl: s.user.avatarUrl,
      totalXp: s.totalXp,
      level: s.level,
      currentStreak: s.currentStreak,
    }));
  }

  async getStreakReminders() {
    // Find users who were active yesterday but haven't been active today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const atRisk = await this.prisma.userStreak.findMany({
      where: {
        currentStreak: { gte: 3 },
        lastActiveDate: { gte: yesterday, lt: today },
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return atRisk.map((s) => ({
      userId: s.user.id,
      name: s.user.name,
      email: s.user.email,
      currentStreak: s.currentStreak,
      message: `${s.user.name}, your ${s.currentStreak}-day streak is at risk! Post today to keep it alive 🔥`,
    }));
  }

  // ── Internal helpers ──────────────────────────────────

  private async getOrCreateStreak(userId: string) {
    let streak = await this.prisma.userStreak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await this.prisma.userStreak.create({ data: { userId } });
    }
    return streak;
  }

  private async checkAndAwardBadges(
    userId: string,
    streakId: string,
    ctx: { streak: number; level: number; action: string },
  ) {
    const existing = await this.prisma.userBadge.findMany({ where: { streakId } });
    const earned = new Set(existing.map((b) => b.badgeKey));
    const newBadges: string[] = [];

    const postCount = await this.prisma.post.count({ where: { userId, status: 'PUBLISHED' } });
    const aiCount = await this.prisma.aiRequest.count({ where: { userId } });
    const platformCount = await this.prisma.socialAccount.count({ where: { userId, isActive: true } });

    const checks: [string, boolean][] = [
      ['first_post', postCount >= 1],
      ['streak_3', ctx.streak >= 3],
      ['streak_7', ctx.streak >= 7],
      ['streak_30', ctx.streak >= 30],
      ['posts_10', postCount >= 10],
      ['posts_50', postCount >= 50],
      ['posts_100', postCount >= 100],
      ['ai_10', aiCount >= 10],
      ['multi_platform', platformCount >= 3],
      ['level_5', ctx.level >= 5],
    ];

    for (const [key, met] of checks) {
      if (met && !earned.has(key)) {
        await this.prisma.userBadge.create({ data: { streakId, badgeKey: key } });
        newBadges.push(key);

        const badge = BADGE_DEFINITIONS[key];
        if (badge) {
          await this.notifications.create(
            userId,
            `Badge Earned: ${badge.icon} ${badge.name}`,
            badge.description,
            'BADGE',
          );
        }
      }
    }

    return newBadges.map((key) => ({ key, ...BADGE_DEFINITIONS[key] }));
  }
}
