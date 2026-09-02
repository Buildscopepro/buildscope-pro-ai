# BuildScope Pro AI — Recommended Migration Order

Run migrations in this order against the production Supabase project.

1. Earlier base/company/profile/project schema from the earliest BuildScope migrations.
2. `backend/photos.sql` if present.
3. `backend/inspection.sql`
4. `backend/annotations.sql`
5. `backend/estimate_lines.sql`
6. `backend/estimate_rules.sql`
7. `backend/roof_takeoffs.sql`
8. `backend/roof_system_rules.sql`
9. `backend/estimate_from_takeoff.sql`
10. `backend/pricing_options.sql`
11. `backend/proposals.sql`
12. `backend/proposal_acceptances.sql`
13. `backend/final_proposals.sql`
14. `backend/company_branding.sql`
15. `backend/company_branding_storage.sql`
16. `backend/roles_permissions.sql`
17. `backend/dashboard_support.sql`
18. `backend/progress_timeline.sql`
19. `backend/scheduling.sql`
20. `backend/scheduling_weather.sql`
21. `backend/notifications_reminders.sql`
22. `backend/consolidated_workflow.sql`
23. `backend/remodel_workflow.sql`
24. `backend/product_backed_design.sql`
25. `backend/wall_ceiling_finishes.sql`
26. `backend/client_approval.sql`
27. `backend/production_backend.sql`
28. `backend/openai_providers.sql`

## Important
Some early migrations depend on helper functions such as `current_company_id()` and `current_user_role()`.
Verify those base helpers exist before applying later migrations.
