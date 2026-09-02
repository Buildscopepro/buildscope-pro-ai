# BuildScope Pro AI v5.6 — First Android Preview Build

## Prerequisites
- Expo account with EAS access.
- Real production/dev Supabase project.
- Backend deployed and `/ready` returning HTTP 200.
- Mobile `.env` configured.
- `npm run check:all` passing.
- `npm run doctor` passing.

## Build
```bash
npm install
npx eas-cli login
npx eas-cli build:configure
npm run build:android:preview
```

The `preview` profile in `eas.json` targets an APK for internal testing.

## Physical-device test order
1. Install APK on Android.
2. Sign in with Admin test account.
3. Create client/project.
4. Test roofing measurement and takeoff.
5. Test remodeling/wall/ceiling quantities.
6. Search a real product.
7. Generate a product-backed AI visualization.
8. Confirm unresolved products block approval.
9. Approve resolved finish schedule.
10. Create purchase list.
11. Test proposal/PDF.
12. Test scheduling/weather/notifications.
13. Repeat with Salesperson, Field Crew and Client roles.
