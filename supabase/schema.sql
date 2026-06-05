-- Driveway Deal Network Supabase setup
-- Run this in the Supabase SQL editor after creating your project.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric(10, 2) not null default 0,
  fake_original_price numeric(10, 2) not null default 0,
  category text not null,
  condition text not null,
  status text not null default 'Available',
  badge text not null default 'Still Available',
  segment text not null,
  featured boolean not null default false,
  deal_of_the_hour boolean not null default false,
  hot boolean not null default false,
  pitch text not null,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "Public can view items" on public.items;
create policy "Public can view items"
on public.items
for select
using (true);

drop policy if exists "Admins can insert items" on public.items;
create policy "Admins can insert items"
on public.items
for insert
with check (public.is_admin());

drop policy if exists "Admins can update items" on public.items;
create policy "Admins can update items"
on public.items
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete items" on public.items;
create policy "Admins can delete items"
on public.items
for delete
using (public.is_admin());

drop policy if exists "Admins can view admin users" on public.admin_users;
create policy "Admins can view admin users"
on public.admin_users
for select
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('item-photos', 'item-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view item photos" on storage.objects;
create policy "Public can view item photos"
on storage.objects
for select
using (bucket_id = 'item-photos');

drop policy if exists "Admins can upload item photos" on storage.objects;
create policy "Admins can upload item photos"
on storage.objects
for insert
with check (bucket_id = 'item-photos' and public.is_admin());

drop policy if exists "Admins can update item photos" on storage.objects;
create policy "Admins can update item photos"
on storage.objects
for update
using (bucket_id = 'item-photos' and public.is_admin())
with check (bucket_id = 'item-photos' and public.is_admin());

drop policy if exists "Admins can delete item photos" on storage.objects;
create policy "Admins can delete item photos"
on storage.objects
for delete
using (bucket_id = 'item-photos' and public.is_admin());

-- After running the schema, add your admin login email:
-- insert into public.admin_users (email) values ('you@example.com');
