-- Placeholder content for development only. Replace or deactivate before launch.
insert into public.categories (slug, name, description, display_order) values
  ('beauty', 'Beauty & care', 'Small rituals, feel-good essentials.', 1),
  ('fashion', 'Fashion', 'Easy pieces and everyday accessories.', 2),
  ('electronics', 'Electronics', 'Useful tech for work, play and everything between.', 3),
  ('home-living', 'Home & living', 'Thoughtful touches for a more comfortable home.', 4)
on conflict (slug) do update set name = excluded.name, description = excluded.description, display_order = excluded.display_order, active = true;

insert into public.products (category_id, slug, name, description, price_ngn, compare_at_price_ngn, image_url, stock_quantity, featured, active)
select c.id, v.slug, v.name, v.description, v.price_ngn, v.compare_at_price_ngn, v.image_url, 100, v.featured, true
from (values
  ('beauty', 'daily-dew-vitamin-serum', 'Daily Dew Vitamin Serum', 'Demo item. Confirm ingredients and claims before selling.', 14900::numeric, 18900::numeric, '/images/skincare-hero.jpg', true),
  ('beauty', 'gentle-cloud-cleanser', 'Gentle Cloud Cleanser', 'Demo item. Confirm ingredients and claims before selling.', 11900::numeric, null::numeric, '/images/skincare-hero.jpg', true),
  ('fashion', 'everyday-cross-strap-sandals', 'Everyday Cross-Strap Sandals', 'Demo item. Confirm sizes, materials and supplier details before launch.', 18500::numeric, 22500::numeric, '/images/fashion-flatlay.jpg', true),
  ('fashion', 'weekend-denim-tote', 'Weekend Denim Tote', 'Demo item. Confirm dimensions and materials before launch.', 12900::numeric, null::numeric, '/images/fashion-flatlay.jpg', false),
  ('electronics', 'everyday-wireless-earbuds', 'Everyday Wireless Earbuds', 'Demo item. Verify compatibility, battery claims and warranty before launch.', 24900::numeric, 29900::numeric, '/images/gadgets.jpg', true),
  ('electronics', 'smart-watch-lite', 'Smart Watch Lite', 'Demo item. Verify features and compatibility before launch.', 32500::numeric, null::numeric, '/images/gadgets.jpg', false),
  ('home-living', 'soft-touch-throw', 'Soft-Touch Lounge Throw', 'Demo item. Check dimensions and fabric details before launch.', 19900::numeric, 24900::numeric, '/images/home-living.jpg', true),
  ('home-living', 'warm-glow-table-lamp', 'Warm Glow Table Lamp', 'Demo item. Confirm dimensions and electrical certification before launch.', 28500::numeric, null::numeric, '/images/home-living.jpg', false)
) as v(category_slug, slug, name, description, price_ngn, compare_at_price_ngn, image_url, featured)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price_ngn = excluded.price_ngn,
  compare_at_price_ngn = excluded.compare_at_price_ngn,
  image_url = excluded.image_url,
  featured = excluded.featured,
  active = true;
