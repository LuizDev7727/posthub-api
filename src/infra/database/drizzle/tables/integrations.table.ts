import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, varchar, text } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { organizationsTable } from './organizations.table';

export const providerEnum = pgEnum('provider', ['YOUTUBE']);

export const integrationsTable = pgTable('integrations', {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  name: varchar().notNull(),
  email: varchar().notNull(),
  avatarUrl: varchar("avatar_url"),
  accessToken: varchar("access_token").notNull(),
  provider: providerEnum().notNull(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationsTable.id, {
      onDelete: 'cascade',
    }),
});

export const integrationsRelations = relations(integrationsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [integrationsTable.organizationId],
    references: [organizationsTable.id],
  }),
}));