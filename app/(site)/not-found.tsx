import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="hero-section">
      <p className="hero-section__eyebrow">Erro 404</p>
      <h2 className="hero-section__title">Essa página saiu para treinar.</h2>
      <p className="hero-section__text">
        O endereço pode ter mudado ou o conteúdo ainda não foi publicado.
      </p>
      <div>
        <Link className="ui-button" href="/">
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
