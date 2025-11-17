import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { organizationsTable } from "./organizations.table";

export const projectStatusEnum = pgEnum("project_status", [
  "SUCCESS",
  "PROCESSING",
  "SCHEDULED",
  "ERROR",
]);

export const projectsTable = pgTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  title: varchar().notNull(),
  thumbnailUrl: varchar('thumbnail_url').notNull(),
  status: projectStatusEnum().notNull().default("PROCESSING"),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizationsTable.id, {
      onDelete: "cascade",
    }),
});

export const projectsRelations = relations(projectsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [projectsTable.organizationId],
    references: [organizationsTable.id],
  }),
}));