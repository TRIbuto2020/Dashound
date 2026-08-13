import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { getAdminUser } from "@/src/lib/auth";
import { getContentRepository } from "@/src/lib/content";
import { hasSupabaseEnvironment } from "@/src/lib/env";

export default async function AdminDashboardPage() {
  const repository = getContentRepository();
  const [pages, recommendations] = await Promise.all([
    repository.listPublishedPages(),
    repository.listPublishedRecommendations(),
  ]);

  if (!hasSupabaseEnvironment) {
    return (
      <section className="admin-panel">
        <p className="admin-panel__eyebrow">Modo local</p>
        <h1 className="admin-panel__title">A fundação do painel está pronta.</h1>
        <p className="admin-panel__text">
          O site está usando os dados locais enquanto o projeto Supabase não é configurado. Nada
          aqui interfere na versão estática em produção.
        </p>
        <div className="admin-stats">
          <div className="admin-stat">
            <strong>{pages.length}</strong>
            <span>páginas publicadas</span>
          </div>
          <div className="admin-stat">
            <strong>{recommendations.length}</strong>
            <span>recomendações migradas</span>
          </div>
        </div>
        <ol className="admin-checklist">
          <li>Criar o projeto no Supabase.</li>
          <li>Executar a migration disponível em `supabase/migrations`.</li>
          <li>Preencher as variáveis descritas em `.env.example`.</li>
          <li>Validar o login antes de mudar `CONTENT_SOURCE`.</li>
        </ol>
      </section>
    );
  }

  const user = await getAdminUser();

  if (!user) {
    return (
      <section className="admin-panel">
        <p className="admin-panel__eyebrow">Área restrita</p>
        <h1 className="admin-panel__title">Entre para administrar a Dashound.</h1>
        <Link className="ui-button" href="/admin/login">
          Entrar no painel
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-panel__eyebrow">Conectado como {user.email}</p>
          <h1 className="admin-panel__title">Painel editorial</h1>
        </div>
        <form action={signOut}>
          <button className="ui-button" type="submit">
            Sair
          </button>
        </form>
      </div>
      <div className="admin-grid">
        <Link className="admin-card" href="/admin/paginas">
          <span className="admin-card__eyebrow">Conteúdo</span>
          <strong className="admin-card__title">Páginas</strong>
          <span className="admin-card__text">Criar projetos, guias e editoriais.</span>
        </Link>
        <Link className="admin-card" href="/admin/recomendacoes">
          <span className="admin-card__eyebrow">Curadoria</span>
          <strong className="admin-card__title">Recomendações</strong>
          <span className="admin-card__text">Adicionar e organizar links externos.</span>
        </Link>
      </div>
    </section>
  );
}
