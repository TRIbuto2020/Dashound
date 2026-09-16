import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  isHome?: boolean;
};

export function SiteHeader({ isHome = false }: SiteHeaderProps) {
  return (
    <header className="page-shell__header">
      <h1 className="page-shell__brand">
        <Link className="page-shell__brand-link" href="/" aria-label="Dashound — página inicial">
          <Image
            className="page-shell__brand-image"
            src="/images/dashType.svg"
            alt="Dashound"
            width={1536}
            height={1024}
            priority
          />
        </Link>
      </h1>
      <nav className="page-shell__nav" aria-label="Navegação principal">
        <Link className="ui-button ui-button--nav" href={isHome ? "#sobre" : "/#sobre"}>
          Sobre
        </Link>
        <Link className="ui-button ui-button--nav" href="/paginas">
          Páginas
        </Link>
        <Link className="ui-button ui-button--nav" href="/contato">
          Contato
        </Link>
      </nav>
    </header>
  );
}
