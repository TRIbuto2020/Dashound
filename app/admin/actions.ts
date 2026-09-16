"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/src/lib/auth";
import { pages as localPages } from "@/src/data/local/pages";
import { importLocalContentToSupabase } from "@/src/data/supabase/import-local-content";
import { hasSupabaseEnvironment, serverEnvironment } from "@/src/lib/env";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const pageSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["project", "guide", "editorial"]),
  status: z.enum(["draft", "published"]),
  eyebrow: z.string().min(2),
  title: z.string().min(2),
  summary: z.string().min(10),
  cardEyebrow: z.string().min(2),
  cardText: z.string().min(10),
  seoDescription: z.string().min(10),
});

const pageIdSchema = z.uuid();

const optionalPositionSchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().min(0).optional(),
);

const pageMetadataSchema = pageSchema.omit({ status: true }).extend({
  id: pageIdSchema,
  cardAction: z.string().min(2),
  cardImage: z.string().optional(),
  cardImageAlt: z.string().optional(),
  featured: z.boolean(),
  featuredPosition: optionalPositionSchema,
});

const publicationSchema = z.object({
  id: pageIdSchema,
  status: z.enum(["draft", "published"]),
});

const textBlockSchema = z.object({
  pageId: pageIdSchema,
  blockId: z.uuid().optional(),
  title: z.string().min(2),
  paragraphs: z.string().min(2),
});

const tableCellSchema = z.object({
  text: z.string(),
  href: z.url().optional(),
});

const pageBlockPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1),
    type: z.literal("text"),
    title: z.string().min(2),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("summary"),
    title: z.string().optional(),
    paragraphs: z.array(z.string().min(1)).optional(),
    items: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("timeline"),
    title: z.string().min(2),
    introduction: z.string().optional(),
    items: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
    callout: z
      .object({
        title: z.string().min(1),
        text: z.string().min(1),
        emphasis: z.string().optional(),
      })
      .optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("card-grid"),
    title: z.string().min(2),
    introduction: z.string().optional(),
    cards: z.array(
      z.object({
        eyebrow: z.string().min(1),
        title: z.string().min(1),
        text: z.string().min(1),
      }),
    ),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("table"),
    title: z.string().min(2),
    introduction: z.string().optional(),
    caption: z.string(),
    columns: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(tableCellSchema)),
    closing: z.string().optional(),
  }),
]);

const blockPayloadSchema = z.object({
  pageId: pageIdSchema,
  blockId: z.uuid(),
  payload: z.string().min(2),
});

const deleteBlockSchema = z.object({
  pageId: pageIdSchema,
  blockId: z.uuid(),
});

const recommendationSchema = z.object({
  id: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().min(2),
  status: z.enum(["draft", "published"]),
  eyebrow: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(10),
  url: z.url().refine((url) => url.startsWith("https://")),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  action: z.string().min(2),
  position: z.coerce.number().int().min(0),
  isAffiliate: z.boolean(),
});

function ensureSupabaseConfiguration() {
  if (!hasSupabaseEnvironment) {
    throw new Error("Supabase is not configured.");
  }
}

export async function signIn(formData: FormData) {
  ensureSupabaseConfiguration();
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success || result.data.email !== serverEnvironment.ADMIN_EMAIL) {
    redirect("/admin/login?error=unauthorized");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    redirect("/admin/login?error=credentials");
  }

  redirect("/admin");
}

