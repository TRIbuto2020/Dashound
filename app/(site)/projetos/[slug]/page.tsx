import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/hero-section";
import { PageBlockRenderer } from "@/components/page-block-renderer";
import { RecommendationSections } from "@/components/recommendation-sections";
import dashoundLogo from "@/src/images/Dashound.svg";
import { getContentRepository } from "@/src/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getContentRepository().listPublishedPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentRepository().getPublishedPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.seo.title.replace(/^Dashound\s*-\s*/, ""),
    description: page.seo.description,
  };
}

export default async function PublicContentPage({ params }: PageProps) {
  const { slug } = await params;
  const repository = getContentRepository();
  const page = await repository.getPublishedPage(slug);

  if (!page) {
    notFound();
  }

  if (page.slug === "links-uteis-e-recomendacoes") {
    const [categories, recommendations] = await Promise.all([
      repository.listRecommendationCategories(),
      repository.listPublishedRecommendations(),
    ]);

    return (
      <>
        <HeroSection eyebrow={page.eyebrow} title={page.title}>
          <p className="hero-section__text">{page.summary}</p>
        </HeroSection>
        <RecommendationSections
          categories={categories}
          recommendations={recommendations}
        />
        <aside className="project-callout">
          <h3 className="project-callout__title">Transparência</h3>
          <p className="project-callout__text">
            Alguns links de lojas utilizam redirecionamentos de parceiro ou afiliado. Quando uma
            compra gera comissão, isso ajuda a apoiar a criação de conteúdo e, em geral, não altera
            o preço para quem compra. Preços, disponibilidade e condições são definidos pelas
            próprias lojas e podem mudar.
          </p>
        </aside>
      </>
    );
  }

  return (
    <>
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        media={
          page.slug === "tt-lowbudget" ? (
            <Image
              className="hero-section__media-image"
              src={dashoundLogo}
              alt="Dashound"
              priority
            />
          ) : undefined
        }
      >
        <p className="hero-section__text">{page.summary}</p>
      </HeroSection>
      {page.blocks.map((block) => (
        <PageBlockRenderer block={block} key={block.id} />
      ))}
    </>
  );
}
