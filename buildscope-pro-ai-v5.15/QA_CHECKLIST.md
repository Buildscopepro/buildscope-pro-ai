# BuildScope Pro AI v4.9 QA / Stabilization Checklist

## Package
- Version bumped to 4.9.0.
- v4.8 files preserved.
- Client approval added as a modular screen instead of replacing the existing application.
- Database migration added separately.

## Calculation checks to run on device
- Roof polygon with 3+ points.
- Pitch factors 4/12, 6/12, 8/12, 10/12, 12/12.
- Waste 5–20%.
- Shingle and metal takeoff.
- Wall area minus openings.
- Ceiling area.
- Flooring waste.
- Drywall/paint purchase-unit rounding.
- Zero/blank quantities never become negative.

## Product-backed design checks
- Pending item blocks approval.
- Exact item without brand + model/SKU blocks approval.
- Exact item without retailer blocks approval.
- Equivalent item is visibly labeled equivalent.
- Approval stores a snapshot of the finish schedule.

## Database checks
Run migrations in version order. Verify helper functions `current_company_id()` and `current_user_role()` already exist from earlier schema.
Test RLS with Admin, Salesperson, Field Crew and Client accounts before production.

## Still required for v5.0 production
- Live retailer/product search integration.
- Actual AI image-generation backend.
- Real company material/labor prices.
- Supabase production project and credentials.
- EAS/Android signing configuration.
- Physical-device regression testing.
