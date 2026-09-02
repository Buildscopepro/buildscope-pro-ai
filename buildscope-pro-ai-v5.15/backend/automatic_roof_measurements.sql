create table if not exists public.automatic_roof_measurements(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 provider text not null,
 latitude numeric not null,
 longitude numeric not null,
 imagery_quality text,
 imagery_date jsonb,
 roof_area_sqft numeric not null default 0,
 squares numeric not null default 0,
 segment_count integer not null default 0,
 segments jsonb not null default '[]'::jsonb,
 provider_response_summary jsonb not null default '{}'::jsonb,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

alter table public.automatic_roof_measurements enable row level security;

drop policy if exists automatic_roof_measurements_company on public.automatic_roof_measurements;
create policy automatic_roof_measurements_company on public.automatic_roof_measurements
for select to authenticated
using(company_id=public.current_company_id());
