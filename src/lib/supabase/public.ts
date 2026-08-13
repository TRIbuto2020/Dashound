import "server-only";

import { createClient } from "@supabase/supabase-js";
import { publicEnvironment } from "@/src/lib/env";

export function createSupabasePublicClient() {
  const url = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
