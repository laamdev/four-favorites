-- Remove category_id from favorites table
ALTER TABLE "favorites" DROP COLUMN IF EXISTS "category_id";

-- Ensure favorites_to_featured_categories table exists with correct structure
CREATE TABLE IF NOT EXISTS "favorites_to_featured_categories" (
  "favorite_id" integer NOT NULL,
  "category_id" integer NOT NULL,
  "display_order" integer NOT NULL DEFAULT 0,
  CONSTRAINT "favorites_to_featured_categories_pkey" PRIMARY KEY ("favorite_id", "category_id"),
  CONSTRAINT "favorites_to_featured_categories_favorite_id_fkey" FOREIGN KEY ("favorite_id") REFERENCES "favorites"("id") ON DELETE CASCADE,
  CONSTRAINT "favorites_to_featured_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "featured_categories"("id") ON DELETE CASCADE
); 