import type { ContentRepository } from "@/src/core/content/repository";
import type {
  ContentPage,
  Recommendation,
  RecommendationCategory,
} from "@/src/core/content/types";
import { pages } from "@/src/data/local/pages";
import {
  recommendationCategories,
  recommendations,
} from "@/src/data/local/recommendations";

export class LocalContentRepository implements ContentRepository {
  async listPublishedPages(): Promise<ContentPage[]> {
    return pages
      .filter((page) => page.status === "published")
      .sort(
        (first, second) =>
          (first.featuredPosition ?? Number.MAX_SAFE_INTEGER) -
          (second.featuredPosition ?? Number.MAX_SAFE_INTEGER),
      );
  }

  async getPublishedPage(slug: string): Promise<ContentPage | null> {
    return (
      pages.find((page) => page.slug === slug && page.status === "published") ?? null
    );
  }

  async listRecommendationCategories(): Promise<RecommendationCategory[]> {
    return [...recommendationCategories].sort((first, second) => first.position - second.position);
  }

  async listPublishedRecommendations(): Promise<Recommendation[]> {
    return recommendations
      .filter((recommendation) => recommendation.status === "published")
      .sort((first, second) => first.position - second.position);
  }
}
