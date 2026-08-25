import { NextResponse } from "next/server";
import { hasSupabaseEnvironment, serverEnvironment } from "@/src/lib/env";
import { createSupabasePublicClient } from "@/src/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = serverEnvironment.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  if (!hasSupabaseEnvironment) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const supabase = createSupabasePublicClient();
  const [pages, pageBlocks, recommendations] = await Promise.all([
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("page_blocks").select("id", { count: "exact", head: true }),
    supabase.from("recommendations").select("id", { count: "exact", head: true }),
  ]);

  const databaseError = [pages.error, pageBlocks.error, recommendations.error].find(
    Boolean,
  );

  if (databaseError) {
    return NextResponse.json(
      { ok: false, error: databaseError.message },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    counts: {
      pages: pages.count ?? 0,
      pageBlocks: pageBlocks.count ?? 0,
      recommendations: recommendations.count ?? 0,
    },
  });
}
