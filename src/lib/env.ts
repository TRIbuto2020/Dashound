import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

const serverEnvironmentSchema = z.object({
  CONTENT_SOURCE: z.enum(["local", "supabase"]).default("local"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  ADMIN_EMAIL: z.email().optional(),
  CRON_SECRET: z.string().min(16).optional(),
});

export const publicEnvironment = publicEnvironmentSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || undefined,
});

export const hasSupabaseEnvironment = Boolean(
  publicEnvironment.NEXT_PUBLIC_SUPABASE_URL &&
    publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export const serverEnvironment = serverEnvironmentSchema.parse({
  CONTENT_SOURCE: process.env.CONTENT_SOURCE,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
  CRON_SECRET: process.env.CRON_SECRET || undefined,
});
