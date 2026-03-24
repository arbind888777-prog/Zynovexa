CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "niche" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "profiles_userId_key" ON "profiles"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_email_key" ON "profiles"("email");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_userId_fkey'
    ) THEN
        ALTER TABLE "profiles"
        ADD CONSTRAINT "profiles_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

INSERT INTO "profiles" (
    "id",
    "userId",
    "email",
    "name",
    "handle",
    "avatarUrl",
    "bio",
    "website",
    "niche",
    "timezone",
    "onboardingCompleted",
    "isVerified",
    "createdAt",
    "updatedAt"
)
SELECT
    u."id",
    u."id",
    u."email",
    u."name",
    u."handle",
    u."avatarUrl",
    u."bio",
    u."website",
    u."niche",
    u."timezone",
    u."onboardingCompleted",
    u."isVerified",
    u."createdAt",
    u."updatedAt"
FROM "users" u
ON CONFLICT ("userId") DO UPDATE SET
    "email" = EXCLUDED."email",
    "name" = EXCLUDED."name",
    "handle" = EXCLUDED."handle",
    "avatarUrl" = EXCLUDED."avatarUrl",
    "bio" = EXCLUDED."bio",
    "website" = EXCLUDED."website",
    "niche" = EXCLUDED."niche",
    "timezone" = EXCLUDED."timezone",
    "onboardingCompleted" = EXCLUDED."onboardingCompleted",
    "isVerified" = EXCLUDED."isVerified",
    "updatedAt" = EXCLUDED."updatedAt";

CREATE OR REPLACE FUNCTION sync_profile_from_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "profiles" (
        "id",
        "userId",
        "email",
        "name",
        "handle",
        "avatarUrl",
        "bio",
        "website",
        "niche",
        "timezone",
        "onboardingCompleted",
        "isVerified",
        "createdAt",
        "updatedAt"
    )
    VALUES (
        NEW."id",
        NEW."id",
        NEW."email",
        NEW."name",
        NEW."handle",
        NEW."avatarUrl",
        NEW."bio",
        NEW."website",
        NEW."niche",
        NEW."timezone",
        NEW."onboardingCompleted",
        NEW."isVerified",
        NEW."createdAt",
        NEW."updatedAt"
    )
    ON CONFLICT ("userId") DO UPDATE SET
        "email" = EXCLUDED."email",
        "name" = EXCLUDED."name",
        "handle" = EXCLUDED."handle",
        "avatarUrl" = EXCLUDED."avatarUrl",
        "bio" = EXCLUDED."bio",
        "website" = EXCLUDED."website",
        "niche" = EXCLUDED."niche",
        "timezone" = EXCLUDED."timezone",
        "onboardingCompleted" = EXCLUDED."onboardingCompleted",
        "isVerified" = EXCLUDED."isVerified",
        "updatedAt" = EXCLUDED."updatedAt";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_sync_profile_trigger ON "users";
CREATE TRIGGER users_sync_profile_trigger
AFTER INSERT OR UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION sync_profile_from_user();

CREATE OR REPLACE FUNCTION delete_profile_from_user()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM "profiles" WHERE "userId" = OLD."id";
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_delete_profile_trigger ON "users";
CREATE TRIGGER users_delete_profile_trigger
AFTER DELETE ON "users"
FOR EACH ROW
EXECUTE FUNCTION delete_profile_from_user();