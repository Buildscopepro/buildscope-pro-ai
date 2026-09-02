# BuildScope Pro AI v5.5 — Go-Live Sequence

## Phase 1 — Credentials
Run:
```bash
npm run bootstrap
npm run verify-env
```

## Phase 2 — Database
Create the production Supabase project and apply migrations in `MIGRATION_ORDER.md`.

## Phase 3 — Backend
```bash
cd server
npm install
npm run check
npm start
```
Verify:
- `/health`
- `/ready`

## Phase 4 — Mobile QA
```bash
cd ..
npm install
npm run preflight
npm run production-check
npm run doctor
npx expo start
```

## Phase 5 — Preview APK
```bash
npx eas-cli login
npx eas-cli build:configure
npm run build:android:preview
```

Install the APK on a physical Android phone and test:
- login/roles;
- roofing measurement;
- remodeling quantities;
- wall/ceiling finishes;
- product search;
- AI visualization;
- product reconciliation;
- client approval;
- purchase list;
- proposals/PDFs;
- photos;
- scheduling/weather/notifications.

## Phase 6 — Production AAB
After QA passes:
```bash
npm run build:android:production
```
