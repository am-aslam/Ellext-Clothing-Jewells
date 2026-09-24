create extension if not exists pgcrypto;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','SUSPENDED','PENDING')),
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'ADMIN' check (role in ('SUPER_ADMIN','ADMIN','INVENTORY_MANAGER','ORDER_MANAGER')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE','SUSPENDED')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  description text, image text, status boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  description text, image text, status boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  description text not null default '', short_description text, category_id uuid not null references public.categories(id),
  collection_id uuid references public.collections(id) on delete set null, sku text not null unique,
  price integer not null check (price >= 0), compare_at_price integer check (compare_at_price is null or compare_at_price >= price),
  currency text not null default 'INR', status text not null default 'DRAFT' check (status in ('ACTIVE','DRAFT','ARCHIVED')),
  featured boolean not null default false, new_arrival boolean not null default false, low_stock_threshold integer not null default 3 check (low_stock_threshold >= 0),
  material text, fabric text, fit text, care text, seo_title text, seo_description text,
  attributes jsonb not null default '{}'::jsonb, tags text[] not null default '{}', rating numeric(3,2) not null default 0, reviews_count integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  url text not null, storage_key text, alt_text text, sort_order integer not null default 0, is_cover boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique, name text not null, attributes jsonb not null default '{}'::jsonb, price integer,
  status boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(), product_id uuid unique references public.products(id) on delete cascade,
  variant_id uuid unique references public.product_variants(id) on delete cascade, stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0), low_stock_threshold integer not null default 3 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now(), check (product_id is not null or variant_id is not null)
);
create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(), inventory_id uuid not null references public.inventory(id) on delete cascade,
  type text not null check (type in ('INCREASE','DECREASE','SET','RESERVE','RELEASE','DEDUCT')),
  quantity integer not null, reason text, reference_id uuid, created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(), name text not null, type text not null check (type in ('PERCENTAGE','FIXED')),
  value integer not null check (value >= 0), product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade, minimum_order integer not null default 0,
  start_at timestamptz not null, end_at timestamptz not null, usage_limit integer, used_count integer not null default 0,
  status boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(), code text not null unique, discount_type text not null check (discount_type in ('PERCENTAGE','FIXED')),
  discount_value integer not null check (discount_value >= 0), minimum_order integer not null default 0, maximum_discount integer,
  usage_limit integer, usage_count integer not null default 0, per_customer_limit integer, start_at timestamptz not null, end_at timestamptz not null,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','INACTIVE','ARCHIVED')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.coupon_products (coupon_id uuid references public.coupons(id) on delete cascade, product_id uuid references public.products(id) on delete cascade, primary key (coupon_id, product_id));
create table if not exists public.coupon_categories (coupon_id uuid references public.coupons(id) on delete cascade, category_id uuid references public.categories(id) on delete cascade, primary key (coupon_id, category_id));

create table if not exists public.carts (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade, updated_at timestamptz not null default now());
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(), cart_id uuid not null references public.carts(id) on delete cascade, product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id) on delete set null, quantity integer not null check (quantity > 0),
  unique (cart_id, product_id, variant_id)
);
create table if not exists public.wishlists (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade);
create table if not exists public.wishlist_items (wishlist_id uuid references public.wishlists(id) on delete cascade, product_id uuid references public.products(id) on delete cascade, created_at timestamptz not null default now(), primary key (wishlist_id, product_id));
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, full_name text not null, phone text not null,
  house_building text not null, street text not null, area text not null, city text not null, state text not null, pin_code text not null,
  landmark text, country text not null default 'India', label text, is_default boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique, user_id uuid not null references public.users(id),
  status text not null default 'PLACED' check (status in ('PLACED','CONFIRMED','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED','REFUNDED')),
  payment_status text not null default 'CREATED' check (payment_status in ('CREATED','PENDING','AUTHORIZED','PAID','FAILED','REFUNDED','CANCELLED')),
  payment_method text not null check (payment_method in ('CARD','UPI','NETBANKING','COD')), subtotal integer not null, discount integer not null default 0,
  shipping integer not null default 0, tax integer not null default 0, total integer not null, currency text not null default 'INR', coupon_code text,
  shipping_address_snapshot jsonb not null, billing_address_snapshot jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id) on delete set null, product_name text not null, sku text not null, variant_snapshot jsonb,
  price integer not null, quantity integer not null, discount integer not null default 0, total integer not null
);
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null unique references public.orders(id) on delete cascade, provider text not null default 'manual',
  provider_order_id text, provider_payment_id text, amount integer not null, currency text not null default 'INR', payment_status text not null default 'CREATED', raw jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.coupon_usages (
  id uuid primary key default gen_random_uuid(), coupon_id uuid not null references public.coupons(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade,
  order_id uuid not null unique references public.orders(id) on delete cascade, created_at timestamptz not null default now()
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, user_id uuid not null references public.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5), comment text not null, verified_purchase boolean not null default false,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(product_id, user_id)
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, type text not null,
  title text not null, message text not null, read_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(), admin_id uuid references public.admin_users(id) on delete set null, action text not null,
  entity_type text not null, entity_id uuid, metadata jsonb, ip_address inet, created_at timestamptz not null default now()
);
create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(), admin_id uuid not null references public.admin_users(id) on delete cascade, token_hash text not null unique,
  user_agent text, ip_address inet, last_seen_at timestamptz not null default now(), revoked_at timestamptz, created_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users(email);
create index if not exists users_phone_idx on public.users(phone);
create index if not exists products_status_featured_idx on public.products(status, featured, new_arrival);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_collection_idx on public.products(collection_id);
create index if not exists product_images_product_order_idx on public.product_images(product_id, sort_order);
create index if not exists product_variants_product_idx on public.product_variants(product_id);
create index if not exists inventory_stock_threshold_idx on public.inventory(stock, low_stock_threshold);
create index if not exists inventory_tx_inventory_created_idx on public.inventory_transactions(inventory_id, created_at);
create index if not exists offers_dates_idx on public.offers(status, start_at, end_at);
create index if not exists coupons_status_dates_idx on public.coupons(code, status, start_at, end_at);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at);
create index if not exists orders_status_payment_idx on public.orders(status, payment_status);
create index if not exists orders_created_idx on public.orders(created_at);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists notifications_user_read_idx on public.notifications(user_id, read_at);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index if not exists admin_sessions_admin_active_idx on public.admin_sessions(admin_id, revoked_at);

do $$ declare t text; begin
  foreach t in array array['users','admin_users','categories','collections','products','product_images','product_variants','inventory','offers','coupons','carts','addresses','orders','payments','reviews','notifications'] loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

alter table public.users enable row level security;
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.offers enable row level security;
alter table public.coupons enable row level security;
drop policy if exists public_active_products on public.products;
create policy public_active_products on public.products for select using (status = 'ACTIVE');
drop policy if exists public_active_categories on public.categories;
create policy public_active_categories on public.categories for select using (status = true);
drop policy if exists public_active_collections on public.collections;
create policy public_active_collections on public.collections for select using (status = true);
drop policy if exists public_active_offers on public.offers;
create policy public_active_offers on public.offers for select using (status = true and now() between start_at and end_at);
drop policy if exists own_user_profile on public.users;
create policy own_user_profile on public.users for select using (auth.uid() = id);
drop policy if exists own_user_profile_update on public.users;
create policy own_user_profile_update on public.users for update using (auth.uid() = id);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admin_users where id = auth.uid() and status = 'ACTIVE');
$$;

grant usage on schema public to anon, authenticated, service_role;
