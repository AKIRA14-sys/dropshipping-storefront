-- Category table for the four storefront departments.
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('beauty', 'fashion', 'electronics', 'home-living')),
  name text not null,
  description text not null default '',
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
