begin;

-- Master schema migration.
-- This file consolidates the original platform schema, notifications/schedules,
-- backend hardening, and finance analytics migrations into a single baseline.

create extension if not exists "pgcrypto";

do $$
begin
  create type public.membership_role as enum ('admin', 'editor', 'viewer', 'approver');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.workbook_status as enum ('draft', 'in_review', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.plan_status as enum ('draft', 'active', 'locked', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.report_status as enum ('draft', 'generated', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.workflow_status as enum ('draft', 'pending_approval', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.approval_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select nullif(
    regexp_replace(
      regexp_replace(lower(trim(coalesce(input, ''))), '[^a-z0-9]+', '-', 'g'),
      '(^-|-$)',
      '',
      'g'
    ),
    ''
  );
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null unique,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  default_organization_id uuid references public.organizations (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.membership_role not null default 'viewer',
  is_default boolean not null default false,
  joined_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

create table if not exists public.workbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid not null references auth.users (id) on delete restrict,
  name text not null check (char_length(trim(name)) >= 2),
  description text not null default '',
  status public.workbook_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.worksheets (
  id uuid primary key default gen_random_uuid(),
  workbook_id uuid not null references public.workbooks (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 1),
  position integer not null check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workbook_id, position),
  unique (workbook_id, name)
);

create table if not exists public.cell_data (
  id uuid primary key default gen_random_uuid(),
  worksheet_id uuid not null references public.worksheets (id) on delete cascade,
  row_index integer not null check (row_index >= 1),
  column_index integer not null check (column_index >= 1),
  raw_value text,
  display_value text,
  formula text,
  value_type text not null default 'text',
  format jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (worksheet_id, row_index, column_index),
  check (
    raw_value is not null
    or display_value is not null
    or formula is not null
  )
);

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  source_type text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid references public.workbooks (id) on delete set null,
  owner_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  status public.plan_status not null default 'draft',
  starts_on date,
  ends_on date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (starts_on is null or ends_on is null or starts_on <= ends_on)
);

create table if not exists public.forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid references public.workbooks (id) on delete set null,
  owner_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  status public.plan_status not null default 'draft',
  horizon_months integer check (horizon_months is null or horizon_months > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid references public.workbooks (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  status public.report_status not null default 'draft',
  definition jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid references public.workbooks (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  status public.workflow_status not null default 'draft',
  current_step text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows (id) on delete cascade,
  approver_id uuid not null references auth.users (id) on delete cascade,
  status public.approval_status not null default 'pending',
  decision_note text,
  decision_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (workflow_id, approver_id)
);

create table if not exists public.versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid not null references public.workbooks (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  label text not null check (char_length(trim(label)) >= 1),
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid references public.workbooks (id) on delete cascade,
  worksheet_id uuid references public.worksheets (id) on delete cascade,
  version_id uuid references public.versions (id) on delete set null,
  row_index integer check (row_index is null or row_index >= 1),
  column_index integer check (column_index is null or column_index >= 1),
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(trim(body)) >= 1),
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  category text not null default 'general',
  description text not null default '',
  workbook_template jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists organizations_created_by_idx
  on public.organizations (created_by);

create index if not exists profiles_default_organization_id_idx
  on public.profiles (default_organization_id);

create index if not exists organization_memberships_user_id_idx
  on public.organization_memberships (user_id);

create index if not exists organization_memberships_organization_role_idx
  on public.organization_memberships (organization_id, role);

create unique index if not exists organization_memberships_default_org_idx
  on public.organization_memberships (user_id)
  where is_default;

create index if not exists workbooks_organization_id_idx
  on public.workbooks (organization_id);

create index if not exists workbooks_created_by_idx
  on public.workbooks (created_by);

create index if not exists worksheets_workbook_id_idx
  on public.worksheets (workbook_id);

create index if not exists cell_data_worksheet_id_idx
  on public.cell_data (worksheet_id);

create index if not exists data_sources_organization_id_idx
  on public.data_sources (organization_id);

create index if not exists budgets_organization_id_idx
  on public.budgets (organization_id);

create index if not exists forecasts_organization_id_idx
  on public.forecasts (organization_id);

create index if not exists reports_organization_id_idx
  on public.reports (organization_id);

create index if not exists workflows_organization_id_idx
  on public.workflows (organization_id);

create index if not exists approvals_workflow_id_idx
  on public.approvals (workflow_id);

create index if not exists versions_workbook_id_idx
  on public.versions (workbook_id);

create index if not exists comments_organization_id_idx
  on public.comments (organization_id);

create index if not exists comments_worksheet_cell_idx
  on public.comments (worksheet_id, row_index, column_index);

create index if not exists templates_organization_id_idx
  on public.templates (organization_id);

create index if not exists audit_logs_organization_id_created_at_idx
  on public.audit_logs (organization_id, created_at desc);

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
  );
$$;

create or replace function public.has_org_role(
  target_organization_id uuid,
  allowed_roles public.membership_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.role = any (allowed_roles)
  );
$$;

create or replace function public.is_workbook_member(target_workbook_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workbooks workbook
    where workbook.id = target_workbook_id
      and public.is_org_member(workbook.organization_id)
  );
$$;

create or replace function public.can_edit_workbook(target_workbook_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workbooks workbook
    where workbook.id = target_workbook_id
      and public.has_org_role(
        workbook.organization_id,
        array['admin', 'editor']::public.membership_role[]
      )
  );
$$;

create or replace function public.is_comment_visible(comment_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_org_member(comment_organization_id);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  candidate_slug text;
  new_organization_id uuid;
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = timezone('utc', now());

  if nullif(trim(new.raw_user_meta_data ->> 'organization_name'), '') is not null then
    base_slug := coalesce(
      public.slugify(new.raw_user_meta_data ->> 'organization_name'),
      'workspace'
    );
    candidate_slug := base_slug;

    if exists (
      select 1
      from public.organizations organization_item
      where organization_item.slug = candidate_slug
    ) then
      candidate_slug := base_slug || '-' || left(replace(new.id::text, '-', ''), 8);
    end if;

    insert into public.organizations (name, slug, created_by)
    values (
      new.raw_user_meta_data ->> 'organization_name',
      candidate_slug,
      new.id
    )
    returning id into new_organization_id;

    insert into public.organization_memberships (
      organization_id,
      user_id,
      role,
      is_default
    )
    values (
      new_organization_id,
      new.id,
      'admin',
      true
    )
    on conflict (organization_id, user_id) do update
    set
      role = 'admin',
      is_default = true,
      updated_at = timezone('utc', now());

    update public.profiles
    set
      default_organization_id = new_organization_id,
      updated_at = timezone('utc', now())
    where id = new.id;

    insert into public.audit_logs (
      organization_id,
      actor_id,
      entity_type,
      entity_id,
      action,
      details
    )
    values (
      new_organization_id,
      new.id,
      'organization_memberships',
      new_organization_id,
      'organization_bootstrapped',
      jsonb_build_object(
        'email', new.email,
        'role', 'admin'
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists organization_memberships_set_updated_at on public.organization_memberships;
create trigger organization_memberships_set_updated_at
before update on public.organization_memberships
for each row execute function public.set_updated_at();

drop trigger if exists workbooks_set_updated_at on public.workbooks;
create trigger workbooks_set_updated_at
before update on public.workbooks
for each row execute function public.set_updated_at();

drop trigger if exists worksheets_set_updated_at on public.worksheets;
create trigger worksheets_set_updated_at
before update on public.worksheets
for each row execute function public.set_updated_at();

drop trigger if exists cell_data_set_updated_at on public.cell_data;
create trigger cell_data_set_updated_at
before update on public.cell_data
for each row execute function public.set_updated_at();

drop trigger if exists data_sources_set_updated_at on public.data_sources;
create trigger data_sources_set_updated_at
before update on public.data_sources
for each row execute function public.set_updated_at();

drop trigger if exists budgets_set_updated_at on public.budgets;
create trigger budgets_set_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();

drop trigger if exists forecasts_set_updated_at on public.forecasts;
create trigger forecasts_set_updated_at
before update on public.forecasts
for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

drop trigger if exists workflows_set_updated_at on public.workflows;
create trigger workflows_set_updated_at
before update on public.workflows
for each row execute function public.set_updated_at();

drop trigger if exists approvals_set_updated_at on public.approvals;
create trigger approvals_set_updated_at
before update on public.approvals
for each row execute function public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name)
select
  existing_user.id,
  coalesce(existing_user.email, ''),
  nullif(trim(existing_user.raw_user_meta_data ->> 'full_name'), '')
from auth.users existing_user
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(excluded.full_name, public.profiles.full_name),
  updated_at = timezone('utc', now());

alter table public.organizations enable row level security;
alter table public.organizations force row level security;

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

alter table public.organization_memberships enable row level security;
alter table public.organization_memberships force row level security;

alter table public.workbooks enable row level security;
alter table public.workbooks force row level security;

alter table public.worksheets enable row level security;
alter table public.worksheets force row level security;

alter table public.cell_data enable row level security;
alter table public.cell_data force row level security;

alter table public.data_sources enable row level security;
alter table public.data_sources force row level security;

alter table public.budgets enable row level security;
alter table public.budgets force row level security;

alter table public.forecasts enable row level security;
alter table public.forecasts force row level security;

alter table public.reports enable row level security;
alter table public.reports force row level security;

alter table public.workflows enable row level security;
alter table public.workflows force row level security;

alter table public.approvals enable row level security;
alter table public.approvals force row level security;

alter table public.versions enable row level security;
alter table public.versions force row level security;

alter table public.comments enable row level security;
alter table public.comments force row level security;

alter table public.templates enable row level security;
alter table public.templates force row level security;

alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
  or exists (
    select 1
    from public.organization_memberships viewer_membership
    join public.organization_memberships target_membership
      on target_membership.organization_id = viewer_membership.organization_id
    where viewer_membership.user_id = (select auth.uid())
      and target_membership.user_id = profiles.id
  )
);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member"
on public.organizations
for select
to authenticated
using ((select public.is_org_member(id)));

drop policy if exists "organizations_insert_owner" on public.organizations;
create policy "organizations_insert_owner"
on public.organizations
for insert
to authenticated
with check ((select auth.uid()) = created_by);

drop policy if exists "organizations_update_admin" on public.organizations;
create policy "organizations_update_admin"
on public.organizations
for update
to authenticated
using ((select public.has_org_role(id, array['admin']::public.membership_role[])))
with check ((select public.has_org_role(id, array['admin']::public.membership_role[])));

drop policy if exists "organization_memberships_select_member" on public.organization_memberships;
create policy "organization_memberships_select_member"
on public.organization_memberships
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select public.has_org_role(
    organization_id,
    array['admin']::public.membership_role[]
  ))
);

drop policy if exists "organization_memberships_manage_admin" on public.organization_memberships;
create policy "organization_memberships_manage_admin"
on public.organization_memberships
for all
to authenticated
using ((select public.has_org_role(organization_id, array['admin']::public.membership_role[])))
with check ((select public.has_org_role(organization_id, array['admin']::public.membership_role[])));

drop policy if exists "workbooks_select_member" on public.workbooks;
create policy "workbooks_select_member"
on public.workbooks
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "workbooks_insert_editor" on public.workbooks;
create policy "workbooks_insert_editor"
on public.workbooks
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and (select public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  ))
);

drop policy if exists "workbooks_update_editor" on public.workbooks;
create policy "workbooks_update_editor"
on public.workbooks
for update
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)));

