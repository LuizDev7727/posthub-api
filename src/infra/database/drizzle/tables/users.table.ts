import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { organizationsTable } from "./organizations.table";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


export const usersTableRelations = relations(usersTable, ({ one }) => ({
	organizations: one(organizationsTable),
}));
