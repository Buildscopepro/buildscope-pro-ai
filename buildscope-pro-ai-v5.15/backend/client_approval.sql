create table if not exists public.client_design_approvals(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 design_id uuid references public.design_visualizations(id) on delete set null,
 decision text not null check(decision in ('approved','changes_requested','rejected')),
 client_name text not null,
 client_notes text,
 finish_snapshot jsonb not null default '{}'::jsonb,
 approved_at timestamptz,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create or replace function public.set_client_approval_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 new.company_id:=public.current_company_id();
 new.created_by:=auth.uid();
 if new.decision='approved' then new.approved_at:=now(); end if;
 return new;
end; $$;

drop trigger if exists trg_client_approval_context on public.client_design_approvals;
create trigger trg_client_approval_context before insert on public.client_design_approvals
for each row execute function public.set_client_approval_context();

alter table public.client_design_approvals enable row level security;

drop policy if exists client_design_approvals_company_read on public.client_design_approvals;
create policy client_design_approvals_company_read on public.client_design_approvals
for select to authenticated using(company_id=public.current_company_id());

drop policy if exists client_design_approvals_company_insert on public.client_design_approvals;
create policy client_design_approvals_company_insert on public.client_design_approvals
for insert to authenticated with check(company_id=public.current_company_id());
