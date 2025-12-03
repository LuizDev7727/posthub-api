ALTER TABLE "best_moments" RENAME COLUMN "video_url" TO "storage_key";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "thumbnail_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" DROP NOT NULL;