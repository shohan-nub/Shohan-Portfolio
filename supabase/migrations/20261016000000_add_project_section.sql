-- Classify existing and future portfolio projects without deleting records.
-- Existing rows are assigned to web_app so they remain visible in the Website / Web App showcase.
alter table public.projects
  add column if not exists project_section text;

update public.projects
set project_section = 'web_app'
where project_section is null;

alter table public.projects
  alter column project_section set default 'web_app',
  alter column project_section set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_project_section_check'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_project_section_check
      check (project_section in ('web_app', 'web_design'));
  end if;
end;
$$;
