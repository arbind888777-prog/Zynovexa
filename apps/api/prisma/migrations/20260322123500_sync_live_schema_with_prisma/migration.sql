CREATE TYPE "ProductType" AS ENUM ('COURSE', 'DIGITAL', 'TEMPLATE', 'EBOOK', 'COACHING');

ALTER TABLE "commerce_purchases"
ADD COLUMN "platformFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "razorpayOrderId" TEXT,
ADD COLUMN "razorpayPayId" TEXT,
ADD COLUMN "refundReason" TEXT,
ADD COLUMN "sellerAmount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "product_accesses"
ADD COLUMN "downloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "downloadLimit" INTEGER NOT NULL DEFAULT 5;

ALTER TABLE "products"
ADD COLUMN "originalPrice" INTEGER,
ADD COLUMN "stock" INTEGER,
ADD COLUMN "tags" TEXT[],
ADD COLUMN "totalRevenue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalSales" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "type" "ProductType" NOT NULL DEFAULT 'DIGITAL';

ALTER TABLE "users"
ADD COLUMN "handle" TEXT,
ADD COLUMN "razorpayAccountId" TEXT,
ADD COLUMN "socialLinks" JSONB;

CREATE TABLE "user_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "lastActiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "streakId" TEXT NOT NULL,
    "badgeKey" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plan_features" (
    "id" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "maxSocialAccounts" INTEGER NOT NULL,
    "maxScheduledPosts" INTEGER NOT NULL,
    "aiContentGeneration" BOOLEAN NOT NULL DEFAULT false,
    "advancedAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "teamMembers" INTEGER NOT NULL DEFAULT 1,
    "customStorefront" BOOLEAN NOT NULL DEFAULT false,
    "prioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "platformFeePercent" DOUBLE PRECISION NOT NULL DEFAULT 5.0,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_streaks_userId_key" ON "user_streaks"("userId");
CREATE UNIQUE INDEX "user_badges_streakId_badgeKey_key" ON "user_badges"("streakId", "badgeKey");
CREATE UNIQUE INDEX "plan_features_plan_key" ON "plan_features"("plan");
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");

ALTER TABLE "user_streaks"
ADD CONSTRAINT "user_streaks_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_badges"
ADD CONSTRAINT "user_badges_streakId_fkey"
FOREIGN KEY ("streakId") REFERENCES "user_streaks"("id") ON DELETE CASCADE ON UPDATE CASCADE;