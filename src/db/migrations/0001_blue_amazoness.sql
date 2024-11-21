CREATE TABLE IF NOT EXISTS "user_likes" (
	"user_id" varchar NOT NULL,
	"favorite_id" integer NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_likes_user_id_favorite_id_pk" PRIMARY KEY("user_id","favorite_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_favorite_id_favorites_id_fk" FOREIGN KEY ("favorite_id") REFERENCES "public"."favorites"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
