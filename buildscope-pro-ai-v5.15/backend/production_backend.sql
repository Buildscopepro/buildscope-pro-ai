create table if not exists public.ai_generation_audit(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 provider text not null,
 request_summary jsonb not null default '{}'::jsonb,
 result_summary jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);

create table if not exists public.purchase_lists(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 design_id text,
 status text not null default 'draft' check(status in ('draft','approved','ordered','cancelled')),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);

create table if not exists public.purchase_list_items(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 purchase_list_id uuid not null references public.purchase_lists(id) on delete cascade,
 product_id text not null,
 product_name text not null,
 quantity numeric not null default 0,
 unit text,
 price numeric,
 retailer_name text,
 retailer_url text,
 created_at timestamptz not null default now()
);

alter table public.ai_generation_audit enable row level security;
alter table public.purchase_lists enable row level security;
alter table public.purchase_list_items enable row level security;

drop policy if exists ai_generation_audit_company on public.ai_generation_audit;
create policy ai_generation_audit_company on public.ai_generation_audit
for select to authenticated
using(company_id=public.current_company_id());

drop policy if exists purchase_lists_company on public.purchase_lists;
create policy purchase_lists_company on public.purchase_lists
for select to authenticated
using(company_id=public.current_company_id());

drop policy if exists purchase_list_items_company on public.purchase_list_items;
create policy purchase_list_items_company on public.purchase_list_items
for select to authenticated
using(company_id=public.current_company_id());
