# BuildScope Pro AI v5.15 — Vercel Backend Deployment

## Backend shape
The Express backend now has two entrypoints:

- `server/src/index.js` — normal Node server.
- `server/api/index.js` — Vercel Function.

Set the Vercel project **Root Directory** to `server`.

## Required Vercel environment variables

```env
SUPABASE_URL=https://qidqemrftcsetzbbfkrn.supabase.co
SUPABASE_PUBLISHABLE_KEY=<public BuildScopePro key>
SUPABASE_SECRET_KEY=<server-only sb_secret key>

PRODUCT_PROVIDER=openai_web
IMAGE_PROVIDER=openai
OPENAI_API_KEY=<server-only key>

ROOF_PROVIDER=google_solar
GOOGLE_SOLAR_API_KEY=<server-only key>

STRIPE_SECRET_KEY=<server-only key>
STRIPE_WEBHOOK_SECRET=<server-only webhook key>

EXPO_ACCESS_TOKEN=<optional>

ROOF_GEOMETRY_PROVIDER=external
ROOF_GEOMETRY_PROVIDER_URL=<provider URL>
ROOF_GEOMETRY_PROVIDER_API_KEY=<server-only key>
```

## Critical security rule
Never put `SUPABASE_SECRET_KEY`, OpenAI keys, Stripe secret keys, Google server keys, or roof-provider secrets in the mobile app.

## After deployment
Verify:

- `GET /health` -> HTTP 200
- `GET /ready` -> HTTP 200 when required configuration is complete

Then set the mobile variable:

```env
EXPO_PUBLIC_BUILDSCOPE_API_URL=https://YOUR-VERCEL-DOMAIN
```
