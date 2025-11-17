import { env } from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { tables } from "./tables";

export const db = drizzle(env.DATABASE_URL, {
  schema: tables,
  logger: env.NODE_ENV === 'development',
  casing: 'snake_case',
})