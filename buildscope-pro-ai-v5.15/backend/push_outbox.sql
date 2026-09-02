create table if not exists public.push_outbox(
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 project_id uuid references public.projects(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,
 push_token text not null,
 title text not null,
 message text not null,
 audience text not null default 'crew',
 status text not null default 'queued'
   check(status in ('queued','sent','failed','cancelled')),
 provider_message_id text,
 error_message text,
 created_at timestamptz not null default now(),
 sent_at timestamptz
);

alter table public.push_outbox enable row level security;

drop policy if exists push_outbox_company_read on public.push_outbox;
create policy push_outbox_company_read on public.push_outbox
for select to authenticated
using(company_id=public.current_company_id());