export async function signOut() {
  ensureSupabaseConfiguration();
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function importLocalContent() {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  let destination = "/admin?import=complete";

  try {
    await importLocalContentToSupabase();
  } catch (error) {
    console.error("Could not import local content into Supabase.", error);
    destination = "/admin?import=error";
  }

  redirect(destination);
}

export async function syncTtLowbudgetPage() {
  ensureSupabaseConfiguration();
  await requireAdminUser();

  const localPage = localPages.find((page) => page.slug === "tt-lowbudget");

  if (!localPage) {
    throw new Error("A fonte local da TT Lowbudget não foi encontrada.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: currentPage, error: pageLookupError } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", localPage.slug)
    .single();

  if (pageLookupError) {
    throw new Error(`Não foi possível localizar a TT Lowbudget: ${pageLookupError.message}`);
  }

  const { data: currentBlocks, error: blockLookupError } = await supabase
    .from("page_blocks")
    .select("id, position")
    .eq("page_id", currentPage.id)
    .order("position");

  if (blockLookupError) {
    throw new Error(`Não foi possível localizar os blocos da TT: ${blockLookupError.message}`);
  }

  if (currentBlocks.length !== localPage.blocks.length) {
    throw new Error(
      "A quantidade de blocos no Supabase não corresponde à fonte local. Sincronização cancelada.",
    );
  }

  const blocksMatchPositions = currentBlocks.every(
    (block, position) => block.position === position,
  );

  if (!blocksMatchPositions) {
    throw new Error("A ordem dos blocos no Supabase mudou. Sincronização cancelada.");
  }

  const { error: blockUpdateError } = await supabase.from("page_blocks").upsert(
    localPage.blocks.map((block, position) => ({
      id: currentBlocks[position].id,
      page_id: currentPage.id,
      type: block.type,
      position,
      payload: block,
    })),
  );

  if (blockUpdateError) {
    throw new Error(`Não foi possível atualizar os blocos da TT: ${blockUpdateError.message}`);
  }

  const { error: pageUpdateError } = await supabase
    .from("pages")
    .update({
      kind: localPage.kind,
      status: localPage.status,
      eyebrow: localPage.eyebrow,
      title: localPage.title,
      summary: localPage.summary,
      featured: localPage.featured,
      featured_position: localPage.featuredPosition ?? null,
      card: localPage.card,
      seo: localPage.seo,
      published_at: localPage.publishedAt ?? null,
    })
    .eq("id", currentPage.id);

  if (pageUpdateError) {
    throw new Error(`Não foi possível atualizar a TT Lowbudget: ${pageUpdateError.message}`);
  }

  revalidatePath("/");
  revalidatePath("/projetos/tt-lowbudget");
  redirect("/admin/paginas?synced=tt-lowbudget");
}

export async function createPage(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = pageSchema.parse({
    slug: formData.get("slug"),
    kind: formData.get("kind"),
    status: formData.get("status"),
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    cardEyebrow: formData.get("cardEyebrow"),
    cardText: formData.get("cardText"),
    seoDescription: formData.get("seoDescription"),
  });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pages")
    .insert({
      slug: input.slug,
      kind: input.kind,
      status: input.status,
      eyebrow: input.eyebrow,
      title: input.title,
      summary: input.summary,
      featured: false,
      card: {
        eyebrow: input.cardEyebrow,
        title: input.title,
        text: input.cardText,
        action: "Conhecer a página →",
      },
      seo: {
        title: input.title,
        description: input.seoDescription,
      },
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Não foi possível criar a página: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/paginas");
  revalidatePath(`/projetos/${input.slug}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/paginas/${data.id}?created=true`);
}

export async function updatePageMetadata(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = pageMetadataSchema.parse({
    id: formData.get("id"),
    slug: formData.get("slug"),
    kind: formData.get("kind"),
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    cardEyebrow: formData.get("cardEyebrow"),
    cardText: formData.get("cardText"),
    cardAction: formData.get("cardAction"),
    cardImage: formData.get("cardImage") || undefined,
    cardImageAlt: formData.get("cardImageAlt") || undefined,
    seoDescription: formData.get("seoDescription"),
    featured: formData.get("featured") === "on",
    featuredPosition: formData.get("featuredPosition"),
  });
  const supabase = await createSupabaseServerClient();
  const { data: currentPage, error: lookupError } = await supabase
    .from("pages")
    .select("slug, card")
    .eq("id", input.id)
    .single();

  if (lookupError) {
    throw new Error(`Não foi possível localizar a página: ${lookupError.message}`);
  }

  const currentCard = currentPage.card as Record<string, unknown>;
  const { error } = await supabase
    .from("pages")
    .update({
      slug: input.slug,
      kind: input.kind,
      eyebrow: input.eyebrow,
      title: input.title,
      summary: input.summary,
      featured: input.featured,
      featured_position: input.featured ? (input.featuredPosition ?? null) : null,
      card: {
        ...currentCard,
        eyebrow: input.cardEyebrow,
        title: input.title,
        text: input.cardText,
        action: input.cardAction,
        image: input.cardImage,
        imageAlt: input.cardImageAlt,
      },
      seo: {
        title: input.title,
        description: input.seoDescription,
      },
    })
    .eq("id", input.id);

  if (error) {
    throw new Error(`Não foi possível atualizar a página: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/paginas");
  revalidatePath(`/projetos/${currentPage.slug}`);
  revalidatePath(`/projetos/${input.slug}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/paginas/${input.id}?saved=metadata`);
}

export async function setPagePublicationStatus(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = publicationSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  const supabase = await createSupabaseServerClient();
  const { data: page, error } = await supabase
    .from("pages")
    .update({
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", input.id)
    .select("slug")
    .single();

  if (error) {
    throw new Error(`Não foi possível alterar a publicação: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/paginas");
  revalidatePath(`/projetos/${page.slug}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/paginas/${input.id}?saved=status`);
}

export async function saveTextBlock(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = textBlockSchema.parse({
    pageId: formData.get("pageId"),
    blockId: formData.get("blockId") || undefined,
    title: formData.get("title"),
    paragraphs: formData.get("paragraphs"),
  });
  const paragraphs = input.paragraphs
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new Error("Adicione ao menos um parágrafo ao bloco.");
  }

  const supabase = await createSupabaseServerClient();

  if (input.blockId) {
    const { data: currentBlock, error: lookupError } = await supabase
      .from("page_blocks")
      .select("payload")
      .eq("id", input.blockId)
      .eq("page_id", input.pageId)
      .single();

    if (lookupError) {
      throw new Error(`Não foi possível localizar o bloco: ${lookupError.message}`);
    }

    const currentPayload = pageBlockPayloadSchema.parse(currentBlock.payload);
    const { error } = await supabase
      .from("page_blocks")
      .update({
        type: "text",
        payload: {
          id: currentPayload.id,
          type: "text",
          title: input.title,
          paragraphs,
        },
      })
      .eq("id", input.blockId)
      .eq("page_id", input.pageId);

    if (error) {
      throw new Error(`Não foi possível atualizar o bloco: ${error.message}`);
    }
  } else {
    const { data: lastBlock, error: positionError } = await supabase
      .from("page_blocks")
      .select("position")
      .eq("page_id", input.pageId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (positionError) {
      throw new Error(`Não foi possível definir a posição do bloco: ${positionError.message}`);
    }

    const { error } = await supabase.from("page_blocks").insert({
      page_id: input.pageId,
      type: "text",
      position: (lastBlock?.position ?? -1) + 1,
      payload: {
        id: `text-${randomUUID()}`,
        type: "text",
        title: input.title,
        paragraphs,
      },
    });

    if (error) {
      throw new Error(`Não foi possível criar o bloco: ${error.message}`);
    }
  }

  revalidatePath("/projetos/[slug]", "page");
  revalidatePath("/paginas");
  redirect(`/admin/paginas/${input.pageId}?saved=block`);
}

export async function saveBlockPayload(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = blockPayloadSchema.parse({
    pageId: formData.get("pageId"),
    blockId: formData.get("blockId"),
    payload: formData.get("payload"),
  });
  const payload = pageBlockPayloadSchema.parse(JSON.parse(input.payload));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("page_blocks")
    .update({ type: payload.type, payload })
    .eq("id", input.blockId)
    .eq("page_id", input.pageId);

  if (error) {
    throw new Error(`Não foi possível atualizar o bloco: ${error.message}`);
  }

  revalidatePath("/projetos/[slug]", "page");
  redirect(`/admin/paginas/${input.pageId}?saved=block`);
}

export async function deletePageBlock(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = deleteBlockSchema.parse({
    pageId: formData.get("pageId"),
    blockId: formData.get("blockId"),
  });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("page_blocks")
    .delete()
    .eq("id", input.blockId)
    .eq("page_id", input.pageId);

  if (error) {
    throw new Error(`Não foi possível excluir o bloco: ${error.message}`);
  }

  revalidatePath("/projetos/[slug]", "page");
  redirect(`/admin/paginas/${input.pageId}?saved=deleted`);
}

export async function createRecommendation(formData: FormData) {
  ensureSupabaseConfiguration();
  await requireAdminUser();
  const input = recommendationSchema.parse({
    id: formData.get("id"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    description: formData.get("description"),
    url: formData.get("url"),
    image: formData.get("image") || undefined,
    imageAlt: formData.get("imageAlt") || undefined,
    action: formData.get("action"),
    position: formData.get("position"),
    isAffiliate: formData.get("isAffiliate") === "on",
  });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("recommendations").insert({
    id: input.id,
    category_id: input.categoryId,
    status: input.status,
    eyebrow: input.eyebrow,
    title: input.title,
    description: input.description,
    url: input.url,
    image: input.image || null,
    image_alt: input.imageAlt || null,
    action: input.action,
    position: input.position,
    is_affiliate: input.isAffiliate,
  });

  if (error) {
    throw new Error(`Não foi possível criar a recomendação: ${error.message}`);
  }

  revalidatePath("/projetos/links-uteis-e-recomendacoes");
  redirect("/admin/recomendacoes?created=true");
}
