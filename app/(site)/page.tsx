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
          <p className="hero-section__eyebrow">Triathlon e outras coisas...</p>
          <h2 className="landing-hero__title">
            A gente leva o esporte a sério. A nós mesmos, nem tanto.
          </h2>
          <p className="landing-hero__text">
            A Dashound é onde nós, Katy e Vitor, juntamos tudo que queremos compartilhar: nossos
            projetos, vídeos, ideias e recomendações. O que parecer uma boa ideia vai aparecer por
            aqui!
          </p>
          <div className="landing-hero__actions">
            <Link className="ui-button" href="#paginas">
              Conheça nossos projetos!
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
            bobagem
          </span>
        </div>
      </section>

      <section className="section-block" id="sobre-nos">
        <h3 className="section-block__title">Duas pessoas, talvez ideias demais...</h3>
        <p className="section-block__text">
          Perspectivas diferentes, unidas pela vontade de treinar, aprender coisas novas e
          compartilhar o processo.
        </p>
        <div className="about-grid">
          <a
            className="about-card"
            href="https://www.instagram.com/katy_terasaka"
            target="_blank"
            rel="noreferrer"
            aria-label="Conheça a Katy no Instagram"
          >
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
                Vive o triathlon entre treinos e o emprego CLT. Adora fazer provas e tem uma enorme
                curiosidade de entender tudo o que cerca o esporte: equipamentos, tecnologia,
                histórias e aquelas regras que ninguém explica direito.
              </p>
              <p className="about-card__text">
                Curte discutir assuntos técnicos de forma acessível, sempre a partir da vivência de
                uma atleta amadora que leva o esporte a sério.
              </p>
            </div>
          </a>

          <a
            className="about-card"
            href="/documents/curriculo-vitor.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir o currículo do Vitor em PDF"
          >
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
                Olha para uma bicicleta usada e o bolso começa a coçar. “Por que não?”. Às vezes é
                uma baita ideia, às vezes é só furada. Mas sempre vai virar conteúdo!
              </p>
              <p className="about-card__text">
                Mistura esporte e tecnologia em projetos meio sem noção, para mostrar que aprender
                fazendo pode ser mais interessante e mais divertido do que pagar pela solução
                “perfeita”.
              </p>
            </div>
          </a>
        </div>
      </section>

      <section className="section-block" id="paginas">
        <h3 className="section-block__title">O que já fizemos</h3>
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
