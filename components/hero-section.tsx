type HeroSectionProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export function HeroSection({ eyebrow, title, children }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <p className="hero-section__eyebrow">{eyebrow}</p>
      <h2 className="hero-section__title">{title}</h2>
      {children}
    </section>
  );
}
