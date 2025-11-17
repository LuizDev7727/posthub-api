import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations.table";
import { usersTable } from "./users.table";

export const invitationsTable = pgTable("invitations", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});