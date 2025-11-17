import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.table";

export const organizationsTable = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  ownerId: text("owner_id")
  .notNull()
  .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const organizationsTableRelations = relations(organizationsTable, ({ one }) => ({
	owner: one(usersTable, { fields: [organizationsTable.ownerId], references: [usersTable.id] }),
}));
