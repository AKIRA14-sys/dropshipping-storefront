-- Forward migration for the live-inventory storefront and customer account foundation.
-- This migration intentionally removes the old public order/tracking RPCs. Checkout stays closed
-- until an authenticated, payment-verified order flow is implemented in a later stage.

begin;

-- Replace the previous department names. Remove only the exact starter inventory rows.
delete from public.products
where slug in (
  'daily-dew-vitamin-serum',
  'gentle-cloud-cleanser',
  'everyday-cross-strap-sandals',
  'weekend-denim-tote',
  'everyday-wireless-earbuds',
  'smart-watch-lite',
  'soft-touch-throw',
  'warm-glow-table-lamp'
);

alter table public.categories drop constraint if exists categories_slug_check;
update public.categories set slug = 'anime' where slug = 'beauty';
update public.categories set slug = 'school-supplies' where slug = 'electronics';
update public.categories set slug = 'home-appliances' where slug = 'home-living';

-- Product values are required to come from real owner-managed inventory, never placeholder defaults.
alter table public.products alter column image_url drop default;
alter table public.products alter column image_url drop not null;
alter table public.products alter column stock_quantity set default 0;
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists currency_code text not null default 'NGN';
alter table public.products add column if not exists attributes jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists search_terms text[] not null default '{}'::text[];
alter table public.products add column if not exists subcategory_id uuid;

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null,
  name text not null,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(category_id, slug),
  unique(id, category_id)
);

alter table public.products
  add constraint products_subcategory_category_fk
  foreign key (subcategory_id, category_id)
  references public.subcategories(id, category_id)
  on delete set null (subcategory_id);

create index if not exists products_brand_idx on public.products (brand) where active = true;
create index if not exists products_search_terms_idx on public.products using gin (search_terms);
create index if not exists subcategories_category_active_idx on public.subcategories (category_id, active, display_order);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_sort_idx on public.product_images(product_id, sort_order);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  label text not null,
  options jsonb not null default '{}'::jsonb,
  price_ngn numeric(12,2) check (price_ngn is null or price_ngn >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists product_variants_product_active_idx on public.product_variants(product_id, active);

create table if not exists public.store_promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  cta_label text,
  cta_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

-- Customer profile and account-owned records.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text not null default '',
  city text not null,
  state_region text not null,
  postal_code text not null default '',
  country_code text not null default 'NG' check (country_code ~ '^[A-Z]{2}$'),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists customer_addresses_user_idx on public.customer_addresses(user_id, created_at desc);
create unique index if not exists customer_addresses_one_default_per_user
  on public.customer_addresses(user_id) where is_default = true;
drop trigger if exists customer_addresses_updated_at on public.customer_addresses;
create trigger customer_addresses_updated_at before update on public.customer_addresses
for each row execute function public.set_updated_at();

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  variant_key text not null default 'default',
  quantity integer not null check (quantity between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id, variant_key),
  check ((variant_id is null and variant_key = 'default') or (variant_id is not null and variant_key = variant_id::text))
);
create index if not exists cart_items_user_idx on public.cart_items(user_id);
drop trigger if exists cart_items_updated_at on public.cart_items;
create trigger cart_items_updated_at before update on public.cart_items
for each row execute function public.set_updated_at();

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);
create index if not exists wishlist_items_user_idx on public.wishlist_items(user_id, created_at desc);

-- Existing orders are private to an authenticated owner. No client-side create/update policy is added.
alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.orders add column if not exists payment_status text not null default 'unpaid';
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check
  check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'cancelled'));
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
drop index if exists public.orders_tracking_email_idx;

-- Remove the old unauthenticated order-creation and tracking entry points.
revoke all on function public.create_public_order(jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.track_public_order(text, text) from public, anon, authenticated;
drop function if exists public.create_public_order(jsonb, jsonb);
drop function if exists public.track_public_order(text, text);

-- Only aggregate paid product units are exposed; this contains no customer or order identifiers.
create or replace function public.get_public_bestseller_counts(p_limit integer default 8)
returns table(product_id uuid, paid_units bigint)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select oi.product_id, sum(oi.quantity)::bigint as paid_units
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  join public.products p on p.id = oi.product_id and p.active = true
  where o.payment_status = 'paid' and oi.product_id is not null
  group by oi.product_id
  order by paid_units desc, oi.product_id
  limit least(greatest(coalesce(p_limit, 8), 1), 50);
$$;
revoke all on function public.get_public_bestseller_counts(integer) from public;
grant execute on function public.get_public_bestseller_counts(integer) to anon, authenticated;

-- Public browse permissions are read-only and reveal only active catalog records.
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.store_promotions enable row level security;

drop policy if exists "Anyone can read active categories" on public.categories;
create policy "Anyone can read active categories" on public.categories for select to anon, authenticated using (active = true);
drop policy if exists "Anyone can read active subcategories" on public.subcategories;
create policy "Anyone can read active subcategories" on public.subcategories for select to anon, authenticated using (active = true);
drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products" on public.products for select to anon, authenticated using (active = true);
drop policy if exists "Anyone can read active product images" on public.product_images;
create policy "Anyone can read active product images" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.active = true));
drop policy if exists "Anyone can read active product variants" on public.product_variants;
create policy "Anyone can read active product variants" on public.product_variants for select to anon, authenticated
  using (active = true and exists (select 1 from public.products p where p.id = product_id and p.active = true));
drop policy if exists "Anyone can read current store promotions" on public.store_promotions;
create policy "Anyone can read current store promotions" on public.store_promotions for select to anon, authenticated
  using (active = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.subcategories, public.products, public.product_images, public.product_variants, public.store_promotions to anon, authenticated;

-- Account data is strictly isolated by auth.uid().
alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

revoke all on public.profiles, public.customer_addresses, public.cart_items, public.wishlist_items, public.orders, public.order_items from public, anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.customer_addresses, public.cart_items, public.wishlist_items to authenticated;
grant select on public.orders, public.order_items to authenticated;

drop policy if exists "Customers can read their profile" on public.profiles;
create policy "Customers can read their profile" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "Customers can update their profile" on public.profiles;
create policy "Customers can update their profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Customers manage their own addresses" on public.customer_addresses;
create policy "Customers manage their own addresses" on public.customer_addresses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Customers manage their own cart" on public.cart_items;
create policy "Customers manage their own cart" on public.cart_items for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Customers manage their own wishlist" on public.wishlist_items;
create policy "Customers manage their own wishlist" on public.wishlist_items for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Customers can read their own orders" on public.orders;
create policy "Customers can read their own orders" on public.orders for select to authenticated using (user_id = auth.uid());
drop policy if exists "Customers can read their own order items" on public.order_items;
create policy "Customers can read their own order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

commit;