drop policy if exists "worksheets_select_member" on public.worksheets;
create policy "worksheets_select_member"
on public.worksheets
for select
to authenticated
using ((select public.is_workbook_member(workbook_id)));

drop policy if exists "worksheets_insert_editor" on public.worksheets;
create policy "worksheets_insert_editor"
on public.worksheets
for insert
to authenticated
with check ((select public.can_edit_workbook(workbook_id)));

drop policy if exists "worksheets_update_editor" on public.worksheets;
create policy "worksheets_update_editor"
on public.worksheets
for update
to authenticated
using ((select public.can_edit_workbook(workbook_id)))
with check ((select public.can_edit_workbook(workbook_id)));

drop policy if exists "cell_data_select_member" on public.cell_data;
create policy "cell_data_select_member"
on public.cell_data
for select
to authenticated
using (
  exists (
    select 1
    from public.worksheets worksheet
    where worksheet.id = cell_data.worksheet_id
      and public.is_workbook_member(worksheet.workbook_id)
  )
);

drop policy if exists "cell_data_modify_editor" on public.cell_data;
create policy "cell_data_modify_editor"
on public.cell_data
for all
to authenticated
using (
  exists (
    select 1
    from public.worksheets worksheet
    where worksheet.id = cell_data.worksheet_id
      and public.can_edit_workbook(worksheet.workbook_id)
  )
)
with check (
  exists (
    select 1
    from public.worksheets worksheet
    where worksheet.id = cell_data.worksheet_id
      and public.can_edit_workbook(worksheet.workbook_id)
  )
);

