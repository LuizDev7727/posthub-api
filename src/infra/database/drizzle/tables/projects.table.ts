import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { organizationsTable } from "./organizations.table";
import { timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.table";
import { bestMomentsTable } from "./best-moments.table";

export const projectStatusEnum = pgEnum("project_status", [
  "SUCCESS",
  "PROCESSING",
  "SCHEDULED",
  "ERROR",
]);

export const projectsTable = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar().notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: projectStatusEnum().notNull().default("PROCESSING"),
  organizationSlug: text("organization_slug")
    .notNull()
    .references(() => organizationsTable.id, {
      onDelete: "cascade",
    }),
  ownerId: text("owner_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "set null",
    }),
});

export const projectsRelations = relations(projectsTable, ({ one, many }) => ({
  bestMoments: many(bestMomentsTable),
  organization: one(organizationsTable, {
    fields: [projectsTable.organizationSlug],
    references: [organizationsTable.id],
  }),
  owner: one(usersTable, {
    fields: [projectsTable.ownerId],
    references: [usersTable.id],
  }),
}));
