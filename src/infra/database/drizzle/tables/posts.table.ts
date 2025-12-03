import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { usersTable } from "./users.table";
import { organizationsTable } from "./organizations.table";
import { socialsToPostTable } from "./socials-to-post.table";
import { bestMomentsTable } from "./best-moments.table";

export const postStatusEnum = pgEnum("post_status", [
  "SUCCESS",
  "PROCESSING",
  "SCHEDULED",
  "ERROR",
]);

export const postsTable = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  thumbnailUrl: varchar("thumbnail_url").notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  createdAt: timestamp("created_at").notNull(),
  size: integer().notNull(),
  duration: integer().notNull(),
  status: postStatusEnum().notNull().default("PROCESSING"),
  scheduledTo: timestamp("scheduled_to", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  organizationSlug: text("organization_slug")
    .notNull()
    .references(() => organizationsTable.slug, {
      onDelete: "cascade",
    }),
});

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  socialsToPost: many(socialsToPostTable),
  bestMoments: many(bestMomentsTable),

  organization: one(organizationsTable, {
    fields: [postsTable.organizationSlug],
    references: [organizationsTable.slug],
  }),

  owner: one(usersTable, {
    fields: [postsTable.ownerId],
    references: [usersTable.id],
  }),
}));
