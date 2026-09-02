# First Live Test — Operator Card

Once credentials are configured:

```bash
npm install
npm run qa:all
npm run doctor
```

Then:

```bash
npx eas-cli login
npx eas-cli build:configure
npm run build:android:preview
```

Install Preview APK on Android.

Start with:
1. Admin login.
2. Create QA client/project.
3. Check Production Status screen.
4. Run Roofing scenario.
5. Run Product-backed AI scenario.
6. Run one Stripe test payment.
7. Run one push notification.

Do not use real customer payments or production customer addresses during initial QA.
