create table if not exists public.project_measurements(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  measurement_type text not null default 'roof',
  points jsonb not null default '[]'::jsonb,
  pitch numeric not null default 0,
  waste_percent numeric not null default 0,
  plan_sqft numeric not null default 0,
  roof_sqft numeric not null default 0,
  order_sqft numeric not null default 0,
  squares numeric not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.roof_takeoffs
add column if not exists measurement_id uuid references public.project_measurements(id) on delete set null;

create or replace function public.set_measurement_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin new.company_id:=public.current_company_id(); new.created_by:=auth.uid(); return new; end; $$;

drop trigger if exists trg_measurement_context on public.project_measurements;
create trigger trg_measurement_context before insert on public.project_measurements
for each row execute function public.set_measurement_context();

alter table public.project_measurements enable row level security;

drop policy if exists project_measurements_company on public.project_measurements;
create policy project_measurements_company on public.project_measurements
for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());
