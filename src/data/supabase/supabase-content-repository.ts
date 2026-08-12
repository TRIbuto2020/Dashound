import "server-only";

import type { ContentRepository } from "@/src/core/content/repository";
import type {
  ContentPage,
  PageBlock,
  Recommendation,
  RecommendationCategory,
} from "@/src/core/content/types";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

type PageRow = {
  id: string;
  slug: string;
  kind: ContentPage["kind"];
  status: ContentPage["status"];
  eyebrow: string;
  title: string;
  summary: string;
  featured: boolean;
  featured_position: number | null;
  card: ContentPage["card"];
  seo: ContentPage["seo"];
  published_at: string | null;
  updated_at: string;
};

type BlockRow = {
  page_id: string;
  position: number;
  payload: PageBlock;
};

type RecommendationRow = {
  id: string;
  category_id: string;
  status: Recommendation["status"];
  eyebrow: string;
  title: string;
  description: string;
  url: string;
  image: string | null;
  image_alt: string | null;
  placeholder: string | null;
  action: string;
  position: number;
  is_affiliate: boolean;
};

function mapPage(page: PageRow, blocks: PageBlock[] = []): ContentPage {
  return {
    id: page.id,
    slug: page.slug,
    kind: page.kind,
    status: page.status,
    eyebrow: page.eyebrow,
    title: page.title,
    summary: page.summary,
    featured: page.featured,
    featuredPosition: page.featured_position ?? undefined,
    card: page.card,
    seo: page.seo,
    blocks,
    publishedAt: page.published_at ?? undefined,
    updatedAt: page.updated_at,
  };
}

function mapRecommendation(recommendation: RecommendationRow): Recommendation {
  return {
    id: recommendation.id,
    categoryId: recommendation.category_id,
    status: recommendation.status,
    eyebrow: recommendation.eyebrow,
    title: recommendation.title,
    description: recommendation.description,
    url: recommendation.url,
    image: recommendation.image ?? undefined,
    imageAlt: recommendation.image_alt ?? undefined,
    placeholder: recommendation.placeholder ?? undefined,
    action: recommendation.action,
    position: recommendation.position,
    isAffiliate: recommendation.is_affiliate,
  };
}

export class SupabaseContentRepository implements ContentRepository {
  async listPublishedPages(): Promise<ContentPage[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("status", "published")
      .order("featured_position", { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Could not load published pages: ${error.message}`);
    }

    return (data as PageRow[]).map((page) => mapPage(page));
  }

  async getPublishedPage(slug: string): Promise<ContentPage | null> {
    const supabase = await createSupabaseServerClient();
    const { data: pageData, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (pageError) {
      throw new Error(`Could not load page: ${pageError.message}`);
    }

    if (!pageData) {
      return null;
    }

    const { data: blockData, error: blockError } = await supabase
      .from("page_blocks")
      .select("page_id, position, payload")
      .eq("page_id", pageData.id)
      .order("position");

    if (blockError) {
      throw new Error(`Could not load page blocks: ${blockError.message}`);
    }

    return mapPage(
      pageData as PageRow,
      (blockData as BlockRow[]).map((block) => block.payload),
    );
  }

  async listRecommendationCategories(): Promise<RecommendationCategory[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("recommendation_categories")
      .select("id, title, description, position")
      .order("position");

    if (error) {
      throw new Error(`Could not load recommendation categories: ${error.message}`);
    }

    return data as RecommendationCategory[];
  }

  async listPublishedRecommendations(): Promise<Recommendation[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .eq("status", "published")
      .order("position");

    if (error) {
      throw new Error(`Could not load recommendations: ${error.message}`);
    }

    return (data as RecommendationRow[]).map(mapRecommendation);
  }
}
