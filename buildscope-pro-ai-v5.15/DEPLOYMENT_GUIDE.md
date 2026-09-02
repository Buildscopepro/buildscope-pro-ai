# BuildScope Pro AI v5.4 — Deployment Guide

## 1. Create production Supabase project
Create the real project and keep these values:
- Project URL
- Publishable key
- Service-role key (SERVER ONLY)

Run all SQL migrations from `/backend` in version order.

## 2. Configure the backend
Copy:
`server/.env.example` -> `server/.env`

Fill:
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY

Recommended provider settings:
- PRODUCT_PROVIDER=openai_web
- IMAGE_PROVIDER=openai
- OPENAI_IMAGE_MODEL=gpt-image-2

## 3. Run backend locally
```bash
cd server
npm install
npm run check
npm start
```

Health:
- GET `/health`
- GET `/ready`

## 4. Run with Docker
```bash
docker compose up --build
```

## 5. Configure the mobile app
Create `.env` in the project root:
```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
EXPO_PUBLIC_BUILDSCOPE_API_URL=https://YOUR_BACKEND
```

Do NOT place service-role or OpenAI keys in the mobile `.env`.

## 6. Validate
```bash
npm install
npm run preflight
npm run production-check
npm run doctor
```

## 7. Build Android preview
```bash
npx eas-cli login
npx eas-cli build:configure
npm run build:android:preview
```

This produces the internal-test APK after EAS credentials/project setup is complete.

## 8. Production AAB
After physical-device QA:
```bash
npm run build:android:production
```
