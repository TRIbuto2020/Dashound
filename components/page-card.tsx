import type { ContentPage } from "@/src/core/content/types";
import { ResourceCard } from "@/components/resource-card";

export function PageCard({ page }: { page: ContentPage }) {
  return (
    <ResourceCard
      href={`/projetos/${page.slug}`}
      eyebrow={page.card.eyebrow}
      title={page.card.title}
      text={page.card.text}
      action={page.card.action}
      image={page.card.image}
      imageAlt={page.card.imageAlt}
      mosaic={page.card.mosaic}
      placeholder={page.card.placeholder}
      mediaModifier={page.slug === "tt-lowbudget" ? "tt" : undefined}
    />
  );
}
