-- Production upgrade: social_accounts
-- 1. Add scopes[] and reconnectRequired columns
-- 2. Drop old @@unique([userId, platform]) — allows only 1 account per platform
-- 3. Create new @@unique([userId, platform, platformUserId]) — multi-account per platform

-- AddColumn
ALTER TABLE "social_accounts" ADD COLUMN "scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AddColumn
ALTER TABLE "social_accounts" ADD COLUMN "reconnectRequired" BOOLEAN NOT NULL DEFAULT false;

-- DropIndex: old single-account-per-platform constraint
DROP INDEX IF EXISTS "social_accounts_userId_platform_key";

-- CreateIndex: new multi-account constraint keyed by platformUserId
-- Note: PostgreSQL treats each NULL as distinct, so manual-linked accounts
--       (platformUserId = NULL) do not clash with OAuth-linked ones.
CREATE UNIQUE INDEX "social_accounts_userId_platform_platformUserId_key"
  ON "social_accounts"("userId", "platform", "platformUserId");
