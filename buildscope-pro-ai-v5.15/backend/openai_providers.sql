insert into storage.buckets(id,name,public)
values('design-renders','design-renders',false)
on conflict(id) do update set public=false;

drop policy if exists design_renders_company_read on storage.objects;
create policy design_renders_company_read on storage.objects
for select to authenticated
using(
  bucket_id='design-renders'
  and exists(
    select 1 from public.projects p
    where p.id::text=(storage.foldername(name))[1]
    and p.company_id=public.current_company_id()
  )
);
