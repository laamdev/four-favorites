ALTER TABLE "favorites" ALTER COLUMN "featuredCategory" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."featured_categories_enum";--> statement-breakpoint
CREATE TYPE "public"."featured_categories_enum" AS ENUM('oscar_winners', 'old_directors', 'new_directors', 'new_stars', 'old_stars');--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "featuredCategory" SET DATA TYPE "public"."featured_categories_enum" USING "featuredCategory"::"public"."featured_categories_enum";--> statement-breakpoint
ALTER TABLE "favorites" DROP COLUMN "isFeatured";