drop policy if exists "org_scoped_select_data_sources" on public.data_sources;
create policy "org_scoped_select_data_sources"
on public.data_sources
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "org_scoped_modify_data_sources" on public.data_sources;
create policy "org_scoped_modify_data_sources"
on public.data_sources
for all
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)));

drop policy if exists "org_scoped_select_budgets" on public.budgets;
create policy "org_scoped_select_budgets"
on public.budgets
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "org_scoped_modify_budgets" on public.budgets;
create policy "org_scoped_modify_budgets"
on public.budgets
for all
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)));

drop policy if exists "org_scoped_select_forecasts" on public.forecasts;
create policy "org_scoped_select_forecasts"
on public.forecasts
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "org_scoped_modify_forecasts" on public.forecasts;
create policy "org_scoped_modify_forecasts"
on public.forecasts
for all
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)));

drop policy if exists "org_scoped_select_reports" on public.reports;
create policy "org_scoped_select_reports"
on public.reports
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "org_scoped_modify_reports" on public.reports;
create policy "org_scoped_modify_reports"
on public.reports
for all
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor', 'approver']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor', 'approver']::public.membership_role[]
)));

drop policy if exists "org_scoped_select_workflows" on public.workflows;
create policy "org_scoped_select_workflows"
on public.workflows
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "org_scoped_modify_workflows" on public.workflows;
create policy "org_scoped_modify_workflows"
on public.workflows
for all
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor', 'approver']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor', 'approver']::public.membership_role[]
)));

