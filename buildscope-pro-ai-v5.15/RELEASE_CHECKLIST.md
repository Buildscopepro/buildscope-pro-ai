# BuildScope Pro AI v5.13 — Release Checklist

## Source gate
- [ ] `npm run release-gate` passes.
- [ ] `npm run smoke` passes against deployed staging services.
- [ ] `npm run doctor` passes.

## Staging gate
- [ ] Supabase staging configured.
- [ ] Backend deployed.
- [ ] OpenAI configured.
- [ ] Google Solar configured.
- [ ] Stripe test mode configured.
- [ ] Expo/EAS push credentials configured.
- [ ] Roof linear geometry provider selected or manual field workflow accepted.

## Device gate
- [ ] Preview APK installed on physical Android.
- [ ] All scenarios in `QA_SCENARIOS.md` pass.
- [ ] No blocking crash.
- [ ] No cross-company data leak.
- [ ] No role-permission leak.
- [ ] No client approval with unresolved product.
- [ ] No payment amount controlled by client.
- [ ] Push delivery verified.
- [ ] PDFs/signatures verified.

## Production gate
- [ ] Final company prices loaded.
- [ ] Final branding/icon/splash loaded.
- [ ] Privacy policy complete.
- [ ] Google Play data-safety disclosures complete.
- [ ] Production Stripe mode intentionally enabled.
- [ ] Production AAB built and reviewed.
