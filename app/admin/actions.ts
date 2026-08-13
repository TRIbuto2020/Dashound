"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/src/lib/auth";
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
