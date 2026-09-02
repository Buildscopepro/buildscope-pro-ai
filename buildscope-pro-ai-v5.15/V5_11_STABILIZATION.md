# BuildScope Pro AI v5.11 — Stabilization Release Candidate

## Root integration completed
- Existing v5.10 app UI moved intact to `AppCore.js`.
- New `App.js` is the production root shell.
- Stripe is initialized with `StripeProvider` when a publishable key exists.
- URL scheme: `buildscopeproai`.
- Global runtime error boundary added.
- Production backend/Supabase status component added.

## Dependency alignment
For Expo SDK 57:
- React pinned to 19.2.3.
- `@stripe/stripe-react-native` pinned to 0.64.0.
- `expo-constants` pinned to ~57.0.12.
- `expo-notifications` pinned to ~57.0.12.

## Android testing rule
Remote push notifications are not a valid Expo Go test on Android for current Expo SDKs. Use the EAS preview/development build on a physical Android device.

## Stripe testing rule
PaymentSheet is initialized at app root. The publishable Stripe key is safe for the client; Stripe secret keys remain server-only.

## Release gate
Run:
```bash
npm install
npm run release-gate
npm run doctor
```

Then generate the EAS preview APK and perform physical-device QA.
