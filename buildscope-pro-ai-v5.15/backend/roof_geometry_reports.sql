create table if not exists public.roof_geometry_reports(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 provider text not null,
 provider_report_id text,
 roof_area_sqft numeric,
 squares numeric,
 ridge_lf numeric,
 eave_lf numeric,
 rake_lf numeric,
 valley_lf numeric,
 hip_lf numeric,
 flashing_lf numeric,
 facets jsonb not null default '[]'::jsonb,
 confidence text,
 complete_linear_geometry boolean not null default false,
 source_document_url text,
 raw_summary jsonb not null default '{}'::jsonb,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

alter table public.roof_geometry_reports enable row level security;

drop policy if exists roof_geometry_reports_company on public.roof_geometry_reports;
create policy roof_geometry_reports_company on public.roof_geometry_reports
for select to authenticated
using(company_id=public.current_company_id());