drop policy if exists "approvals_select_workflow_member" on public.approvals;
create policy "approvals_select_workflow_member"
on public.approvals
for select
to authenticated
using (
  exists (
    select 1
    from public.workflows workflow
    where workflow.id = approvals.workflow_id
      and public.is_org_member(workflow.organization_id)
  )
);

drop policy if exists "approvals_manage_admin_or_approver" on public.approvals;
create policy "approvals_manage_admin_or_approver"
on public.approvals
for all
to authenticated
using (
  exists (
    select 1
    from public.workflows workflow
    where workflow.id = approvals.workflow_id
      and (
        approvals.approver_id = (select auth.uid())
        or public.has_org_role(
          workflow.organization_id,
          array['admin', 'approver']::public.membership_role[]
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.workflows workflow
    where workflow.id = approvals.workflow_id
      and (
        approvals.approver_id = (select auth.uid())
        or public.has_org_role(
          workflow.organization_id,
          array['admin', 'approver']::public.membership_role[]
        )
      )
  )
);

drop policy if exists "versions_select_member" on public.versions;
create policy "versions_select_member"
on public.versions
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "versions_insert_editor" on public.versions;
create policy "versions_insert_editor"
on public.versions
for insert
to authenticated
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor']::public.membership_role[]
)));

drop policy if exists "comments_select_member" on public.comments;
create policy "comments_select_member"
on public.comments
for select
to authenticated
using ((select public.is_comment_visible(organization_id)));

drop policy if exists "comments_insert_member" on public.comments;
create policy "comments_insert_member"
on public.comments
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (select public.is_org_member(organization_id))
);

drop policy if exists "comments_update_author_or_admin" on public.comments;
create policy "comments_update_author_or_admin"
on public.comments
for update
to authenticated
using (
  author_id = (select auth.uid())
  or (select public.has_org_role(
    organization_id,
    array['admin']::public.membership_role[]
  ))
)
with check (
  author_id = (select auth.uid())
  or (select public.has_org_role(
    organization_id,
    array['admin']::public.membership_role[]
  ))
);

drop policy if exists "templates_select_member_or_global" on public.templates;
create policy "templates_select_member_or_global"
on public.templates
for select
to authenticated
using (
  organization_id is null
  or (select public.is_org_member(organization_id))
);

