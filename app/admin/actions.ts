"use server";

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
  const { error } = await supabase.from("pages").insert({
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
  });

  if (error) {
    throw new Error(`Não foi possível criar a página: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath(`/projetos/${input.slug}`);
  redirect("/admin/paginas?created=true");
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
