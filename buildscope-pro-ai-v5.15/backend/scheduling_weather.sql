alter table public.projects
add column if not exists latitude numeric,
add column if not exists longitude numeric;

create table if not exists public.schedule_alerts(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid references public.projects(id) on delete cascade,
 alert_type text not null check(alert_type in ('crew_conflict','weather_risk')),
 message text not null,
 severity text not null default 'warning',
 resolved boolean not null default false,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create or replace function public.set_schedule_alert_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin new.company_id:=public.current_company_id(); new.created_by:=auth.uid(); return new; end; $$;

drop trigger if exists trg_schedule_alert_context on public.schedule_alerts;
create trigger trg_schedule_alert_context before insert on public.schedule_alerts
for each row execute function public.set_schedule_alert_context();

alter table public.schedule_alerts enable row level security;

drop policy if exists schedule_alerts_company on public.schedule_alerts;
create policy schedule_alerts_company on public.schedule_alerts
for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());