drop policy if exists "templates_manage_editor" on public.templates;
create policy "templates_manage_editor"
on public.templates
for all
to authenticated
using (
  (
    organization_id is null
    and created_by = (select auth.uid())
  )
  or (
    organization_id is not null
    and (select public.has_org_role(
      organization_id,
      array['admin', 'editor']::public.membership_role[]
    ))
  )
)
with check (
  (
    organization_id is null
    and created_by = (select auth.uid())
  )
  or (
    organization_id is not null
    and (select public.has_org_role(
      organization_id,
      array['admin', 'editor']::public.membership_role[]
    ))
  )
);

drop policy if exists "audit_logs_select_admin" on public.audit_logs;
create policy "audit_logs_select_admin"
on public.audit_logs
for select
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin']::public.membership_role[]
)));

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, public.membership_role[]) to authenticated;
grant execute on function public.is_workbook_member(uuid) to authenticated;
grant execute on function public.can_edit_workbook(uuid) to authenticated;
grant execute on function public.is_comment_visible(uuid) to authenticated;

do $$
begin
  create type public.schedule_status as enum ('draft', 'active', 'paused', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null default 'system',
  title text not null check (char_length(trim(title)) >= 1),
  body text not null default '',
  link text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_id uuid references public.reports (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  cron_expression text not null check (char_length(trim(cron_expression)) >= 5),
  timezone text not null default 'UTC',
  status public.schedule_status not null default 'draft',
  next_run_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_user_created_at_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_unread_idx
  on public.notifications (user_id, read_at)
  where read_at is null;

create index if not exists schedules_org_status_idx
  on public.schedules (organization_id, status);

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
before update on public.notifications
for each row execute function public.set_updated_at();

drop trigger if exists schedules_set_updated_at on public.schedules;
create trigger schedules_set_updated_at
before update on public.schedules
for each row execute function public.set_updated_at();

alter table public.notifications enable row level security;
alter table public.notifications force row level security;

alter table public.schedules enable row level security;
alter table public.schedules force row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
on public.notifications
for select
to authenticated
using (
  user_id = (select auth.uid())
  and (select public.is_org_member(organization_id))
);

drop policy if exists "notifications_insert_org_admins" on public.notifications;
create policy "notifications_insert_org_admins"
on public.notifications
for insert
to authenticated
with check (
  (select public.has_org_role(
    organization_id,
    array['admin', 'editor', 'approver']::public.membership_role[]
  ))
);

drop policy if exists "notifications_update_own_or_admin" on public.notifications;
create policy "notifications_update_own_or_admin"
on public.notifications
for update
to authenticated
using (
  user_id = (select auth.uid())
  or (select public.has_org_role(
    organization_id,
    array['admin']::public.membership_role[]
  ))
)
with check (
  user_id = (select auth.uid())
  or (select public.has_org_role(
    organization_id,
    array['admin']::public.membership_role[]
  ))
);

drop policy if exists "schedules_select_member" on public.schedules;
create policy "schedules_select_member"
on public.schedules
for select
to authenticated
using ((select public.is_org_member(organization_id)));

drop policy if exists "schedules_modify_editor" on public.schedules;
create policy "schedules_modify_editor"
on public.schedules
for all
to authenticated
using ((select public.has_org_role(
  organization_id,
  array['admin', 'editor', 'approver']::public.membership_role[]
)))
with check ((select public.has_org_role(
  organization_id,
  array['admin', 'editor', 'approver']::public.membership_role[]
)));

drop policy if exists "organization_memberships_seed_creator" on public.organization_memberships;
create policy "organization_memberships_seed_creator"
on public.organization_memberships
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.organizations organization_item
    where organization_item.id = organization_id
      and organization_item.created_by = (select auth.uid())
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.slugify(input text)
returns text
language sql
immutable
set search_path = public
as $$
  select nullif(
    regexp_replace(
      regexp_replace(lower(trim(coalesce(input, ''))), '[^a-z0-9]+', '-', 'g'),
      '(^-|-$)',
      '',
      'g'
    ),
    ''
  );
$$;

create index if not exists approvals_approver_id_idx
  on public.approvals (approver_id);

create index if not exists audit_logs_actor_id_idx
  on public.audit_logs (actor_id);

create index if not exists budgets_workbook_owner_idx
  on public.budgets (workbook_id, owner_id);

create index if not exists cell_data_updated_by_idx
  on public.cell_data (updated_by);

create index if not exists comments_workbook_version_author_idx
  on public.comments (workbook_id, version_id, author_id);

create index if not exists data_sources_created_by_idx
  on public.data_sources (created_by);

create index if not exists forecasts_workbook_owner_idx
  on public.forecasts (workbook_id, owner_id);

create index if not exists notifications_organization_id_idx
  on public.notifications (organization_id);

create index if not exists reports_workbook_created_by_idx
  on public.reports (workbook_id, created_by);

create index if not exists schedules_report_created_by_idx
  on public.schedules (report_id, created_by);

create index if not exists templates_created_by_idx
  on public.templates (created_by);

create index if not exists versions_organization_created_by_idx
  on public.versions (organization_id, created_by);

create index if not exists workflows_workbook_created_by_idx
  on public.workflows (workbook_id, created_by);

create index if not exists worksheets_created_by_idx
  on public.worksheets (created_by);

drop policy if exists "audit_logs_insert_member" on public.audit_logs;
create policy "audit_logs_insert_member"
on public.audit_logs
for insert
to authenticated
with check (
  actor_id = (select auth.uid())
  and (select public.is_org_member(organization_id))
);

create table if not exists public.currencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  code text not null check (code = upper(trim(code)) and char_length(trim(code)) between 3 and 8),
  name text not null check (char_length(trim(name)) >= 2),
  symbol text not null default '',
  decimal_places smallint not null default 2 check (decimal_places between 0 and 6),
  is_base boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, code)
);

