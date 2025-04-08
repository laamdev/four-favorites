CREATE TYPE "public"."featured_categories_enum" AS ENUM('oscar_winners', 'classic_directors', 'new_releases', 'staff_picks');--> statement-breakpoint
CREATE TABLE "favorites_to_featured_categories" (
	"favorite_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "favorites_to_featured_categories_pkey" PRIMARY KEY("favorite_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "featured_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" varchar,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "featured_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "favorites_to_featured_categories" ADD CONSTRAINT "favorites_to_featured_categories_favorite_id_fkey" FOREIGN KEY ("favorite_id") REFERENCES "public"."favorites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites_to_featured_categories" ADD CONSTRAINT "favorites_to_featured_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."featured_categories"("id") ON DELETE no action ON UPDATE no action;