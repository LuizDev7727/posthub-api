import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "./projects.table";
import { postsTable } from "./posts.table";
import { uuidv7 } from "uuidv7";

export const bestMomentsTable = pgTable("best_moments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text("title").notNull(),
  storageKey: text("storage_key").notNull(), //change to storageKey
  projectId: text("project_id").references(() => projectsTable.id, {
    onDelete: "cascade",
  }),
  postId: text("post_id").references(() => postsTable.id, {
    onDelete: "cascade",
  }),
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
