import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ResourceCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  action: string;
  image?: string;
  imageAlt?: string;
  mosaic?: Array<{
    image: string;
    imageAlt: string;
  }>;
  placeholder?: string;
  mediaContent?: ReactNode;
  mediaModifier?: "strava" | "instagram" | "youtube" | "tt";
  external?: boolean;
};

export function ResourceCard({
  href,
  eyebrow,
  title,
  text,
  action,
  image,
  imageAlt = "",
  mosaic,
  placeholder,
  mediaContent,
  mediaModifier,
  external = false,
}: ResourceCardProps) {
  const mediaClasses = [
    "resource-card__media",
    !image && !mosaic && !mediaContent ? "resource-card__media--placeholder" : "",
    mosaic ? "resource-card__media--mosaic" : "",
    mediaModifier ? `resource-card__media--${mediaModifier}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div
        className={mediaClasses}
        aria-hidden={mediaContent || (!image && !mosaic) ? true : undefined}
      >
        {mediaContent ? (
          mediaContent
        ) : mosaic ? (
          mosaic.map((item) => (
            <Image
              key={item.image}
              src={item.image}
              alt={item.imageAlt}
              width={480}
              height={360}
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ))
        ) : image ? (
          <Image
            className="resource-card__image"
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
          />
        ) : (
          <span className="resource-card__placeholder">
            {placeholder?.split("\n").map((line, index) => (
              <span key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </span>
        )}
      </div>
      <div className="resource-card__content">
        <p className="resource-card__eyebrow">{eyebrow}</p>
        <h4 className="resource-card__title">{title}</h4>
        <p className="resource-card__text">{text}</p>
        <span className="resource-card__action">{action}</span>
      </div>
    </>
  );

  return (
    <article className="resource-card">
      {external ? (
        <a className="resource-card__link" href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      ) : (
        <Link className="resource-card__link" href={href}>
          {content}
        </Link>
      )}
    </article>
  );
}
