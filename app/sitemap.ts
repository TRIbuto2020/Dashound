import type { MetadataRoute } from "next";
import { getContentRepository } from "@/src/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dashound.com.br";
  const pages = await getContentRepository().listPublishedPages();

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/contato`, changeFrequency: "monthly", priority: 0.5 },
    ...pages.map((page) => ({
      url: `${baseUrl}/projetos/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
