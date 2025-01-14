ALTER TYPE "public"."artists_roles_enum" ADD VALUE 'fictional';--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "role" SET NOT NULL;