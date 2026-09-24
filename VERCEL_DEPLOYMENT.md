# Ellext on Vercel Services

The storefront and Express API deploy as two Vercel Services from this repository. `vercel.json` sets the frontend root to `.` and the backend root to `backend`, routes `/api/backend/...` to Express, and sends all other paths to Next.js. The backend normalizes its Vercel mount back to the existing `/api/...` route tree. Local development continues to proxy `/api/*` to `localhost:4000`.

## Deploy

1. Import `am-aslam/Ellext-Clothing-Jewells` in Vercel, keep the project root at the repository root, and set the project framework to **Services**. Vercel builds the `frontend` and `backend` entries in `vercel.json` independently.
2. Add the production environment variables below in Vercel Project Settings → Environment Variables. Add them to Production and Preview only as appropriate. Never paste secret values into source files or commit `.env`.
3. Deploy. Verify `https://<your-domain>/api/backend/health`, `/admin/login`, and `/jewells`.
4. Set `FRONTEND_URL` and `ADMIN_APP_URL` to the real production origin/route. Add preview origins only if cross-origin clients need them.

## Required environment variables

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` — server-only; never use a `NEXT_PUBLIC_` prefix
- `SUPABASE_DB_URL` — use the Supabase connection string appropriate for serverless deployments
- `FRONTEND_URL` — deployed HTTPS origin
- `ADMIN_SETUP_KEY` — one-time initial admin provisioning key; use a long random value
- `ADMIN_ORDER_EMAIL`
- `EMAIL_FROM`

Configure email, object storage, and payment credentials (`EMAIL_API_KEY`/SMTP, `STORAGE_*`, and `PAYMENT_*`) only when those services are ready. The values in `.env.example` are placeholders, not production secrets.

The frontend declares a Vercel Service Binding to the backend. Vercel injects `BACKEND_INTERNAL_URL` for server-side frontend requests; do not add that variable manually. Browser requests use the public `/api/backend` rewrite (or Vercel's generated `NEXT_PUBLIC_BACKEND_URL`). For local development, `NEXT_PUBLIC_API_URL` may point to `http://localhost:4000`; the backend service itself is started with `npm run api:dev`.

## Local development

Run the frontend and API separately with `npm run dev` and `npm run api:dev`. Local `/api/*` requests are proxied to `http://localhost:4000` by `next.config.mjs`.

## Checks

```sh
npm ci
npm run api:build
npm run api:test
npm run build
```
