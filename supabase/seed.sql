-- Bootstrap the four user-defined storefront departments and browse filters.
-- Intentionally contains no products, prices, photos, reviews, orders or sales figures.
insert into public.categories (slug, name, description, display_order, active) values
  ('fashion', 'Fashion', 'Clothing, shoes, bags and accessories.', 1, true),
  ('anime', 'Anime & Collectibles', 'Anime-inspired collections and collectibles.', 2, true),
  ('school-supplies', 'School Supplies', 'Bags, writing materials, notebooks and stationery.', 3, true),
  ('home-appliances', 'Home Appliances', 'Useful appliances and everyday home electronics.', 4, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  active = true;

insert into public.subcategories (category_id, slug, name, display_order)
select c.id, item.slug, item.name, item.display_order
from (values
  ('fashion', 'mens-fashion', 'Men''s fashion', 1),
  ('fashion', 'womens-fashion', 'Women''s fashion', 2),
  ('fashion', 'clothing', 'Clothing', 3),
  ('fashion', 'shoes', 'Shoes', 4),
  ('fashion', 'bags', 'Bags', 5),
  ('fashion', 'accessories', 'Accessories', 6),
  ('anime', 'anime-figures', 'Anime figures', 1),
  ('anime', 'anime-plushies', 'Anime plushies', 2),
  ('anime', 'anime-clothing', 'Anime clothing', 3),
  ('anime', 'anime-accessories', 'Anime accessories', 4),
  ('anime', 'collectibles', 'Collectibles', 5),
  ('school-supplies', 'school-bags', 'School bags', 1),
  ('school-supplies', 'backpacks', 'Backpacks', 2),
  ('school-supplies', 'writing-materials', 'Writing materials', 3),
  ('school-supplies', 'notebooks', 'Notebooks', 4),
  ('school-supplies', 'stationery', 'Stationery', 5),
  ('school-supplies', 'school-accessories', 'School accessories', 6),
  ('home-appliances', 'kitchen-appliances', 'Kitchen appliances', 1),
  ('home-appliances', 'cleaning-appliances', 'Cleaning appliances', 2),
  ('home-appliances', 'personal-appliances', 'Personal appliances', 3),
  ('home-appliances', 'home-electronics', 'Home electronics', 4),
  ('home-appliances', 'small-household-appliances', 'Small household appliances', 5)
) as item(category_slug, slug, name, display_order)
join public.categories c on c.slug = item.category_slug
on conflict (category_id, slug) do update set
  name = excluded.name,
  display_order = excluded.display_order,
  active = true;
