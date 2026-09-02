create table if not exists public.design_visualizations(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 space_type text not null,
 source_photo_path text,
 render_path text,
 style_notes text,
 status text not null default 'draft'
   check(status in ('draft','needs_product_resolution','ready_for_client','approved','rejected')),
 approved_at timestamptz,
 approved_by uuid references auth.users(id),
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create table if not exists public.design_products(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 design_id uuid not null references public.design_visualizations(id) on delete cascade,
 product_name text not null,
 brand text,
 model text,
 sku text,
 category text,
 finish text,
 color text,
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

create or replace function public.set_design_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 new.company_id:=public.current_company_id();
 new.created_by:=auth.uid();
 return new;
end; $$;

drop trigger if exists trg_design_visualization_context on public.design_visualizations;
create trigger trg_design_visualization_context before insert on public.design_visualizations
for each row execute function public.set_design_context();

drop trigger if exists trg_design_product_context on public.design_products;
create trigger trg_design_product_context before insert on public.design_products
for each row execute function public.set_design_context();

alter table public.design_visualizations enable row level security;
alter table public.design_products enable row level security;

drop policy if exists design_visualizations_company on public.design_visualizations;
create policy design_visualizations_company on public.design_visualizations
for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());

drop policy if exists design_products_company on public.design_products;
create policy design_products_company on public.design_products
for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());

create or replace function public.approve_product_backed_design(p_design_id uuid)
returns public.design_visualizations
language plpgsql security definer set search_path=public as $$
declare d public.design_visualizations;
begin
 if exists(
   select 1 from public.design_products
   where design_id=p_design_id
   and (
     match_status='pending'
     or product_name is null
     or (match_status='exact' and (brand is null or (model is null and sku is null)))
     or (match_status='exact' and retailer_name is null)
   )
 ) then
   raise exception 'Design has unresolved product specifications';
 end if;

 update public.design_visualizations
 set status='approved',approved_at=now(),approved_by=auth.uid()
 where id=p_design_id and company_id=public.current_company_id()
 returning * into d;

 if d.id is null then raise exception 'Design not found or unauthorized'; end if;
 return d;
end; $$;
