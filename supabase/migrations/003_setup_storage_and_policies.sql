-- Public can browse active catalog rows and read approved product images. No public upload policy.
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Anyone can read active categories" on public.categories;
create policy "Anyone can read active categories" on public.categories for select to anon, authenticated using (active = true);
drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products" on public.products for select to anon, authenticated using (active = true);
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
