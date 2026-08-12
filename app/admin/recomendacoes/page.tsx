import Link from "next/link";
import { createRecommendation } from "@/app/admin/actions";
import { requireAdminUser } from "@/src/lib/auth";
import { getContentRepository } from "@/src/lib/content";
import { hasSupabaseEnvironment } from "@/src/lib/env";

export default async function AdminRecommendationsPage() {
  if (!hasSupabaseEnvironment) {
    return (
      <section className="admin-panel">
        <h1 className="admin-panel__title">Recomendações</h1>
        <p className="admin-notice">O formulário será habilitado após configurar o Supabase.</p>
      </section>
    );
  }

  await requireAdminUser();
  const repository = getContentRepository();
  const [categories, recommendations] = await Promise.all([
    repository.listRecommendationCategories(),
    repository.listPublishedRecommendations(),
  ]);

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-panel__eyebrow">Curadoria</p>
          <h1 className="admin-panel__title">Recomendações</h1>
        </div>
        <Link className="ui-button ui-button--nav" href="/admin">
          Voltar
        </Link>
      </div>

      <div className="admin-list">
        {recommendations.map((recommendation) => (
          <article className="admin-list__item" key={recommendation.id}>
            <div>
              <span className="admin-list__eyebrow">{recommendation.eyebrow}</span>
              <h2 className="admin-list__title">{recommendation.title}</h2>
            </div>
            <a href={recommendation.url} target="_blank" rel="noreferrer">
              Abrir ↗
            </a>
          </article>
        ))}
      </div>

      <form className="admin-form" action={createRecommendation}>
        <div className="admin-form__heading">
          <h2>Nova recomendação</h2>
          <p>Cadastre o link e publique agora ou salve como rascunho.</p>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Identificador</span>
            <input name="id" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />
          </label>
          <label className="admin-field">
            <span>Categoria</span>
            <select name="categoryId" required>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select name="status" defaultValue="draft">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Posição</span>
            <input name="position" type="number" min="0" defaultValue="0" required />
          </label>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Chamada</span>
            <input name="eyebrow" required />
          </label>
          <label className="admin-field">
            <span>Título</span>
            <input name="title" required />
          </label>
        </div>
        <label className="admin-field">
          <span>Descrição</span>
          <textarea name="description" rows={3} required />
        </label>
        <label className="admin-field">
          <span>Link externo</span>
          <input name="url" type="url" required />
        </label>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Caminho da imagem</span>
            <input name="image" placeholder="/images/links/produto.webp" />
          </label>
          <label className="admin-field">
            <span>Texto alternativo</span>
            <input name="imageAlt" />
          </label>
          <label className="admin-field">
            <span>Ação</span>
            <input name="action" defaultValue="Ver produto ↗" required />
          </label>
          <label className="admin-field admin-field--check">
            <input name="isAffiliate" type="checkbox" />
            <span>Link afiliado</span>
          </label>
        </div>
        <button className="ui-button" type="submit">
          Criar recomendação
        </button>
      </form>
    </section>
  );
}
