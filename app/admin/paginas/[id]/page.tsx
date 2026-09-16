import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deletePageBlock,
  saveBlockPayload,
  saveTextBlock,
  setPagePublicationStatus,
  updatePageMetadata,
} from "@/app/admin/actions";
import type { ContentPage, PageBlock } from "@/src/core/content/types";
import { requireAdminUser } from "@/src/lib/auth";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

type AdminPageEditorProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
};

type AdminPageRow = Pick<
  ContentPage,
  "id" | "slug" | "kind" | "status" | "eyebrow" | "title" | "summary" | "featured"
> & {
  featured_position: number | null;
  card: ContentPage["card"];
  seo: ContentPage["seo"];
};

type AdminBlockRow = {
  id: string;
  position: number;
  payload: PageBlock;
};

export default async function AdminPageEditor({ params, searchParams }: AdminPageEditorProps) {
  await requireAdminUser();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const [{ data: pageData, error: pageError }, { data: blockData, error: blockError }] =
    await Promise.all([
      supabase
        .from("pages")
        .select(
          "id, slug, kind, status, eyebrow, title, summary, featured, featured_position, card, seo",
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("page_blocks")
        .select("id, position, payload")
        .eq("page_id", id)
        .order("position"),
    ]);

  if (pageError) {
    throw new Error(`Não foi possível carregar a página: ${pageError.message}`);
  }

  if (blockError) {
    throw new Error(`Não foi possível carregar os blocos: ${blockError.message}`);
  }

  if (!pageData) {
    notFound();
  }

  const page = pageData as AdminPageRow;
  const blocks = (blockData ?? []) as AdminBlockRow[];
  const notice = query.created
    ? "Rascunho criado. Agora adicione o conteúdo e publique quando estiver pronto."
    : query.saved === "status"
      ? page.status === "published"
        ? "Página publicada com sucesso."
        : "Página retirada do ar e mantida como rascunho."
      : query.saved
        ? "Alterações salvas com sucesso."
        : null;

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-panel__eyebrow">Editor de página</p>
          <h1 className="admin-panel__title">{page.title}</h1>
          <p className="admin-panel__text">
            {page.status === "published" ? "Publicada" : "Rascunho"} · /projetos/{page.slug}
          </p>
        </div>
        <div className="admin-list__actions">
          {page.status === "published" && (
            <Link className="ui-button ui-button--nav" href={`/projetos/${page.slug}`} target="_blank">
              Visualizar ↗
            </Link>
          )}
          <Link className="ui-button ui-button--nav" href="/admin/paginas">
            Voltar
          </Link>
        </div>
      </div>

      {notice && <p className="admin-notice">{notice}</p>}

      <div className="admin-publication">
        <div>
          <p className="admin-list__eyebrow">Publicação</p>
          <h2 className="admin-list__title">
            {page.status === "published" ? "Esta página está no ar" : "Esta página ainda não está pública"}
          </h2>
        </div>
        <form action={setPagePublicationStatus}>
          <input name="id" type="hidden" value={page.id} />
          <input
            name="status"
            type="hidden"
            value={page.status === "published" ? "draft" : "published"}
          />
          <button className="ui-button ui-button--featured admin-publication__button" type="submit">
            {page.status === "published" ? "Retirar do ar" : "Publicar página"}
          </button>
        </form>
      </div>

      <form className="admin-form" action={updatePageMetadata}>
        <input name="id" type="hidden" value={page.id} />
        <div className="admin-form__heading">
          <h2>Informações da página</h2>
          <p>Edite endereço, textos principais, card e informações para buscadores.</p>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Título</span>
            <input name="title" defaultValue={page.title} required />
          </label>
          <label className="admin-field">
            <span>Slug</span>
            <input
              name="slug"
              defaultValue={page.slug}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              required
            />
          </label>
          <label className="admin-field">
            <span>Tipo</span>
            <select name="kind" defaultValue={page.kind}>
              <option value="project">Projeto</option>
              <option value="guide">Guia</option>
              <option value="editorial">Editorial</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Chamada acima do título</span>
            <input name="eyebrow" defaultValue={page.eyebrow} required />
          </label>
        </div>
        <label className="admin-field">
          <span>Resumo da página</span>
          <textarea name="summary" defaultValue={page.summary} rows={4} required />
        </label>

        <div className="admin-form__heading">
          <h2>Card</h2>
          <p>Essas informações aparecem na landing page e no catálogo de páginas.</p>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Categoria</span>
            <input name="cardEyebrow" defaultValue={page.card.eyebrow} required />
          </label>
          <label className="admin-field">
            <span>Texto da ação</span>
            <input name="cardAction" defaultValue={page.card.action} required />
          </label>
        </div>
        <label className="admin-field">
          <span>Descrição do card</span>
          <textarea name="cardText" defaultValue={page.card.text} rows={3} required />
        </label>
        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Caminho da imagem</span>
            <input
              name="cardImage"
              defaultValue={page.card.image ?? ""}
              placeholder="/images/paginas/exemplo.webp"
            />
          </label>
          <label className="admin-field">
            <span>Descrição da imagem</span>
            <input name="cardImageAlt" defaultValue={page.card.imageAlt ?? ""} />
          </label>
        </div>
        <div className="admin-form__grid">
          <label className="admin-field admin-field--check">
            <input name="featured" type="checkbox" defaultChecked={page.featured} />
            <span>Destacar na landing page</span>
          </label>
          <label className="admin-field">
            <span>Posição do destaque</span>
            <input
              name="featuredPosition"
              type="number"
              min="0"
              defaultValue={page.featured_position ?? ""}
            />
          </label>
        </div>

        <div className="admin-form__heading">
          <h2>Buscadores</h2>
        </div>
        <label className="admin-field">
          <span>Descrição SEO</span>
          <textarea
            name="seoDescription"
            defaultValue={page.seo.description}
            rows={3}
            required
          />
        </label>
        <button className="ui-button" type="submit">
          Salvar informações
        </button>
      </form>

      <div className="admin-blocks">
        <div className="admin-form__heading">
          <h2>Conteúdo da página</h2>
          <p>Os blocos aparecem abaixo da apresentação, na ordem exibida aqui.</p>
        </div>

        {blocks.length === 0 && (
          <p className="admin-notice">A página ainda não possui blocos de conteúdo.</p>
        )}

        {blocks.map((block) =>
          block.payload.type === "text" ? (
            <article className="admin-block" key={block.id}>
              <form className="admin-form" action={saveTextBlock}>
                <input name="pageId" type="hidden" value={page.id} />
                <input name="blockId" type="hidden" value={block.id} />
                <p className="admin-list__eyebrow">Bloco {block.position + 1} · Texto</p>
                <label className="admin-field">
                  <span>Título da seção</span>
                  <input name="title" defaultValue={block.payload.title} required />
                </label>
                <label className="admin-field">
                  <span>Parágrafos — separe com uma linha em branco</span>
                  <textarea
                    name="paragraphs"
                    defaultValue={block.payload.paragraphs.join("\n\n")}
                    rows={8}
                    required
                  />
                </label>
                <button className="ui-button" type="submit">
                  Salvar bloco
                </button>
              </form>
              <form action={deletePageBlock}>
                <input name="pageId" type="hidden" value={page.id} />
                <input name="blockId" type="hidden" value={block.id} />
                <button className="admin-text-action" type="submit">
                  Excluir bloco
                </button>
              </form>
            </article>
          ) : (
            <article className="admin-block" key={block.id}>
              <form className="admin-form" action={saveBlockPayload}>
                <input name="pageId" type="hidden" value={page.id} />
                <input name="blockId" type="hidden" value={block.id} />
                <p className="admin-list__eyebrow">
                  Bloco {block.position + 1} · {block.payload.type}
                </p>
                <label className="admin-field">
                  <span>Conteúdo estruturado</span>
                  <textarea
                    className="admin-field__code"
                    name="payload"
                    defaultValue={JSON.stringify(block.payload, null, 2)}
                    rows={16}
                    required
                  />
                </label>
                <button className="ui-button" type="submit">
                  Salvar bloco
                </button>
              </form>
              <form action={deletePageBlock}>
                <input name="pageId" type="hidden" value={page.id} />
                <input name="blockId" type="hidden" value={block.id} />
                <button className="admin-text-action" type="submit">
                  Excluir bloco
                </button>
              </form>
            </article>
          ),
        )}

        <form className="admin-form admin-block admin-block--new" action={saveTextBlock}>
          <input name="pageId" type="hidden" value={page.id} />
          <div className="admin-form__heading">
            <h3>Adicionar seção de texto</h3>
            <p>Você poderá editar ou excluir essa seção depois.</p>
          </div>
          <label className="admin-field">
            <span>Título da seção</span>
            <input name="title" required />
          </label>
          <label className="admin-field">
            <span>Parágrafos — separe com uma linha em branco</span>
            <textarea name="paragraphs" rows={7} required />
          </label>
          <button className="ui-button" type="submit">
            Adicionar seção
          </button>
        </form>
      </div>
    </section>
  );
}
