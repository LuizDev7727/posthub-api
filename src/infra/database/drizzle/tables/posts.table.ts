import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { usersTable } from './users.table';
import { organizationsTable } from './organizations.table';
import { socialsToPostTable } from './socials-to-post.table';

export const statusEnum = pgEnum('post_status', [
  'SUCCESS',
  'PROCESSING',
  'SCHEDULED',
  'ERROR',
]);

export const postsTable = pgTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  thumbnailUrl: varchar("thumbnail_url").notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  createdAt: timestamp("created_at").notNull(),
  size: integer().notNull(),
  duration: integer().notNull(),
  status: statusEnum().notNull().default('PROCESSING'),
  scheduledTo: timestamp('scheduled_to', { withTimezone: true }).notNull().defaultNow(),
  ownerId: text("owner_id").notNull().references(() => usersTable.id, {
    onDelete: 'cascade'
  }),
  organizationId: text("organization_id").notNull().references(() => organizationsTable.id, {
    onDelete: 'cascade'
  }),
});

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  socialsToPost: many(socialsToPostTable),

  organization: one(organizationsTable, {
    fields: [postsTable.organizationId],
    references: [organizationsTable.id],
  }),

  owner: one(usersTable, {
    fields: [postsTable.ownerId],
    references: [usersTable.id],
  }),
}));