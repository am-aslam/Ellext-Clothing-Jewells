# Ellext on Vercel

The storefront and Express API deploy together. Vercel serves the Next.js app and routes `/api/*` to the Express function in `api/[...path].ts`. Local development continues to proxy `/api/*` to `localhost:4000`.

## Deploy

1. Import `am-aslam/Ellext-Clothing-Jewells` in Vercel and keep the project root at the repository root. Vercel should detect Next.js; use `npm run build` as the build command and leave the output directory unset.
2. Add the production environment variables below in Vercel Project Settings → Environment Variables. Add them to Production and Preview only as appropriate. Never paste secret values into source files or commit `.env`.
3. Deploy. Verify `https://<your-domain>/api/health`, `/admin/login`, and `/jewells`.
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

For a same-deployment setup, leave `NEXT_PUBLIC_API_URL` unset in Vercel: browser requests use the same origin and server-rendered requests use Vercel's `VERCEL_URL`. If the API is hosted separately, set `NEXT_PUBLIC_API_URL` to its HTTPS origin and `API_INTERNAL_BASE_URL` to the server-side reachable API origin; configure the API's `FRONTEND_URL`/CORS origin accordingly.

## Local development

Run the frontend and API separately with `npm run dev` and `npm run api:dev`. Local `/api/*` requests are proxied to `http://localhost:4000` by `next.config.mjs`.

## Checks

```sh
npm ci
npm run api:build
npm run api:test
npm run build
```
