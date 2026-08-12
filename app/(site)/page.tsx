import Image from "next/image";
import Link from "next/link";
import { PageCard } from "@/components/page-card";
import { getContentRepository } from "@/src/lib/content";

export default async function HomePage() {
  const pages = (await getContentRepository().listPublishedPages()).filter(
    (page) => page.featured,
  );

  return (
    <>
      <section className="landing-hero" id="sobre">
        <div className="landing-hero__content">
          <p className="hero-section__eyebrow">Endurance sem cerimônia</p>
          <h2 className="landing-hero__title">
            A gente leva o esporte a sério. A nós mesmos, nem tanto.
          </h2>
          <p className="landing-hero__text">
            A Dashound é onde Katy e Vitor transformam curiosidade em histórias, projetos e
            experiências reais sobre triathlon, com pesquisa, improviso e espaço para mostrar
            quando alguma coisa dá muito errado.
          </p>
          <div className="landing-hero__actions">
            <Link className="ui-button" href="#paginas">
              Conheça os projetos
            </Link>
            <a
              className="ui-button"
              href="https://www.youtube.com/@KatyTerasaka"
              target="_blank"
              rel="noreferrer"
            >
              Assista no YouTube ↗
            </a>
          </div>
        </div>

        <div className="landing-hero__visual">
          <a
            className="landing-hero__feature"
            href="https://www.youtube.com/watch?v=JUYvYYtsCzs"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              className="landing-hero__image"
              src="/images/landing/triathlon-historia.webp"
              alt="Katy apresenta o vídeo Triathlon: Uma História"
              width={1280}
              height={720}
              priority
            />
            <div className="landing-hero__feature-content">
              <p className="landing-hero__feature-eyebrow">Vídeo-ensaio • 11 min</p>
              <h3 className="landing-hero__feature-title">Triathlon: Uma História</h3>
              <span className="landing-hero__feature-action">Assistir agora ↗</span>
            </div>
          </a>
          <span className="landing-hero__stamp" aria-hidden="true">
            História
            <br />+<br />
            diversão
          </span>
        </div>
      </section>

      <section className="section-block">
        <h3 className="section-block__title">O que você encontra por aqui</h3>
        <p className="section-block__text">
          Conteúdo para quem gosta de esporte, mas não acredita que tudo precisa ser perfeito ou
          caríssimo.
        </p>
        <div className="project-grid">
          <article className="ui-card">
            <p className="ui-card__eyebrow">Pesquisa</p>
            <h4 className="ui-card__title">Histórias do esporte</h4>
            <p className="ui-card__text">
              Contexto, curiosidades e personagens que ajudam a entender como chegamos até aqui.
            </p>
          </article>
          <article className="ui-card">
            <p className="ui-card__eyebrow">Na prática</p>
            <h4 className="ui-card__title">Projetos que começam com “e se?”</h4>
            <p className="ui-card__text">
              Ideias colocadas à prova com orçamento real, erros reais e soluções nem sempre
              ortodoxas.
            </p>
          </article>
          <article className="ui-card">
            <p className="ui-card__eyebrow">Sem gatekeeping</p>
            <h4 className="ui-card__title">Endurance possível</h4>
            <p className="ui-card__text">
              Equipamentos, referências e experiências para aproximar mais pessoas desse universo.
            </p>
          </article>
        </div>
      </section>

      <section className="section-block" id="sobre-nos">
        <h3 className="section-block__title">
          Duas pessoas, uma quantidade questionável de ideias
        </h3>
        <p className="section-block__text">
          Perspectivas diferentes, conectadas pela vontade de praticar esporte, aprender fazendo e
          dividir o processo.
        </p>
        <div className="about-grid">
          <article className="about-card">
            <div className="about-card__media">
              <Image
                src="/images/katyProfile.jpeg"
                alt="Katy em contexto esportivo"
                width={1200}
                height={1600}
              />
            </div>
            <div className="about-card__content">
              <p className="hero-section__eyebrow">Triatleta e criadora de conteúdo</p>
              <h4 className="about-card__title">Katy</h4>
              <p className="about-card__text">
                Vive o triathlon entre treinos, provas e a curiosidade de entender tudo o que cerca
                o esporte: equipamentos, tecnologia, histórias e aquelas regras que ninguém explica
                direito.
              </p>
              <p className="about-card__text">
                Transforma assuntos técnicos em conversas acessíveis, sempre a partir da experiência
                real de uma atleta amadora que leva o esporte a sério sem perder a leveza.
              </p>
            </div>
          </article>

          <article className="about-card">
            <div className="about-card__media">
              <Image
                src="/images/vitorProfile.jpeg"
                alt="Vitor em contexto esportivo"
                width={1440}
                height={1440}
              />
            </div>
            <div className="about-card__content">
              <p className="hero-section__eyebrow">Esporte, tecnologia e projetos</p>
              <h4 className="about-card__title">Vitor</h4>
              <p className="about-card__text">
                Olha para uma bicicleta usada, uma ideia improvável ou um problema técnico e
                geralmente pergunta: “será que dá para fazer?”. Às vezes dá. Às vezes vira conteúdo.
              </p>
              <p className="about-card__text">
                Mistura esporte, tecnologia e projetos para mostrar que aprender fazendo pode ser
                mais interessante e mais divertido do que esperar pela solução perfeita.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block" id="paginas">
        <h3 className="section-block__title">Por onde começar</h3>
        <p className="section-block__text">Venha ver o que preparamos para compartilhar com vocês!</p>
        <div className="featured-grid">
          {pages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta__content">
          <p className="landing-cta__eyebrow">Tem uma ideia?</p>
          <h3 className="landing-cta__title">Boa, ruim ou estranha... queremos ouvir.</h3>
          <p className="landing-cta__text">
            Pautas, projetos, produtos interessantes ou uma história do esporte que merece ser
            contada.
          </p>
        </div>
        <Link className="ui-button" href="/contato">
          Fale com a gente →
        </Link>
      </section>
    </>
  );
}
