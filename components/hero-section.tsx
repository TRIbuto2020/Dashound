import type { ReactNode } from "react";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  media?: ReactNode;
};

export function HeroSection({ eyebrow, title, children, media }: HeroSectionProps) {
  return (
    <section className={`hero-section${media ? " hero-section--with-media" : ""}`}>
      <div className="hero-section__content">
        <p className="hero-section__eyebrow">{eyebrow}</p>
        <h2 className="hero-section__title">{title}</h2>
        {children}
      </div>
      {media && <div className="hero-section__media">{media}</div>}
    </section>
  );
}
