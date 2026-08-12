# Dashound Platform Architecture

## Objective

Rebuild the static site as a content platform without interrupting the production site. The public experience remains fast and mostly static, while an authenticated administration area manages pages, reusable content blocks, recommendations, and media.

## Delivery strategy

- `main` continues to represent the current production site.
- `static-v1` preserves the last static implementation.
- `next-rebuild` contains the isolated reconstruction.
- Vercel preview deployments are used until the new application reaches content and visual parity.
- The production domain only changes when the preview is approved.

## Application layers

1. **Presentation** — Next.js App Router pages and reusable React components.
2. **Content domain** — TypeScript types for pages, blocks, recommendations, and publication state.
3. **Repository** — A stable interface used by public pages and the administration panel.
4. **Data providers** — Local TypeScript data during development; Supabase after credentials are configured.
5. **Persistence** — Supabase Postgres for structured content and Supabase Storage for media.

The UI must never query Supabase directly. It depends on the repository interface so local and remote providers remain interchangeable.

## Rendering model

- Published pages are rendered on the server and cached.
- Drafts are only available to authenticated administrators.
- Publishing revalidates the affected path.
- Administrative forms use Server Actions.
- Public interactions are handled server-side with validation, rate limiting, and abuse protection.

## Initial content model

- `pages`: identity, slug, title, summary, cover, SEO, status, and publication dates.
- `page_blocks`: ordered modular sections stored as typed JSON payloads.
- `recommendation_categories`: ordered public groupings.
- `recommendations`: external resources, descriptions, images, disclosure, and publication state.
- `media`: metadata for assets stored in Supabase Storage.
- `reactions`: optional anonymous interactions introduced only after the editorial platform is stable.

## Security model

- Public users can only read published content.
- Only an allow-listed administrator can create, update, publish, or delete content.
- Row Level Security is enabled for every exposed table.
- Service-role credentials remain server-only.
- Storage uploads are restricted to administrators.
- Public mutation endpoints use schema validation and abuse protection.

## Migration sequence

1. Reproduce all existing routes with local content.
2. Validate visual and content parity against the static site.
3. Add the Supabase schema and provider.
4. Build authentication and administration workflows.
5. Import local content into Supabase.
6. Validate preview, accessibility, SEO, and responsive behavior.
7. Promote the new deployment after explicit approval.