create unique index if not exists currencies_single_base_idx
  on public.currencies (organization_id)
  where is_base;

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  base_currency_id uuid not null references public.currencies (id) on delete cascade,
  quote_currency_id uuid not null references public.currencies (id) on delete cascade,
  rate numeric(18, 6) not null check (rate > 0),
  source text not null default 'manual',
  effective_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, base_currency_id, quote_currency_id, effective_at),
  check (base_currency_id <> quote_currency_id)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  code text not null check (char_length(trim(code)) >= 2),
  name text not null check (char_length(trim(name)) >= 2),
  category text not null check (char_length(trim(category)) >= 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, code)
);

create table if not exists public.cost_centers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  owner_id uuid references auth.users (id) on delete set null,
  code text not null check (char_length(trim(code)) >= 2),
  name text not null check (char_length(trim(name)) >= 2),
  region text not null default 'Global',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, code)
);

create table if not exists public.dimensions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  key text not null check (char_length(trim(key)) >= 2),
  name text not null check (char_length(trim(name)) >= 2),
  value_options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, key)
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workbook_id uuid references public.workbooks (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null check (char_length(trim(slug)) >= 2),
  unit text not null default 'number',
  actual_value numeric(18, 2),
  target_value numeric(18, 2),
  change_pct numeric(8, 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, slug)
);

