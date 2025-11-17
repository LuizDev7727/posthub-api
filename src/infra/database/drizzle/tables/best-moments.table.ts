import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.table";
import { relations } from "drizzle-orm";
import { projectsTable } from "./projects.table";
import { postsTable } from "./posts.table";

export const bestMomentsTable = pgTable("best_moments", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  projectId: text("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .references(() => postsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bestMomentsRelations = relations(bestMomentsTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [bestMomentsTable.projectId],
    references: [projectsTable.id],
  }),
  post: one(postsTable, {
    fields: [bestMomentsTable.projectId],
    references: [postsTable.id],
  }),
}));