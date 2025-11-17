CREATE TABLE "best_moments" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"video_url" text NOT NULL,
	"project_id" text,
	"post_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "best_moments" ADD CONSTRAINT "best_moments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "best_moments" ADD CONSTRAINT "best_moments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;