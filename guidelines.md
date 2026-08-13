# Dashound Platform Guidelines

## Current Phase

- The stable static site is preserved by the Git tag `static-v1`.
- The Next.js reconstruction lives on the `next-rebuild` branch.
- Do not promote the reconstruction to production before public-route parity, Supabase import, admin authentication, and preview approval.
- Keep the legacy HTML files until the new deployment is explicitly approved.

## Technology

- Next.js App Router with TypeScript.
- Local typed content as the default data provider.
- Supabase Postgres, Auth, and Storage as the prepared remote provider.
- Vercel preview deployments for validation before production.
- Public content remains server-rendered and cacheable.
- Admin mutations use Server Actions and schema validation.

## Architecture Rules

- Public pages and components must depend on `ContentRepository`, never directly on Supabase.
- Keep local and Supabase repositories interchangeable.
- Store reusable content shapes in `src/core/content/types.ts`.
- Render project sections through reusable typed blocks.
- Keep Supabase service-role credentials server-only.
- Enable RLS on every exposed database and Storage table.
- Public users may only read published content.
- Administration access is restricted to allow-listed authenticated users.
- Keep preview deployments out of search indexes.

## Structure

- Public routes live under `app/(site)` and share the same layout and `SiteHeader` component.
- Reusable public components live in `components`; route files should focus on composition.
- Content contracts and the repository interface live in `src/core/content`.
- The local content provider in `src/data/local` is the default until Supabase is configured and imported.
- The Supabase provider in `src/data/supabase` must implement the same repository interface.
- The administration area lives in `app/admin` and is protected by the allow-listed Supabase Auth flow.
- Keep the legacy HTML files only while validating parity and do not edit them as the new source of truth.
- Header layout remains the brand on the left and shared navigation on the right.
- The landing page lists selected content; individual project-style pages are generated from typed content by slug.

## Page Map

- `/` for the landing page
- `/contato` for contact information
- `/projetos/<slug>` for individual public pages
- `/admin` for the protected administration dashboard
- `/admin/paginas` for page creation and publication controls
- `/admin/recomendacoes` for recommendation creation and publication controls

## Naming

- Prefer reusable, page-agnostic classes for repeated visual patterns.
- Use `parent__child` for parts that only make sense inside a component.
- Add modifiers with `--`, as in `ui-button--nav`.
- Do not create page-specific variants when an existing component already describes the role.

## Core Classes

- `page-shell`: outer page wrapper.
- `page-shell__header`: shared top header.
- `page-shell__brand`: main brand `h1`.
- `page-shell__nav`: header navigation container.
- `page-shell__main`: main page content wrapper.
- `hero-section`: leading section on each page.
- `hero-section__eyebrow`: small uppercase lead-in text.
- `hero-section__title`: main section title.
- `hero-section__text`: supporting paragraph text.
- `landing-hero`: landing-only editorial hero with copy and featured content.
- `landing-hero__content`: headline, introduction, and actions wrapper.
- `landing-hero__visual`: featured-video card and decorative stamp wrapper.
- `landing-hero__feature`: full featured-video link.
- `section-block`: reusable content section wrapper.
- `section-block__title`: section heading.
- `section-block__text`: section paragraph text.
- `ui-button`: shared button and pill-link appearance.
- `ui-button--nav`: compact header button modifier.
- `project-grid`: responsive grid used to arrange cards.
- `ui-card`: reusable card body.
- `ui-card__link`: clickable wrapper when the whole card is a link.
- `ui-card__eyebrow`: card category label.
- `ui-card__title`: card title.
- `ui-card__text`: card supporting copy.
- `resource-grid`: responsive grid for external resources and recommendations.
- `resource-card`: reusable card for a resource with image, description, and destination.
- `resource-card__link`: full-card external link wrapper.
- `resource-card__media`: image or placeholder area.
- `resource-card__image`: locally stored resource thumbnail.
- `resource-card__content`: text and action wrapper.
- `resource-card__eyebrow`: resource category label.
- `resource-card__title`: resource name.
- `resource-card__text`: short editorial description.
- `resource-card__action`: closing action label.
- `resource-card__media--mosaic`: reusable three-image collage modifier.
- `featured-grid`: two-column grid for high-priority content cards.
- `video-feature`: reusable featured-video block with media and supporting copy.
- `video-feature__embed`: responsive 16:9 iframe wrapper.
- `video-feature__content`: video title, description, and action wrapper.
- `landing-cta`: landing-only closing invitation block.
- `about-grid`: wrapper for the about section members.
- `about-card`: individual member card.
- `about-card__media`: image holder for the member photo.
- `about-card__content`: text wrapper for the member card.
- `about-card__title`: member name.
- `about-card__text`: member description paragraphs.
- `contact-grid`: grid of contact subjects.
- `contact-card`: individual contact subject card.
- `project-block__table-wrap`: wrapper that allows horizontal scrolling.
- `project-block__table`: table element.
- `project-block__table-caption`: table title.
- `project-block__table-head`: table header row.
- `project-block__table-row`: table body row.
- `project-block__table-cell`: table cells.
- `project-summary`: compact project facts grid.
- `project-summary__item`: one project fact.
- `project-timeline`: ordered sequence of project stages.
- `project-timeline__item`: one stage in the sequence.
- `project-callout`: highlighted project note or warning.
- `media-grid`: reusable image-card grid.
- `media-card`: image and caption unit.
- `media-card__image`: image inside a media card.
- `media-card__caption`: supporting image caption.

