create table if not exists public.finish_schedules(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 design_id uuid references public.design_visualizations(id) on delete set null,
 room_name text not null,
 surface text not null check(surface in ('wall','ceiling')),
 finish_type text not null,
 product_name text not null,
 brand text,
 model text,
 sku text,
 color text,
 finish text,
 size text,
 quantity numeric not null default 0,
 unit text,
 retailer_name text,
 retailer_url text,
 price numeric not null default 0,
 availability text not null default 'unknown',
 match_status text not null default 'pending'
   check(match_status in ('exact','equivalent','pending')),
 verified_at timestamptz,
 notes text,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create or replace function public.set_finish_schedule_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 new.company_id:=public.current_company_id();
 new.created_by:=auth.uid();
 return new;
end; $$;

drop trigger if exists trg_finish_schedule_context on public.finish_schedules;
create trigger trg_finish_schedule_context before insert on public.finish_schedules
for each row execute function public.set_finish_schedule_context();

alter table public.finish_schedules enable row level security;

drop policy if exists finish_schedules_company on public.finish_schedules;
create policy finish_schedules_company on public.finish_schedules
for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());

create or replace function public.design_finish_schedule_ready(p_design_id uuid)
returns boolean
language sql security definer set search_path=public as $$
 select not exists(
   select 1 from public.finish_schedules
   where design_id=p_design_id
   and (
     match_status='pending'
     or product_name is null
     or (match_status='exact' and (brand is null or (model is null and sku is null)))
     or (match_status='exact' and retailer_name is null)
   )
 );
$$;
