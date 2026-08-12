import { ResourceCard } from "@/components/resource-card";
import type {
  Recommendation,
  RecommendationCategory,
} from "@/src/core/content/types";

type RecommendationSectionsProps = {
  categories: RecommendationCategory[];
  recommendations: Recommendation[];
};

export function RecommendationSections({
  categories,
  recommendations,
}: RecommendationSectionsProps) {
  return categories.map((category) => {
    const categoryRecommendations = recommendations.filter(
      (recommendation) => recommendation.categoryId === category.id,
    );

    if (categoryRecommendations.length === 0) {
      return null;
    }

    return (
      <section className="section-block" key={category.id}>
        <h3 className="section-block__title">{category.title}</h3>
        {category.description && (
          <p className="section-block__text">{category.description}</p>
        )}
        <div className="resource-grid">
          {categoryRecommendations.map((recommendation) => (
            <ResourceCard
              key={recommendation.id}
              href={recommendation.url}
              eyebrow={recommendation.eyebrow}
              title={recommendation.title}
              text={recommendation.description}
              action={recommendation.action}
              image={recommendation.image}
              imageAlt={recommendation.imageAlt}
              placeholder={recommendation.placeholder}
              mediaModifier={
                recommendation.id === "katy-strava"
                  ? "strava"
                  : recommendation.id === "katy-instagram"
                    ? "instagram"
                    : undefined
              }
              external
            />
          ))}
        </div>
      </section>
    );
  });
}