## Content Rules

- Keep local content in typed files under `src/data/local` while `CONTENT_SOURCE=local`.
- Public routes and components must read content through `getContentRepository()`.
- Store page composition as ordered, reusable `PageBlock` values instead of route-specific markup.
- Use `target="_blank"` and `rel="noreferrer"` for external links.
- Keep landing page cards limited to selected pages.
- Register public pages in the active content repository and mark only selected entries as featured on the landing page.
- Use Brazilian Portuguese consistently in visible labels and copy.
- Prefer concrete descriptions of real decisions and outcomes over generic promotional copy.
- Mark temporary solutions, hypothetical costs, and safety limitations clearly.
- Group recommendation links by purpose instead of preserving the order of an external link aggregator.
- Store recommendation thumbnails locally and disclose commercial or affiliate redirects.
- Use YouTube's privacy-enhanced `youtube-nocookie.com` domain for embedded videos.
- Do not publish placeholder contact details; list only channels that are currently monitored.

## New Page Checklist

1. Add a typed page entry to the active content provider with a unique slug and ordered blocks.
2. Reuse existing block types before extending `PageBlock` and `PageBlockRenderer`.
3. Add repository, renderer, validation, and migration support together when introducing a block type.
4. Mark the page as featured only when it should appear among the selected landing-page cards.
5. Confirm that external links use a new tab and that images have useful alternative text.
6. Run `npm run typecheck`, `npm run lint`, and `npm run build`.
7. Review the Vercel preview at desktop, tablet, and mobile widths before promotion.

## Notes

- Keep styling centralized in `src/styles.css`.
- Preserve the current palette and font setup.
- Favor simple, reusable structure over complex nesting.
- Keep source videos and research material in `/references`, which is ignored by Git.
- Store production-ready still images and other optimized assets under `src/images/`.
- Store recommendation thumbnails under `src/images/links/`; do not hotlink images from Linktree or store pages.
- The recommendations page was synchronized from Katy's Linktree on 2026-07-22 and must be updated manually when that source changes.
- `src/stylesBKUP2.css` is a historical backup and should remain untouched.
- Keep `CONTENT_SOURCE=local` until the Supabase migration, authentication, and content import are validated.
- Run the initial local-to-Supabase import only through the protected dashboard and only against empty content tables.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`; public configuration uses only the publishable key.
- Keep `main` on the stable static deployment until the `next-rebuild` preview is explicitly approved.
