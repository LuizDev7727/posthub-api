CREATE TYPE "public"."provider" AS ENUM('YOUTUBE');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('SUCCESS', 'PROCESSING', 'SCHEDULED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('SUCCESS', 'PROCESSING', 'SCHEDULED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."social_type" AS ENUM('YOUTUBE');--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"avatar_url" varchar,
	"access_token" varchar NOT NULL,
	"provider" "provider" NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"thumbnail_url" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"size" integer NOT NULL,
	"status" "post_status" DEFAULT 'PROCESSING' NOT NULL,
	"scheduled_to" timestamp with time zone DEFAULT now() NOT NULL,
	"owner_id" text NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"thumbnail_url" varchar NOT NULL,
	"status" "project_status" DEFAULT 'PROCESSING' NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "socials_to_post" (
	"id" text PRIMARY KEY NOT NULL,
	"social" "social_type" NOT NULL,
	"post_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "socials_to_post" ADD CONSTRAINT "socials_to_post_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;