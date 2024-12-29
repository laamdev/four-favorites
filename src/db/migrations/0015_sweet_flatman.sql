ALTER TYPE "public"."artists_roles_enum" ADD VALUE 'cinematographer';--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "headshot_url" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "headshot_url" DROP NOT NULL;