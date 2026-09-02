# BuildScope Pro AI v5.12 — Final Android QA Plan

## Goal
Stop adding speculative features and prove the app works on a real Android device.

## In-app QA
A floating `QA` button opens the release checklist.

The screen shows:
- Supabase configuration status.
- Backend health.
- Provider readiness.
- Physical-device test checklist.
- Release gate decision.

## Minimum pass before production
1. Admin login works.
2. Salesperson role restrictions work.
3. Field Crew restrictions work.
4. Client restrictions work.
5. Client/project creation works.
6. Roofing calculation is plausible against a known roof.
7. Remodel/wall/ceiling quantities are plausible.
8. Product search returns identifiable real products.
9. AI design respects the selected finish/product sufficiently for client presentation.
10. Pending product states block approval.
11. Client finish approval stores snapshot.
12. Proposal/PDF/signature workflow succeeds.
13. Stripe test payment succeeds and webhook marks paid.
14. Push notification arrives on physical Android device.
15. Weather/scheduling loads.
16. Automatic roof area behaves correctly or falls back to manual.
17. App survives network/API failures without crashing.

## Release rule
A successful source preflight is not the same as a successful product QA.
Do not publish the AAB until physical-device regression passes.
