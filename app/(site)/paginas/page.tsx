import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { PageCard } from "@/components/page-card";
import { getContentRepository } from "@/src/lib/content";

export const metadata: Metadata = {
  title: "Páginas",
  description: "Projetos, guias e histórias publicados pela Dashound.",
};

export default async function PagesCatalogPage() {
  const pages = await getContentRepository().listPublishedPages();

  return (
    <>
      <HeroSection eyebrow="Arquivo Dashound" title="Tudo que já colocamos no mundo">
        <p className="hero-section__text">
          Projetos, guias, recomendações e outras ideias reunidos em um só lugar.
        </p>
      </HeroSection>

      <section className="section-block">
        <div className="project-grid">
          {pages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </section>
    </>
  );
}
