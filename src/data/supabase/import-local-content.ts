import "server-only";

import { pages } from "@/src/data/local/pages";
import {
  recommendationCategories,
  recommendations,
} from "@/src/data/local/recommendations";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export type LocalContentImportStatus = {
  pages: { current: number; expected: number };
  blocks: { current: number; expected: number };
  categories: { current: number; expected: number };
  recommendations: { current: number; expected: number };
  isEmpty: boolean;
  isComplete: boolean;
};

const expectedBlockCount = pages.reduce((total, page) => total + page.blocks.length, 0);

export async function getLocalContentImportStatus(): Promise<LocalContentImportStatus> {
  const supabase = await createSupabaseServerClient();
  const [pageResult, blockResult, categoryResult, recommendationResult] = await Promise.all([
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("page_blocks").select("id", { count: "exact", head: true }),
    supabase.from("recommendation_categories").select("id", { count: "exact", head: true }),
    supabase.from("recommendations").select("id", { count: "exact", head: true }),
  ]);

  const firstError = [
    pageResult.error,
    blockResult.error,
    categoryResult.error,
    recommendationResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(`Não foi possível verificar a importação: ${firstError.message}`);
  }

  const status = {
    pages: { current: pageResult.count ?? 0, expected: pages.length },
    blocks: { current: blockResult.count ?? 0, expected: expectedBlockCount },
    categories: {
      current: categoryResult.count ?? 0,
      expected: recommendationCategories.length,
    },
    recommendations: {
      current: recommendationResult.count ?? 0,
      expected: recommendations.length,
    },
  };
  const counts = Object.values(status);

  return {
    ...status,
    isEmpty: counts.every(({ current }) => current === 0),
    isComplete: counts.every(({ current, expected }) => current === expected),
  };
}

async function cleanPartialImport() {
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("recommendations")
    .delete()
    .in(
      "id",
      recommendations.map((recommendation) => recommendation.id),
    );
  await supabase
    .from("pages")
    .delete()
    .in(
      "slug",
      pages.map((page) => page.slug),
    );
  await supabase
    .from("recommendation_categories")
    .delete()
    .in(
      "id",
      recommendationCategories.map((category) => category.id),
    );
}

export async function importLocalContentToSupabase() {
  const initialStatus = await getLocalContentImportStatus();

  if (initialStatus.isComplete) {
    return initialStatus;
  }

  if (!initialStatus.isEmpty) {
    throw new Error("O banco já contém uma importação parcial ou conteúdo criado manualmente.");
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { error: categoryError } = await supabase
      .from("recommendation_categories")
      .insert(
        recommendationCategories.map((category) => ({
          id: category.id,
          title: category.title,
          description: category.description ?? null,
          position: category.position,
        })),
      );

    if (categoryError) {
      throw categoryError;
    }

    const { data: insertedPages, error: pageError } = await supabase
      .from("pages")
      .insert(
        pages.map((page) => ({
          slug: page.slug,
          kind: page.kind,
          status: page.status,
          eyebrow: page.eyebrow,
          title: page.title,
          summary: page.summary,
          featured: page.featured,
          featured_position: page.featuredPosition ?? null,
          card: page.card,
          seo: page.seo,
          published_at: page.publishedAt ?? null,
        })),
      )
      .select("id, slug");

    if (pageError) {
      throw pageError;
    }

    const pageIds = new Map(
      (insertedPages ?? []).map((page) => [page.slug as string, page.id as string]),
    );
    const blockRows = pages.flatMap((page) =>
      page.blocks.map((block, position) => ({
        page_id: pageIds.get(page.slug),
        type: block.type,
        position,
        payload: block,
      })),
    );

    if (blockRows.some((block) => !block.page_id)) {
      throw new Error("A importação não conseguiu relacionar todos os blocos às páginas.");
    }

    if (blockRows.length > 0) {
      const { error: blockError } = await supabase.from("page_blocks").insert(blockRows);

      if (blockError) {
        throw blockError;
      }
    }

    const { error: recommendationError } = await supabase.from("recommendations").insert(
      recommendations.map((recommendation) => ({
        id: recommendation.id,
        category_id: recommendation.categoryId,
        status: recommendation.status,
        eyebrow: recommendation.eyebrow,
        title: recommendation.title,
        description: recommendation.description,
        url: recommendation.url,
        image: recommendation.image ?? null,
        image_alt: recommendation.imageAlt ?? null,
        placeholder: recommendation.placeholder ?? null,
        action: recommendation.action,
        position: recommendation.position,
        is_affiliate: recommendation.isAffiliate,
      })),
    );

    if (recommendationError) {
      throw recommendationError;
    }
  } catch (error) {
    await cleanPartialImport();
    throw error;
  }

  const finalStatus = await getLocalContentImportStatus();

  if (!finalStatus.isComplete) {
    await cleanPartialImport();
    throw new Error("A conferência final da importação não corresponde ao conteúdo local.");
  }

  return finalStatus;
}
