import Image from "next/image";
import type { ContentPage } from "@/src/core/content/types";
import { ResourceCard } from "@/components/resource-card";
import dashoundLogo from "@/src/images/Dashound.svg";

export function PageCard({ page }: { page: ContentPage }) {
  const isTtLowbudget = page.slug === "tt-lowbudget";

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
      mediaContent={
        isTtLowbudget ? (
          <div className="resource-card__tt-visual">
            <div className="resource-card__tt-logo-frame">
              <Image
                className="resource-card__tt-logo"
                src={dashoundLogo}
                alt=""
              />
            </div>
            <span className="resource-card__tt-title">TT Lowbudget</span>
          </div>
        ) : undefined
      }
      mediaModifier={isTtLowbudget ? "tt" : undefined}
    />
  );
}
