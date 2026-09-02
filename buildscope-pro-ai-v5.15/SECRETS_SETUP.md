# BuildScope Pro AI v5.6 — Secrets & Credential Setup

## Mobile `.env`
Only public client values belong here:
```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
EXPO_PUBLIC_BUILDSCOPE_API_URL=https://your-backend.example.com
```

## Server `server/.env`
Server-only:
```env
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
PRODUCT_PROVIDER=openai_web
IMAGE_PROVIDER=openai
OPENAI_TEXT_MODEL=gpt-5.6
OPENAI_IMAGE_MODEL=gpt-image-2
```

## Never put these in the mobile app
- Supabase service-role key
- OpenAI API key
- retailer/provider secret keys
- Android keystore passwords
- private signing material

## Validation
After filling both env files:
```bash
npm run verify-env
npm run check:supabase
npm run check:backend
npm run check:all
```
