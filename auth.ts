import { env } from "@/env";
import { db } from "@/infra/database/drizzle/client";
import { tables } from "@/infra/database/drizzle/tables";
import { accountsTable } from "@/infra/database/drizzle/tables/accounts.table";
import { invitationsTable } from "@/infra/database/drizzle/tables/invitations.table";
import { membersTable } from "@/infra/database/drizzle/tables/members.table";
import { organizationsTable } from "@/infra/database/drizzle/tables/organizations.table";
import { sessionsTable } from "@/infra/database/drizzle/tables/sessions.table";
import { usersTable } from "@/infra/database/drizzle/tables/users.table";
import { verificationsTable } from "@/infra/database/drizzle/tables/verifications.table";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:5173"],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      ...tables,
      accounts: accountsTable,
      invitations: invitationsTable,
      members: membersTable,
      organizations: organizationsTable,
      sessions: sessionsTable,
      users: usersTable,
      verifications: verificationsTable,
    },
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    organization({
      organizationHooks: {
        beforeCreateOrganization: async ({ organization, user }) => {
          return {
            data: {
              ...organization,
              metadata: {
                ownerId: user.id,
              },
            },
          };
        },
      },
    }),
  ],
});
