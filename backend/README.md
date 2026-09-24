# Ellext Supabase API

The backend is the authoritative REST API for Ellext Clothing & Jewells. Supabase Auth owns identities and sessions, Supabase PostgreSQL stores commerce data, and the API calculates prices, discounts, taxes, shipping, stock, and order totals server-side.

## Setup

1. Copy `.env.example` to `.env` and configure the Supabase URL, publishable key, secret key, and database URL. Never commit `.env`.
2. Run `npm run supabase:migrate`.
3. Run `npm run supabase:seed` to load the catalogue and coupon seed data.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME`, then run `npm run admin:provision` to create a Supabase Auth admin and `SUPER_ADMIN` record.
5. Start with `npm run api:dev`, or use `npm run api:build && npm run api:start` in production.

## API contract

Responses use `{ success: true, data }` or `{ success: false, error: { code, message } }`. Send Supabase access tokens as `Authorization: Bearer <token>`.

Public: `GET /health`, `/api/products`, `/api/products/:slug`, `/api/search`, `/api/categories`, `/api/collections`, `/api/offers`, `/api/coupons/active`.

Auth: `POST /api/auth/register`, `/login`, `/admin/login`, `/logout`, `/forgot-password`, `/reset-password`, `GET /api/auth/me`.

Customer: addresses, cart, wishlist, orders, notifications, reviews, and `POST /api/checkout`.

Admin: products and images, variants, inventory, offers, coupon lifecycle, orders, CRM customers, admin sessions, metrics, and audit logging. Admin routes require Supabase Auth plus an active admin role.

Checkout accepts only product/variant IDs, quantities, address ID, coupon code, and payment method. Prices and stock from the client are ignored. Inventory deduction and order creation occur in one PostgreSQL transaction with conditional updates to prevent overselling. Orders store address and line-item snapshots.

Product image records store URLs and storage keys. Large files should be uploaded to Supabase Storage or another object store; PostgreSQL stores metadata only. The existing `npm run assets:import -- <archive>` command can import supplied image assets for catalogue review.

Payment success is accepted only through a verified provider webhook. Configure Razorpay-compatible secrets through environment variables; no payment secret is returned by the API.
