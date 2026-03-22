ALTER TABLE "posts"
ADD COLUMN "attachedProductId" TEXT;

ALTER TABLE "posts"
ADD CONSTRAINT "posts_attachedProductId_fkey"
FOREIGN KEY ("attachedProductId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;