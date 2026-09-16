import Link from "next/link";
import { createPage, syncTtLowbudgetPage } from "@/app/admin/actions";
import { requireAdminUser } from "@/src/lib/auth";
import { hasSupabaseEnvironment } from "@/src/lib/env";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

type AdminPagesPageProps = {
  searchParams: Promise<{ created?: string; synced?: string }>;
};

export default async function AdminPagesPage({ searchParams }: AdminPagesPageProps) {
  if (!hasSupabaseEnvironment) {
    return (
      <section className="admin-panel">
        <h1 className="admin-panel__title">Páginas</h1>
        <p className="admin-notice">O formulário será habilitado após configurar o Supabase.</p>
      </section>
    );
  }

  await requireAdminUser();
  const { created, synced } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: pages, error } = await supabase
    .from("pages")
    .select("id, slug, kind, status, title")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Não foi possível carregar as páginas: ${error.message}`);
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-panel__eyebrow">Conteúdo modular</p>
          <h1 className="admin-panel__title">Páginas</h1>
        </div>
        <Link className="ui-button ui-button--nav" href="/admin">
          Voltar
        </Link>
      </div>

      {synced === "tt-lowbudget" && (
        <p className="admin-notice">TT Lowbudget sincronizada com sucesso.</p>
      )}
      {created === "true" && <p className="admin-notice">Página criada com sucesso.</p>}

      <div className="admin-list">
        {(pages ?? []).map((page) => (
          <article className="admin-list__item" key={page.id}>
            <div>
              <span className="admin-list__eyebrow">
                {page.kind} · {page.status === "published" ? "publicada" : "rascunho"}
              </span>
              <h2 className="admin-list__title">{page.title}</h2>
            </div>
            <div className="admin-list__actions">
              {page.status === "published" && (
                <Link href={`/projetos/${page.slug}`} target="_blank">
                  Visualizar ↗
                </Link>
              )}
              {page.slug === "tt-lowbudget" && (
                <form action={syncTtLowbudgetPage}>
                  <button className="ui-button ui-button--nav" type="submit">
                    Sincronizar TT
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>

      <form className="admin-form" action={createPage}>
        <div className="admin-form__heading">
          <h2>Nova página</h2>
          <p>A página nasce sem blocos e pode permanecer como rascunho.</p>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Título</span>
            <input name="title" required />
          </label>
          <label className="admin-field">
            <span>Slug</span>
            <input name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
          </label>
          <label className="admin-field">
            <span>Tipo</span>
            <select name="kind" defaultValue="project">
              <option value="project">Projeto</option>
              <option value="guide">Guia</option>
              <option value="editorial">Editorial</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select name="status" defaultValue="draft">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </label>
        </div>
        <label className="admin-field">
          <span>Chamada acima do título</span>
          <input name="eyebrow" required />
        </label>
        <label className="admin-field">
          <span>Resumo da página</span>
          <textarea name="summary" rows={4} required />
        </label>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Categoria no card</span>
            <input name="cardEyebrow" required />
          </label>
          <label className="admin-field">
            <span>Descrição no card</span>
            <input name="cardText" required />
          </label>
        </div>
        <label className="admin-field">
          <span>Descrição para buscadores</span>
          <textarea name="seoDescription" rows={3} required />
        </label>
        <button className="ui-button" type="submit">
          Criar página
        </button>
      </form>
    </section>
  );
}
