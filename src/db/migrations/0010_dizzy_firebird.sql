ALTER TABLE "movies" ALTER COLUMN "genres" SET DATA TYPE varchar[];--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "genres" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "genres" DROP NOT NULL;