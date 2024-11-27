ALTER TYPE "public"."artists_roles_enum" ADD VALUE 'costume' BEFORE 'singer';--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "genres" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "genres" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "genres" SET NOT NULL;