create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_id uuid references public.forecasts (id) on delete set null,
  workbook_id uuid references public.workbooks (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  status public.plan_status not null default 'draft',
  driver_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.variances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  budget_id uuid references public.budgets (id) on delete set null,
  forecast_id uuid references public.forecasts (id) on delete set null,
  account_id uuid references public.accounts (id) on delete set null,
  cost_center_id uuid references public.cost_centers (id) on delete set null,
  metric_id uuid references public.metrics (id) on delete set null,
  name text not null check (char_length(trim(name)) >= 2),
  period_label text not null check (char_length(trim(period_label)) >= 2),
  plan_value numeric(18, 2) not null default 0,
  actual_value numeric(18, 2) not null default 0,
  variance_value numeric(18, 2) not null default 0,
  variance_percent numeric(8, 2),
  status text not null default 'neutral' check (status in ('favorable', 'unfavorable', 'neutral')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists currencies_organization_id_idx
  on public.currencies (organization_id);

create index if not exists exchange_rates_organization_effective_idx
  on public.exchange_rates (organization_id, effective_at desc);

create index if not exists exchange_rates_base_quote_idx
  on public.exchange_rates (base_currency_id, quote_currency_id);

create index if not exists accounts_organization_id_idx
  on public.accounts (organization_id);

create index if not exists cost_centers_organization_id_idx
  on public.cost_centers (organization_id);

create index if not exists dimensions_organization_id_idx
  on public.dimensions (organization_id);

create index if not exists metrics_organization_id_idx
  on public.metrics (organization_id);

create index if not exists scenarios_organization_id_idx
  on public.scenarios (organization_id);

create index if not exists scenarios_forecast_id_idx
  on public.scenarios (forecast_id);

create index if not exists variances_organization_id_idx
  on public.variances (organization_id);

create index if not exists variances_metric_id_idx
  on public.variances (metric_id);

drop trigger if exists currencies_set_updated_at on public.currencies;
create trigger currencies_set_updated_at
before update on public.currencies
for each row execute function public.set_updated_at();

drop trigger if exists exchange_rates_set_updated_at on public.exchange_rates;
create trigger exchange_rates_set_updated_at
before update on public.exchange_rates
for each row execute function public.set_updated_at();

drop trigger if exists accounts_set_updated_at on public.accounts;
create trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

drop trigger if exists cost_centers_set_updated_at on public.cost_centers;
create trigger cost_centers_set_updated_at
before update on public.cost_centers
for each row execute function public.set_updated_at();

drop trigger if exists dimensions_set_updated_at on public.dimensions;
create trigger dimensions_set_updated_at
before update on public.dimensions
for each row execute function public.set_updated_at();

drop trigger if exists metrics_set_updated_at on public.metrics;
create trigger metrics_set_updated_at
before update on public.metrics
for each row execute function public.set_updated_at();

drop trigger if exists scenarios_set_updated_at on public.scenarios;
create trigger scenarios_set_updated_at
before update on public.scenarios
for each row execute function public.set_updated_at();

drop trigger if exists variances_set_updated_at on public.variances;
create trigger variances_set_updated_at
before update on public.variances
for each row execute function public.set_updated_at();

alter table public.currencies enable row level security;
alter table public.currencies force row level security;

alter table public.exchange_rates enable row level security;
alter table public.exchange_rates force row level security;

alter table public.accounts enable row level security;
alter table public.accounts force row level security;

alter table public.cost_centers enable row level security;
alter table public.cost_centers force row level security;

alter table public.dimensions enable row level security;
alter table public.dimensions force row level security;

alter table public.metrics enable row level security;
alter table public.metrics force row level security;

alter table public.scenarios enable row level security;
alter table public.scenarios force row level security;

alter table public.variances enable row level security;
alter table public.variances force row level security;

drop policy if exists "currencies_select" on public.currencies;
create policy "currencies_select" on public.currencies
for select using (public.is_org_member(organization_id));

drop policy if exists "currencies_modify" on public.currencies;
create policy "currencies_modify" on public.currencies
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "exchange_rates_select" on public.exchange_rates;
create policy "exchange_rates_select" on public.exchange_rates
for select using (public.is_org_member(organization_id));

drop policy if exists "exchange_rates_modify" on public.exchange_rates;
create policy "exchange_rates_modify" on public.exchange_rates
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "accounts_select" on public.accounts;
create policy "accounts_select" on public.accounts
for select using (public.is_org_member(organization_id));

drop policy if exists "accounts_modify" on public.accounts;
create policy "accounts_modify" on public.accounts
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "cost_centers_select" on public.cost_centers;
create policy "cost_centers_select" on public.cost_centers
for select using (public.is_org_member(organization_id));

drop policy if exists "cost_centers_modify" on public.cost_centers;
create policy "cost_centers_modify" on public.cost_centers
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "dimensions_select" on public.dimensions;
create policy "dimensions_select" on public.dimensions
for select using (public.is_org_member(organization_id));

drop policy if exists "dimensions_modify" on public.dimensions;
create policy "dimensions_modify" on public.dimensions
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "metrics_select" on public.metrics;
create policy "metrics_select" on public.metrics
for select using (public.is_org_member(organization_id));

drop policy if exists "metrics_modify" on public.metrics;
create policy "metrics_modify" on public.metrics
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "scenarios_select" on public.scenarios;
create policy "scenarios_select" on public.scenarios
for select using (public.is_org_member(organization_id));

drop policy if exists "scenarios_modify" on public.scenarios;
create policy "scenarios_modify" on public.scenarios
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

drop policy if exists "variances_select" on public.variances;
create policy "variances_select" on public.variances
for select using (public.is_org_member(organization_id));

drop policy if exists "variances_modify" on public.variances;
create policy "variances_modify" on public.variances
for all using (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
)
with check (
  public.has_org_role(
    organization_id,
    array['admin', 'editor']::public.membership_role[]
  )
);

commit;
