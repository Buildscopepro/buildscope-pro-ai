create table if not exists public.notification_devices(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 push_token text not null,
 device text,
 enabled boolean not null default true,
 last_seen_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique(user_id,push_token)
);

create table if not exists public.job_reminders(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid references public.projects(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,
 audience text not null default 'crew' check(audience in ('crew','client','sales','admin')),
 title text not null,
 message text not null,
 remind_at timestamptz not null,
 status text not null default 'scheduled' check(status in ('scheduled','sent','cancelled')),
 sent_at timestamptz,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create or replace function public.set_notification_context()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 new.company_id:=public.current_company_id();
 if TG_TABLE_NAME='job_reminders' then new.created_by:=auth.uid(); end if;
 return new;
end; $$;

drop trigger if exists trg_notification_devices_context on public.notification_devices;
create trigger trg_notification_devices_context before insert on public.notification_devices
for each row execute function public.set_notification_context();

drop trigger if exists trg_job_reminders_context on public.job_reminders;
create trigger trg_job_reminders_context before insert on public.job_reminders
for each row execute function public.set_notification_context();

alter table public.notification_devices enable row level security;
alter table public.job_reminders enable row level security;

drop policy if exists notification_devices_own on public.notification_devices;
create policy notification_devices_own on public.notification_devices
for all to authenticated
using(company_id=public.current_company_id() and user_id=auth.uid())
with check(company_id=public.current_company_id() and user_id=auth.uid());

drop policy if exists job_reminders_company on public.job_reminders;
create policy job_reminders_company on public.job_reminders
for select to authenticated
using(company_id=public.current_company_id());

drop policy if exists job_reminders_manage on public.job_reminders;
create policy job_reminders_manage on public.job_reminders
for all to authenticated
using(company_id=public.current_company_id() and public.current_user_role() in ('Admin','Salesperson'))
with check(company_id=public.current_company_id() and public.current_user_role() in ('Admin','Salesperson'));
