-- Search and account hardening for the live-only catalog.
-- No product, offer, stock, review, order, or payment data is seeded here.

begin;

alter table public.products
  add column if not exists is_new_arrival boolean not null default false;

alter table public.products
  add column if not exists search_document tsvector generated always as (
    setweight(to_tsvector('simple'::regconfig, coalesce(name, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(brand, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(array_to_string(search_terms, ' '), '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(description, '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(attributes::text, '')), 'C')
  ) stored;

create index if not exists products_search_document_idx
  on public.products using gin (search_document);
create index if not exists products_new_arrivals_idx
  on public.products (created_at desc)
  where active = true and is_new_arrival = true;

-- Customers may change only their own editable profile fields, not row IDs or timestamps.
revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- Change a default address as one transaction while checking the signed-in owner.
create or replace function public.set_default_customer_address(p_address_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  perform 1
  from public.customer_addresses
  where id = p_address_id and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Address not found for this account' using errcode = '42501';
  end if;

  update public.customer_addresses
  set is_default = false
  where user_id = auth.uid() and is_default = true;

  update public.customer_addresses
  set is_default = true
  where id = p_address_id and user_id = auth.uid();
end;
$$;
revoke all on function public.set_default_customer_address(uuid) from public, anon;
grant execute on function public.set_default_customer_address(uuid) to authenticated;

-- Trigger-only helper functions need not be directly callable by application roles.
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

commit;
