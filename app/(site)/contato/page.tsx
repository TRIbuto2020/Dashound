import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ResourceCard } from "@/components/resource-card";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com Katy e Vitor para pautas, projetos e parcerias.",
};

export default function ContactPage() {
  return (
    <>
      <HeroSection eyebrow="Pautas • projetos • boas conversas" title="Quer entrar nessa conversa?">
        <p className="hero-section__text">
          Se você tem uma pauta, um projeto, um produto interessante ou só quer conversar sobre
          esporte, chama a gente.
        </p>
        <p className="hero-section__text">
          A gente gosta de ideias que aproximem mais pessoas do endurance com curiosidade,
          honestidade e um pouco de senso de humor.
        </p>
      </HeroSection>

      <section className="section-block">
        <h3 className="section-block__title">Fale com a gente</h3>
        <p className="section-block__text">
          Enquanto nosso email ainda não sai do forno, as mensagens diretas são o melhor caminho.
          Escolha a pessoa ou o canal que mais combina com o assunto.
        </p>
        <div className="resource-grid">
          <ResourceCard
            href="https://www.instagram.com/katy_terasaka"
            eyebrow="Triathlon e conteúdo"
            title="Katy"
            text="Pautas, produtos, colaborações e conversas sobre a rotina no endurance."
            action="Chamar no Instagram ↗"
            placeholder="@KATY"
            mediaModifier="instagram"
            external
          />
          <ResourceCard
            href="https://www.instagram.com/vitortributo/"
            eyebrow="Projetos e tecnologia"
            title="Vitor"
            text="Ideias de projetos, desenvolvimento, experimentos e soluções pouco convencionais."
            action="Chamar no Instagram ↗"
            placeholder="@VITOR"
            mediaModifier="instagram"
            external
          />
          <ResourceCard
            href="https://www.youtube.com/@KatyTerasaka"
            eyebrow="Vídeos"
            title="Canal da Katy"
            text="Histórias do esporte, curiosidades e conteúdos para assistir com um pouco mais de calma."
            action="Conhecer o canal ↗"
            placeholder="YOUTUBE"
            mediaModifier="youtube"
            external
          />
        </div>
      </section>

      <section className="section-block">
        <h3 className="section-block__title">Conheça nossa vibe</h3>
        <div className="video-feature">
          <div className="video-feature__embed">
            <iframe
              src="https://www.youtube-nocookie.com/embed/JUYvYYtsCzs"
              title="Triathlon: Uma História, por Katy Terasaka"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="video-feature__content">
            <p className="video-feature__eyebrow">Vídeo-ensaio</p>
            <h4 className="video-feature__title">Triathlon: Uma História</h4>
            <p className="video-feature__text">
              Uma viagem pelas origens do esporte, do primeiro triathlon moderno às provas criadas
              por gente com pouquíssimo apego à própria vida.
            </p>
            <p className="video-feature__text">
              Pesquisa, história esportiva e algumas comparações geográficas questionáveis: um bom
              resumo do tipo de conteúdo que queremos construir.
            </p>
            <a
              className="ui-button"
              href="https://www.youtube.com/watch?v=JUYvYYtsCzs"
              target="_blank"
              rel="noreferrer"
            >
              Assistir no YouTube ↗
            </a>
          </div>
        </div>
      </section>

      <aside className="project-callout">
        <h3 className="project-callout__title">Email a caminho</h3>
        <p className="project-callout__text">
          Estamos preparando um endereço dedicado para parcerias. Até lá, preferimos indicar os
          canais que realmente funcionam em vez de publicar um email de enfeite. Quando ele estiver
          ativo, este será o primeiro lugar atualizado.
        </p>
      </aside>
    </>
  );
}
