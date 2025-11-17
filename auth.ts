import { db } from "@/infra/database/drizzle/client";
import { tables } from "@/infra/database/drizzle/tables";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { uuidv7 } from "uuidv7";

export const auth = betterAuth({
  trustedOrigins: [
    'http://localhost:5173'
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: tables
  }),
  advanced: {
    database: {
      generateId: () => uuidv7()
    }
  },
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    organization()
  ]
});