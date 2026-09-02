create table if not exists public.service_requests(
 id uuid primary key default gen_random_uuid(),
 company_id uuid references public.companies(id) on delete cascade,
 client_name text not null,
 phone text,
 email text,
 address text not null,
 service_type text not null,
 description text,
 preferred_contact text not null default 'phone',
 status text not null default 'new'
   check(status in ('new','contacted','scheduled','converted','closed')),
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create table if not exists public.payment_requests(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid not null references public.projects(id) on delete cascade,
 proposal_id uuid references public.proposals(id) on delete set null,
 amount numeric not null check(amount>=0),
 description text,
 status text not null default 'pending'
   check(status in ('pending','paid','cancelled','failed')),
 external_payment_id text,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 paid_at timestamptz
);

create or replace function public.set_payment_request_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 new.company_id:=public.current_company_id();
 new.created_by:=auth.uid();
 return new;
end; $$;

drop trigger if exists trg_payment_request_context on public.payment_requests;
create trigger trg_payment_request_context before insert on public.payment_requests
for each row execute function public.set_payment_request_context();

alter table public.service_requests enable row level security;
alter table public.payment_requests enable row level security;

drop policy if exists service_requests_company_read on public.service_requests;
create policy service_requests_company_read on public.service_requests
for select to authenticated
using(company_id=public.current_company_id());

drop policy if exists service_requests_public_insert on public.service_requests;
create policy service_requests_public_insert on public.service_requests
for insert to anon,authenticated
with check(company_id is null or company_id=public.current_company_id());

drop policy if exists payment_requests_company on public.payment_requests;
create policy payment_requests_company on public.payment_requests
for all to authenticated
using(company_id=public.current_company_id())
with check(company_id=public.current_company_id());
