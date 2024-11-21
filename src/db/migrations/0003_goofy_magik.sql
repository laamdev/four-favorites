CREATE TABLE IF NOT EXISTS "user_movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"movie_id" integer NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_movies_user_id_movie_id_unique" UNIQUE("user_id","movie_id"),
	CONSTRAINT "user_movies_user_id_position_unique" UNIQUE("user_id","position"),
	CONSTRAINT "position_range" CHECK (position between 1 and 4)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
