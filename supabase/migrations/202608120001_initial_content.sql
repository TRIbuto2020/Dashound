create type public.publication_status as enum ('draft', 'published', 'archived');
create type public.page_kind as enum ('project', 'guide', 'editorial');

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  kind public.page_kind not null,
  status public.publication_status not null default 'draft',
  eyebrow text not null,
  title text not null,
  summary text not null,
  featured boolean not null default false,
  featured_position integer,
  card jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.page_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type text not null,
  position integer not null check (position >= 0),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, position)
);

create table public.recommendation_categories (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text,
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recommendations (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category_id text not null references public.recommendation_categories (id),
  status public.publication_status not null default 'draft',
  eyebrow text not null,
  title text not null,
  description text not null,
  url text not null check (url ~ '^https://'),
  image text,
  image_alt text,
  placeholder text,
  action text not null,
  position integer not null check (position >= 0),
  is_affiliate boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, position)
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null,
  mime_type text not null,
  width integer check (width > 0),
  height integer check (height > 0),
  created_at timestamptz not null default now()
);

create index pages_status_idx on public.pages (status);
create index pages_featured_idx on public.pages (featured, featured_position);
create index page_blocks_page_id_idx on public.page_blocks (page_id, position);
create index recommendations_status_idx on public.recommendations (status);
create index recommendations_category_idx on public.recommendations (category_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

create trigger page_blocks_set_updated_at
before update on public.page_blocks
for each row execute function public.set_updated_at();

create trigger recommendation_categories_set_updated_at
before update on public.recommendation_categories
for each row execute function public.set_updated_at();

create trigger recommendations_set_updated_at
before update on public.recommendations
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.pages enable row level security;
alter table public.page_blocks enable row level security;
alter table public.recommendation_categories enable row level security;
alter table public.recommendations enable row level security;
alter table public.media enable row level security;

create policy "Admins can view their own authorization"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Published pages are public"
on public.pages for select
to anon, authenticated
using (status = 'published' or (select public.is_admin()));

create policy "Admins manage pages"
on public.pages for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Published page blocks are public"
on public.page_blocks for select
to anon, authenticated
using (
  exists (
    select 1
    from public.pages
    where pages.id = page_blocks.page_id
      and (pages.status = 'published' or (select public.is_admin()))
  )
);

create policy "Admins manage page blocks"
on public.page_blocks for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Recommendation categories are public"
on public.recommendation_categories for select
to anon, authenticated
using (true);

create policy "Admins manage recommendation categories"
on public.recommendation_categories for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Published recommendations are public"
on public.recommendations for select
to anon, authenticated
using (status = 'published' or (select public.is_admin()));

create policy "Admins manage recommendations"
on public.recommendations for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Media metadata is public"
on public.media for select
to anon, authenticated
using (true);

create policy "Admins manage media metadata"
on public.media for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select on public.pages to anon, authenticated;
grant select on public.page_blocks to anon, authenticated;
grant select on public.recommendation_categories to anon, authenticated;
grant select on public.recommendations to anon, authenticated;
grant select on public.media to anon, authenticated;

grant insert, update, delete on public.pages to authenticated;
grant insert, update, delete on public.page_blocks to authenticated;
grant insert, update, delete on public.recommendation_categories to authenticated;
grant insert, update, delete on public.recommendations to authenticated;
grant insert, update, delete on public.media to authenticated;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Admins upload site media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy "Admins update site media"
on storage.objects for update
to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()))
with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy "Admins delete site media"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()));
