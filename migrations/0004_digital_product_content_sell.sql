-- Digital Product Ecosystem: Add product-to-post linking for content-to-sell
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "attachedProductId" TEXT;

-- Index for fast lookups of posts with attached products
CREATE INDEX IF NOT EXISTS "posts_attachedProductId_idx" ON "posts"("attachedProductId");

-- Foreign key (optional, depends on enforcement preference)
DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_attachedProductId_fkey"
    FOREIGN KEY ("attachedProductId") REFERENCES "products"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
