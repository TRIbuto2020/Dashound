import type { ContentRepository } from "@/src/core/content/repository";
import { LocalContentRepository } from "@/src/data/local/local-content-repository";
import { SupabaseContentRepository } from "@/src/data/supabase/supabase-content-repository";
import { hasSupabaseEnvironment, serverEnvironment } from "@/src/lib/env";

let repository: ContentRepository | undefined;

export function getContentRepository(): ContentRepository {
  if (!repository) {
    repository =
      serverEnvironment.CONTENT_SOURCE === "supabase" && hasSupabaseEnvironment
        ? new SupabaseContentRepository()
        : new LocalContentRepository();
  }

  return repository;
}
