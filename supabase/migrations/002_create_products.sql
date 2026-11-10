-- Product catalog with NGN prices and a category foreign key.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_ngn numeric(12,2) not null check (price_ngn >= 0),
  compare_at_price_ngn numeric(12,2) check (compare_at_price_ngn is null or compare_at_price_ngn >= price_ngn),
  image_url text not null default '/images/skincare-hero.jpg',
  stock_quantity integer not null default 100 check (stock_quantity >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_category_idx on public.products (active, category_id);
create index if not exists products_featured_created_idx on public.products (featured desc, created_at desc) where active = true;
