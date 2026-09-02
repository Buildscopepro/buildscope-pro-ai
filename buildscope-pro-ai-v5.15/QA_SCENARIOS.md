# BuildScope Pro AI v5.13 — End-to-End QA Scenarios

## Account matrix
Create four staging users:
- Admin
- Salesperson
- Field Crew
- Client

Verify each user sees only permitted screens/data.

## Scenario A — Roofing
1. Create client.
2. Create roofing project.
3. Try automatic roof area/squares.
4. If provider unavailable, confirm manual polygon fallback.
5. Enter/obtain ridge/eave/rake/valley.
6. Generate takeoff.
7. Verify shingles or metal system.
8. Verify quantities and estimate.

## Scenario B — Remodeling
1. Create remodeling project.
2. Enter siding, soffit, gutter, coping and lumber quantities.
3. Enter flooring/kitchen/bathroom measurements.
4. Enter wall/ceiling finish quantities.
5. Verify material takeoff and estimate.

## Scenario C — Product-backed AI
1. Search a real product.
2. Select exact product.
3. Generate visualization.
4. Confirm product manifest is returned.
5. Force one Pending item and verify approval is blocked.
6. Resolve the item and approve.
7. Create purchase list.

## Scenario D — Client
1. Submit service request.
2. Open proposal.
3. Choose option.
4. Sign/accept.
5. Verify PDF/final copy.
6. Verify shared photos/progress.

## Scenario E — Payments
1. Use Stripe test mode only.
2. Create payment request.
3. Open PaymentSheet.
4. Complete test payment.
5. Verify webhook changes status to paid.

## Scenario F — Push
1. Register Expo push token on physical Android build.
2. Queue project reminder.
3. Run push worker.
4. Verify push arrives.
5. Verify outbox status becomes sent.

## Scenario G — Failure handling
- Disable network.
- Stop backend.
- Use invalid provider credentials in staging.
- Verify the app shows errors and does not silently approve/charge/generate.

## Release condition
Every scenario must pass on a physical Android device before production AAB.
