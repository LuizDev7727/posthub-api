import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations.table";
import { usersTable } from "./users.table";
import { uuidv7 } from "uuidv7";

export const membersTable = pgTable("members", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  organizationSlug: text("organization_slug")
    .notNull()
    .references(() => organizationsTable.slug, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
});
