# Dashound

Reconstruction of the Dashound site as a Next.js content platform. The application currently runs with local typed content and is prepared to switch to Supabase without changing the public components.

## Safety

- The previous static version is preserved by the Git tag `static-v1`.
- Development happens on the `next-rebuild` branch.
- The production domain must remain on `main` until the preview is approved.
- Legacy HTML files remain in the repository during parity validation.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The site defaults to local content and does not require environment variables.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Content architecture

- `src/core/content`: public content contracts and repository interface.
- `src/data/local`: typed content migrated from the static site.
- `src/data/supabase`: remote repository implementation.
- `components`: reusable public rendering components.
- `app/admin`: administration interface and Server Actions.
- `supabase/migrations`: database, RLS, and Storage configuration.

Set `CONTENT_SOURCE=supabase` only after the remote project is configured and populated. See `supabase/README.md` for the setup sequence.
