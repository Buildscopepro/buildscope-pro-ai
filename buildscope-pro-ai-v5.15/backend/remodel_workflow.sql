create table if not exists public.remodel_takeoffs(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  measurements jsonb not null default '{}'::jsonb,
  takeoff jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.visualization_requests(
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  space_type text not null,
  source_photo_path text,
  style_notes text,
  status text not null default 'ready_for_ai',
  result_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create or replace function public.set_remodel_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin new.company_id:=public.current_company_id(); new.created_by:=auth.uid(); return new; end; $$;

drop trigger if exists trg_remodel_takeoff_context on public.remodel_takeoffs;
create trigger trg_remodel_takeoff_context before insert on public.remodel_takeoffs
for each row execute function public.set_remodel_context();

drop trigger if exists trg_visualization_request_context on public.visualization_requests;
create trigger trg_visualization_request_context before insert on public.visualization_requests
for each row execute function public.set_remodel_context();

alter table public.remodel_takeoffs enable row level security;
alter table public.visualization_requests enable row level security;

drop policy if exists remodel_takeoffs_company on public.remodel_takeoffs;
create policy remodel_takeoffs_company on public.remodel_takeoffs for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());

drop policy if exists visualization_requests_company on public.visualization_requests;
create policy visualization_requests_company on public.visualization_requests for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());
