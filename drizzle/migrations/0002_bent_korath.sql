CREATE TYPE "public"."organizations_plan" AS ENUM('FREE', 'PRO', 'PREMIUM');--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "plan" "organizations_plan" DEFAULT 'FREE' NOT NULL;