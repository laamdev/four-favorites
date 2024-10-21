DO $$ BEGIN
 CREATE TYPE "public"."artists_roles_enum" AS ENUM('actor', 'director', 'producer', 'writer', 'composer', 'singer', 'musician');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."favorites_categories" AS ENUM('all', 'horror', 'family', 'overall');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"favorite_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"role" "artists_roles_enum" DEFAULT 'actor' NOT NULL,
	"headshot_url" varchar DEFAULT 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/' NOT NULL,
	CONSTRAINT "artists_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"votes" numeric DEFAULT '0' NOT NULL,
	"publishing_date" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"video_url" varchar DEFAULT 'https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA' NOT NULL,
	"category" "favorites_categories" DEFAULT 'all' NOT NULL,
	CONSTRAINT "favorites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"overview" varchar NOT NULL,
	"director" varchar NOT NULL,
	"country" varchar DEFAULT 'US' NOT NULL,
	"genres" varchar[],
	"release_date" timestamp(3) with time zone NOT NULL,
	"poster_url" varchar DEFAULT 'https://image.tmdb.org/t/p/w1280/' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "movies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies_to_favorites" (
	"movie_id" integer NOT NULL,
	"favorite_id" integer NOT NULL,
	CONSTRAINT "movies_to_favorites_movie_id_favorite_id_pk" PRIMARY KEY("movie_id","favorite_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artists" ADD CONSTRAINT "artists_favorite_id_favorites_id_fk" FOREIGN KEY ("favorite_id") REFERENCES "public"."favorites"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies_to_favorites" ADD CONSTRAINT "movies_to_favorites_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies_to_favorites" ADD CONSTRAINT "movies_to_favorites_favorite_id_favorites_id_fk" FOREIGN KEY ("favorite_id") REFERENCES "public"."favorites"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
