-- Orders are never directly readable/writable through anon table APIs. Public flows use the RPCs below.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_city text not null,
  delivery_state text not null,
  delivery_note text not null default '',
  status text not null default 'awaiting_payment' check (status in ('awaiting_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount_ngn numeric(12,2) not null default 0 check (total_amount_ngn >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_ngn numeric(12,2) not null check (unit_price_ngn >= 0),
  quantity integer not null check (quantity between 1 and 20),
  line_total_ngn numeric(12,2) not null check (line_total_ngn >= 0)
);

create index if not exists orders_tracking_email_idx on public.orders (tracking_code, customer_email);
create index if not exists order_items_order_idx on public.order_items (order_id);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
revoke all on public.orders, public.order_items from public, anon, authenticated;

create or replace function public.create_public_order(p_customer jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  new_order_id uuid;
  new_tracking_code text;
  new_created_at timestamptz;
  new_total numeric(12,2);
  item_count integer;
begin
  if p_customer is null or jsonb_typeof(p_customer) <> 'object' then
    raise exception using errcode = '22023', message = 'Delivery details are required.';
  end if;
  if length(btrim(coalesce(p_customer->>'fullName', ''))) not between 2 and 100
    or length(btrim(coalesce(p_customer->>'email', ''))) not between 5 and 254
    or position('@' in coalesce(p_customer->>'email', '')) < 2
    or length(btrim(coalesce(p_customer->>'phone', ''))) not between 5 and 30
    or length(btrim(coalesce(p_customer->>'address', ''))) not between 5 and 250
    or length(btrim(coalesce(p_customer->>'city', ''))) not between 1 and 100
    or length(btrim(coalesce(p_customer->>'state', ''))) not between 1 and 100
    or length(coalesce(p_customer->>'note', '')) > 500 then
    raise exception using errcode = '22023', message = 'Please check the delivery details and try again.';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception using errcode = '22023', message = 'Your bag contents are invalid.';
  end if;
  item_count := jsonb_array_length(p_items);
  if item_count < 1 or item_count > 25 then
    raise exception using errcode = '22023', message = 'Your bag must contain between 1 and 25 items.';
  end if;
  if exists (
    select 1
    from jsonb_to_recordset(p_items) as i(product_id uuid, quantity integer)
    left join public.products p on p.id = i.product_id and p.active = true
    where p.id is null or i.quantity is null or i.quantity < 1 or i.quantity > 20 or i.quantity > p.stock_quantity
  ) then
    raise exception using errcode = '22023', message = 'One or more products are unavailable. Refresh the catalogue and try again.';
  end if;

  new_tracking_code := 'AK-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 12));
  insert into public.orders (tracking_code, customer_name, customer_email, customer_phone, delivery_address, delivery_city, delivery_state, delivery_note)
  values (new_tracking_code, btrim(p_customer->>'fullName'), lower(btrim(p_customer->>'email')), btrim(p_customer->>'phone'), btrim(p_customer->>'address'), btrim(p_customer->>'city'), btrim(p_customer->>'state'), btrim(coalesce(p_customer->>'note', '')))
  returning id, created_at into new_order_id, new_created_at;

  insert into public.order_items (order_id, product_id, product_name, unit_price_ngn, quantity, line_total_ngn)
  select new_order_id, p.id, p.name, p.price_ngn, i.quantity, round(p.price_ngn * i.quantity, 2)
  from jsonb_to_recordset(p_items) as i(product_id uuid, quantity integer)
  join public.products p on p.id = i.product_id and p.active = true;

  select coalesce(sum(line_total_ngn), 0) into new_total from public.order_items where order_id = new_order_id;
  update public.orders set total_amount_ngn = new_total where id = new_order_id;
  return jsonb_build_object('tracking_code', new_tracking_code, 'created_at', new_created_at, 'status', 'awaiting_payment', 'total_amount', new_total);
end;
$$;

create or replace function public.track_public_order(p_tracking_code text, p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  if length(coalesce(p_tracking_code, '')) not between 8 and 24 or length(coalesce(p_email, '')) not between 5 and 254 then
    return null;
  end if;
  select jsonb_build_object(
    'tracking_code', o.tracking_code,
    'created_at', o.created_at,
    'status', o.status,
    'total_amount', o.total_amount_ngn,
    'items', coalesce((select jsonb_agg(jsonb_build_object('product_name', oi.product_name, 'quantity', oi.quantity, 'unit_price_ngn', oi.unit_price_ngn, 'line_total_ngn', oi.line_total_ngn) order by oi.id) from public.order_items oi where oi.order_id = o.id), '[]'::jsonb)
  ) into result
  from public.orders o
  where upper(o.tracking_code) = upper(btrim(p_tracking_code))
    and lower(o.customer_email) = lower(btrim(p_email));
  return result;
end;
$$;

revoke all on function public.create_public_order(jsonb, jsonb) from public;
revoke all on function public.track_public_order(text, text) from public;
grant execute on function public.create_public_order(jsonb, jsonb) to anon, authenticated;
grant execute on function public.track_public_order(text, text) to anon, authenticated;
