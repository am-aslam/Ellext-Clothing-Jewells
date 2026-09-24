alter table public.products
  add column if not exists free_shipping boolean not null default false;
