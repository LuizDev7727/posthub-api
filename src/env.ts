import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.url().startsWith("postgresql://", {
    error: "Invalid database url.",
  }),
  R2_ENDPOINT: z.url(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  TRIGGER_SECRET_KEY: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
