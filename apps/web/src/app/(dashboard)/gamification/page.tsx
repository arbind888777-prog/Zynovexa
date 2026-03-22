'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface Badge {
  key: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

interface GamificationProfile {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  nextLevelXp: number;
  allBadges: Badge[];
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string | null;
  totalXp: number;
  level: number;
  currentStreak: number;
}

const FALLBACK_PROFILE: GamificationProfile = {
  currentStreak: 5,
  longestStreak: 14,
  totalXp: 450,
  level: 3,
  nextLevelXp: 600,
  allBadges: [
    { key: 'first_post', name: 'First Post', description: 'Published your first post', icon: '📝', earned: true },
    { key: 'streak_3', name: '3-Day Streak', description: 'Posted 3 days in a row', icon: '🔥', earned: true },
    { key: 'streak_7', name: 'Weekly Warrior', description: '7-day posting streak', icon: '⚡', earned: false },
    { key: 'streak_30', name: 'Monthly Machine', description: '30-day posting streak', icon: '🏆', earned: false },
    { key: 'posts_10', name: 'Content Creator', description: 'Published 10 posts', icon: '✨', earned: true },
    { key: 'posts_50', name: 'Prolific Creator', description: 'Published 50 posts', icon: '💎', earned: false },
    { key: 'posts_100', name: 'Content Legend', description: 'Published 100 posts', icon: '👑', earned: false },
    { key: 'ai_10', name: 'AI Explorer', description: 'Used AI 10 times', icon: '🤖', earned: true },
    { key: 'viral_hit', name: 'Viral Hit', description: 'A post scored 80+ viral score', icon: '🚀', earned: false },
    { key: 'multi_platform', name: 'Multi-Platform', description: 'Connected 3+ platforms', icon: '🌐', earned: false },
    { key: 'early_adopter', name: 'Early Adopter', description: 'Joined during beta', icon: '🌟', earned: true },
    { key: 'level_5', name: 'Rising Star', description: 'Reached level 5', icon: '⭐', earned: false },
  ],
};

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: '1', name: 'Alex Creator', avatarUrl: null, totalXp: 2400, level: 13, currentStreak: 28 },
  { rank: 2, userId: '2', name: 'Sara Growth', avatarUrl: null, totalXp: 1850, level: 10, currentStreak: 15 },
  { rank: 3, userId: '3', name: 'Mike Viral', avatarUrl: null, totalXp: 1200, level: 7, currentStreak: 9 },
  { rank: 4, userId: '4', name: 'Luna Content', avatarUrl: null, totalXp: 900, level: 5, currentStreak: 6 },
  { rank: 5, userId: '5', name: 'Dev Studio', avatarUrl: null, totalXp: 650, level: 4, currentStreak: 3 },
];

export default function GamificationPage() {
  const [profile, setProfile] = useState<GamificationProfile>(FALLBACK_PROFILE);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(FALLBACK_LEADERBOARD);
  const [tab, setTab] = useState<'overview' | 'badges' | 'leaderboard'>('overview');

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, lbRes] = await Promise.all([
        api.get('/gamification/profile'),
        api.get('/gamification/leaderboard'),
      ]);
      setProfile(profileRes.data?.data || profileRes.data || FALLBACK_PROFILE);
      setLeaderboard(lbRes.data?.data || lbRes.data || FALLBACK_LEADERBOARD);
    } catch {
      // Fallback for demo
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const earnedCount = profile.allBadges.filter((b) => b.earned).length;
  const xpProgress = Math.min((profile.totalXp / profile.nextLevelXp) * 100, 100);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">🎮 Gamification</h1>
        <p className="text-slate-400 text-sm">Earn XP, unlock badges, and compete on the leaderboard.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon="🔥" label="Current Streak" value={`${profile.currentStreak}d`} />
        <StatCard icon="⚡" label="Longest Streak" value={`${profile.longestStreak}d`} />
        <StatCard icon="✨" label="Total XP" value={profile.totalXp.toLocaleString()} />
        <StatCard icon="📈" label="Level" value={profile.level.toString()} />
        <StatCard icon="🏅" label="Badges" value={`${earnedCount}/${profile.allBadges.length}`} />
      </div>

      {/* XP Progress */}
      <div className="dashboard-panel rounded-2xl p-5 border border-white/5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Level {profile.level}</span>
          <span className="text-slate-400">{profile.totalXp} / {profile.nextLevelXp} XP</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${xpProgress}%`,
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {profile.nextLevelXp - profile.totalXp} XP to Level {profile.level + 1}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['overview', 'badges', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              tab === t
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {t === 'overview' ? '📊 Overview' : t === 'badges' ? '🏅 Badges' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Badges */}
          <div className="dashboard-panel rounded-2xl p-5 border border-white/5">
            <h3 className="text-white font-semibold mb-4">Recent Badges</h3>
            <div className="space-y-3">
              {profile.allBadges
                .filter((b) => b.earned)
                .slice(0, 5)
                .map((badge) => (
                  <div key={badge.key} className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm text-white font-medium">{badge.name}</p>
                      <p className="text-xs text-slate-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Streak Calendar Visual */}
          <div className="dashboard-panel rounded-2xl p-5 border border-white/5">
            <h3 className="text-white font-semibold mb-4">Streak Tips</h3>
            <div className="space-y-4">
              <Tip icon="📝" text="Post at least once per day to keep your streak alive" />
              <Tip icon="🤖" text="Use AI to generate content faster — earn 5 XP per generation" />
              <Tip icon="🔗" text="Connect 3+ platforms to unlock the Multi-Platform badge" />
              <Tip icon="🎯" text="Each published post earns 25 XP — draft first, publish when ready" />
              <Tip icon="⭐" text={`Reach Level 5 (${Math.max(0, 1000 - profile.totalXp)} more XP) for the Rising Star badge`} />
            </div>
          </div>
        </div>
      )}

      {tab === 'badges' && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {profile.allBadges.map((badge) => (
            <div
              key={badge.key}
              className={`dashboard-panel rounded-xl p-4 border transition-all text-center ${
                badge.earned
                  ? 'border-purple-500/30 bg-purple-500/5'
                  : 'border-white/5 opacity-50 grayscale'
              }`}
            >
              <span className="text-4xl block mb-2">{badge.icon}</span>
              <p className="text-sm font-semibold text-white">{badge.name}</p>
              <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
              {badge.earned && (
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  ✓ Earned
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="dashboard-panel rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left p-4">#</th>
                <th className="text-left p-4">Creator</th>
                <th className="text-right p-4">XP</th>
                <th className="text-right p-4">Level</th>
                <th className="text-right p-4">Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm">
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                        {entry.name[0]}
                      </div>
                      <span className="text-sm text-white font-medium">{entry.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm text-purple-400 font-medium">{entry.totalXp.toLocaleString()}</td>
                  <td className="p-4 text-right text-sm text-slate-300">{entry.level}</td>
                  <td className="p-4 text-right text-sm text-orange-400">{entry.currentStreak}🔥</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="dashboard-panel rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg mt-0.5">{icon}</span>
      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}
