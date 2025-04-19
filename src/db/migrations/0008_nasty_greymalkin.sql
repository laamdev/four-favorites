ALTER TABLE "favorites" ALTER COLUMN "featuredCategory" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."featured_categories_enum";--> statement-breakpoint
CREATE TYPE "public"."featured_categories_enum" AS ENUM('oscar_winners', 'legendary_directors', 'new_stars');--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "featuredCategory" SET DATA TYPE "public"."featured_categories_enum" USING "featuredCategory"::"public"."featured_categories_enum";