import type {
  ContentPage,
  Recommendation,
  RecommendationCategory,
} from "@/src/core/content/types";

export interface ContentRepository {
  listPublishedPages(): Promise<ContentPage[]>;
  getPublishedPage(slug: string): Promise<ContentPage | null>;
  listRecommendationCategories(): Promise<RecommendationCategory[]>;
  listPublishedRecommendations(): Promise<Recommendation[]>;
}
