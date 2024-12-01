ALTER TABLE "movies" ALTER COLUMN "poster_url" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "poster_url" DROP NOT NULL;