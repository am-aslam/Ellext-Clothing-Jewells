# Ellext Supabase API

The backend is the authoritative REST API for Ellext Clothing & Jewells. Supabase Auth owns identities and sessions, Supabase PostgreSQL stores commerce data, and the API calculates prices, discounts, taxes, shipping, stock, and order totals server-side.

## Setup

1. Copy `.env.example` to `.env` and configure the Supabase URL, publishable key, secret key, and database URL. Never commit `.env`.
2. Run `npm run supabase:migrate`.
3. Run `npm run supabase:seed` to load the catalogue and coupon seed data.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_NAME`, then run `npm run admin:provision` to create a Supabase Auth admin and `SUPER_ADMIN` record.
5. Start with `npm run api:dev`, or use `npm run api:build && npm run api:start` in production.

## Admin app order push alerts

Push alerts are optional and require the `admin_push_subscriptions` migration. Apply migrations with `npm run supabase:migrate` before enabling notifications. Generate a VAPID key pair once from the backend package (`npx web-push generate-vapid-keys`) and configure these variables on the backend service in Vercel for Production (and Preview too, if needed):

- `VAPID_PUBLIC_KEY`: the generated public key.
- `VAPID_PRIVATE_KEY`: the generated private key; keep it as a secret and never commit it.
- `VAPID_SUBJECT`: a contact URI such as `mailto:orders@yourdomain.com`.

After deployment, sign in through the installed `/admin` app and select **Enable order alerts** on each device. Permission is requested only after that user action. A new checkout then sends the order number, customer name, up to three item names and quantities, item-count remainder, total, and payment method. The notification intentionally excludes the delivery address and phone number. Selecting an alert opens that order in the admin app. Each admin/device must opt in separately; push delivery also depends on browser/OS notification settings and network availability.

## API contract

Responses use `{ success: true, data }` or `{ success: false, error: { code, message } }`. Send Supabase access tokens as `Authorization: Bearer <token>`.

Public: `GET /health`, `/api/products`, `/api/products/:slug`, `/api/search`, `/api/categories`, `/api/collections`, `/api/offers`, `/api/coupons/active`.

Auth: `POST /api/auth/register`, `/login`, `/admin/login`, `/logout`, `/forgot-password`, `/reset-password`, `GET /api/auth/me`.

Customer: addresses, cart, wishlist, orders, notifications, reviews, and `POST /api/checkout`.

Admin: products and images, variants, inventory, offers, coupon lifecycle, orders, CRM customers, admin sessions, metrics, and audit logging. Admin routes require Supabase Auth plus an active admin role.

Checkout accepts only product/variant IDs, quantities, address ID, coupon code, and payment method. Prices and stock from the client are ignored. Inventory deduction and order creation occur in one PostgreSQL transaction with conditional updates to prevent overselling. Orders store address and line-item snapshots.

Product image records store URLs and storage keys. Large files should be uploaded to Supabase Storage or another object store; PostgreSQL stores metadata only. The existing `npm run assets:import -- <archive>` command can import supplied image assets for catalogue review.

Product uploads use the public Supabase Storage bucket named by `STORAGE_BUCKET` (defaults to `ellext-product-images`). The backend attempts to create/configure the bucket on first upload using its Supabase secret/service-role key. If the Supabase project disallows bucket creation, create a **public** bucket with that name under Supabase Dashboard → Storage, allow JPEG/PNG/WebP/AVIF, and check the backend `SUPABASE_SECRET_KEY` has Storage admin access. The upload endpoint now logs the provider's reason in backend logs and returns a setup-specific message.

Payment success is accepted only through a verified provider webhook. Configure Razorpay-compatible secrets through environment variables; no payment secret is returned by the API.
