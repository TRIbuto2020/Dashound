import "server-only";

import { redirect } from "next/navigation";
import { serverEnvironment } from "@/src/lib/env";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims?.email;

  if (error || !email || email !== serverEnvironment.ADMIN_EMAIL) {
    return null;
  }

  return {
    id: data.claims.sub,
    email,
  };
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
