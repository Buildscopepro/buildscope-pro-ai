# BuildScope Pro AI v5.2 — Backend Deployment

## What is now implemented
A runnable Express backend skeleton with:
- Supabase bearer-token verification.
- Company/profile lookup.
- Role checks.
- Product search endpoint.
- Product availability endpoint.
- Product-constrained visualization endpoint.
- AI generation audit logging.
- Purchase-list persistence.
- Zod validation.
- Helmet and structured request logging.

## Security boundary
The mobile app sends the signed-in user's Supabase access token. The backend verifies that token with Supabase Auth before doing privileged work. Supabase documents `auth.getUser(jwt)` as a server-confirmed way to authenticate a supplied access token.

The service-role key is server-only. Never put it in `EXPO_PUBLIC_*`.

## Provider mode
The package ships with `mock` provider adapters that deliberately return demo/not-configured results. They exist so the server contract runs without pretending that live retailer or AI services are connected.

To go live:
1. implement a real product provider adapter in `server/src/providers/products.js`;
2. implement a real image provider adapter in `server/src/providers/images.js`;
3. set provider names and server-side API secrets in the deployment environment.

## Run
```bash
cd server
npm install
cp .env.example .env
# fill real Supabase server values
npm run check
npm start
```

## Database
Run `backend/production_backend.sql`.
