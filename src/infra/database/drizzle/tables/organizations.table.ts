import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.table";
import { projectsTable } from "./projects.table";
import { integrationsTable } from "./integrations.table";

export const organizationsPlanEnum = pgEnum("organizations_plan", [
  "FREE",
  "PRO",
  "PREMIUM",
]);

export const organizationsTable = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  plan: organizationsPlanEnum().notNull().default('FREE'),
  ownerId: text("owner_id")
  .notNull()
  .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const organizationsTableRelations = relations(organizationsTable, ({ one, many }) => ({
  projects: many(projectsTable),
  integrations: many(integrationsTable),
	owner: one(usersTable, { fields: [organizationsTable.ownerId], references: [usersTable.id] }),
}));
