-- Gamification: User Streaks
CREATE TABLE IF NOT EXISTS "user_streaks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "lastActiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Gamification: User Badges
CREATE TABLE IF NOT EXISTS "user_badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "streakId" TEXT NOT NULL,
    "badgeKey" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_badges_streakId_fkey" FOREIGN KEY ("streakId") REFERENCES "user_streaks"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_badges_streakId_badgeKey_key" UNIQUE ("streakId", "badgeKey")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "user_streaks_userId_idx" ON "user_streaks"("userId");
CREATE INDEX IF NOT EXISTS "user_badges_streakId_idx" ON "user_badges"("streakId");
CREATE INDEX IF NOT EXISTS "user_streaks_totalXp_idx" ON "user_streaks"("totalXp" DESC);
CREATE INDEX IF NOT EXISTS "user_streaks_lastActiveDate_idx" ON "user_streaks"("lastActiveDate");
