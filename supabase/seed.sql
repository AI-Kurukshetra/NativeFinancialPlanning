begin;

-- Seed auth users for realistic product demos.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    null,
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001',
    'authenticated',
    'authenticated',
    'emily.parker@northwindfinance.com',
    crypt('Northwind#2026', gen_salt('bf')),
    timezone('utc', now()),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001',
      'email', 'emily.parker@northwindfinance.com',
      'full_name', 'Emily Parker',
      'email_verified', true,
      'phone_verified', false
    ),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    null,
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
    'authenticated',
    'authenticated',
    'michael.reed@northwindfinance.com',
    crypt('Northwind#2026', gen_salt('bf')),
    timezone('utc', now()),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
      'email', 'michael.reed@northwindfinance.com',
      'full_name', 'Michael Reed',
      'email_verified', true,
      'phone_verified', false
    ),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    null,
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003',
    'authenticated',
    'authenticated',
    'olivia.bennett@northwindfinance.com',
    crypt('Northwind#2026', gen_salt('bf')),
    timezone('utc', now()),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003',
      'email', 'olivia.bennett@northwindfinance.com',
      'full_name', 'Olivia Bennett',
      'email_verified', true,
      'phone_verified', false
    ),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    null,
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004',
    'authenticated',
    'authenticated',
    'daniel.brooks@northwindfinance.com',
    crypt('Northwind#2026', gen_salt('bf')),
    timezone('utc', now()),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004',
      'email', 'daniel.brooks@northwindfinance.com',
      'full_name', 'Daniel Brooks',
      'email_verified', true,
      'phone_verified', false
    ),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    null,
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005',
    'authenticated',
    'authenticated',
    'sophie.turner@northwindfinance.com',
    crypt('Northwind#2026', gen_salt('bf')),
    timezone('utc', now()),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005',
      'email', 'sophie.turner@northwindfinance.com',
      'full_name', 'Sophie Turner',
      'email_verified', true,
      'phone_verified', false
    ),
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '92c01a37-44af-4b82-9f8c-4e2d2fb86651',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001',
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001',
      'email', 'emily.parker@northwindfinance.com',
      'full_name', 'Emily Parker',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '92c01a37-44af-4b82-9f8c-4e2d2fb86652',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
      'email', 'michael.reed@northwindfinance.com',
      'full_name', 'Michael Reed',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '92c01a37-44af-4b82-9f8c-4e2d2fb86653',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003',
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003',
      'email', 'olivia.bennett@northwindfinance.com',
      'full_name', 'Olivia Bennett',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '92c01a37-44af-4b82-9f8c-4e2d2fb86654',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004',
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004',
      'email', 'daniel.brooks@northwindfinance.com',
      'full_name', 'Daniel Brooks',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '92c01a37-44af-4b82-9f8c-4e2d2fb86655',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005',
    jsonb_build_object(
      'sub', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005',
      'email', 'sophie.turner@northwindfinance.com',
      'full_name', 'Sophie Turner',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005',
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

insert into public.organizations (
  id,
  name,
  slug,
  created_by,
  created_at,
  updated_at
)
values
  ('6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'Northwind Services Group', 'northwind-services-group', '3ca312cb-319a-46df-b5cd-8ffeea774839', timezone('utc', now()) - interval '30 days', timezone('utc', now()) - interval '1 day'),
  ('6a601d44-72db-4c3b-a557-8a16f2a37b70', 'Northwind Strategy Office', 'northwind-strategy-office', '3ca312cb-319a-46df-b5cd-8ffeea774839', timezone('utc', now()) - interval '19 days', timezone('utc', now()) - interval '12 hours')
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  updated_at = excluded.updated_at;

insert into public.profiles (id, email, full_name, default_organization_id)
values
  ('3ca312cb-319a-46df-b5cd-8ffeea774839', 'john.carter@northwindfinance.com', 'John Carter', '6a601d44-72db-4c3b-a557-8a16f2a37b6b'),
  ('c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'emily.parker@northwindfinance.com', 'Emily Parker', '6a601d44-72db-4c3b-a557-8a16f2a37b6b'),
  ('c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'michael.reed@northwindfinance.com', 'Michael Reed', '6a601d44-72db-4c3b-a557-8a16f2a37b6b'),
  ('c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'olivia.bennett@northwindfinance.com', 'Olivia Bennett', '6a601d44-72db-4c3b-a557-8a16f2a37b6b'),
  ('c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004', 'daniel.brooks@northwindfinance.com', 'Daniel Brooks', '6a601d44-72db-4c3b-a557-8a16f2a37b6b'),
  ('c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'sophie.turner@northwindfinance.com', 'Sophie Turner', '6a601d44-72db-4c3b-a557-8a16f2a37b6b')
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  default_organization_id = excluded.default_organization_id,
  updated_at = timezone('utc', now());

insert into public.organization_memberships (
  id,
  organization_id,
  user_id,
  role,
  is_default,
  joined_at
)
values
  ('f1000000-0000-4000-8000-000000000001', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'admin', true, timezone('utc', now()) - interval '30 days'),
  ('f1000000-0000-4000-8000-000000000002', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'editor', true, timezone('utc', now()) - interval '28 days'),
  ('f1000000-0000-4000-8000-000000000003', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'editor', true, timezone('utc', now()) - interval '25 days'),
  ('f1000000-0000-4000-8000-000000000004', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'approver', true, timezone('utc', now()) - interval '22 days'),
  ('f1000000-0000-4000-8000-000000000005', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004', 'viewer', true, timezone('utc', now()) - interval '20 days'),
  ('f1000000-0000-4000-8000-000000000006', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'editor', true, timezone('utc', now()) - interval '18 days'),
  ('f1000000-0000-4000-8000-000000000007', '6a601d44-72db-4c3b-a557-8a16f2a37b70', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'admin', false, timezone('utc', now()) - interval '19 days'),
  ('f1000000-0000-4000-8000-000000000008', '6a601d44-72db-4c3b-a557-8a16f2a37b70', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'editor', false, timezone('utc', now()) - interval '18 days'),
  ('f1000000-0000-4000-8000-000000000009', '6a601d44-72db-4c3b-a557-8a16f2a37b70', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'approver', false, timezone('utc', now()) - interval '17 days')
on conflict (organization_id, user_id) do update
set
  role = excluded.role,
  is_default = excluded.is_default,
  updated_at = timezone('utc', now());

insert into public.workbooks (
  id,
  organization_id,
  created_by,
  name,
  description,
  status,
  created_at,
  updated_at
)
values
  ('11111111-aaaa-4a1a-8a1a-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'FY27 Corporate Operating Plan', 'Company-wide revenue, margin, and operating expense planning model.', 'published', timezone('utc', now()) - interval '12 days', timezone('utc', now()) - interval '2 hours'),
  ('22222222-bbbb-4b2b-8b2b-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'Workforce Capacity Plan', 'Hiring pace, team capacity, and compensation planning workbook.', 'in_review', timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '6 hours'),
  ('33333333-cccc-4c3c-8c3c-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Client Revenue Forecast', 'Opportunity-backed revenue outlook with scenario assumptions.', 'draft', timezone('utc', now()) - interval '8 days', timezone('utc', now()) - interval '1 day'),
  ('44444444-dddd-4d4d-8d4d-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Board Reporting Source Model', 'Board reporting source data and KPI staging workbook.', 'published', timezone('utc', now()) - interval '15 days', timezone('utc', now()) - interval '4 hours')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.worksheets (
  id,
  workbook_id,
  created_by,
  name,
  position,
  created_at,
  updated_at
)
values
  ('11111111-aaaa-4a1a-8a1a-111111110001', '11111111-aaaa-4a1a-8a1a-111111111111', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Summary', 0, timezone('utc', now()) - interval '12 days', timezone('utc', now()) - interval '2 hours'),
  ('11111111-aaaa-4a1a-8a1a-111111110002', '11111111-aaaa-4a1a-8a1a-111111111111', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Departments', 1, timezone('utc', now()) - interval '12 days', timezone('utc', now()) - interval '3 hours'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', '22222222-bbbb-4b2b-8b2b-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'Roles', 0, timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '6 hours'),
  ('22222222-bbbb-4b2b-8b2b-222222220002', '22222222-bbbb-4b2b-8b2b-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'Hiring Plan', 1, timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '8 hours'),
  ('33333333-cccc-4c3c-8c3c-333333330001', '33333333-cccc-4c3c-8c3c-333333333333', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Pipeline', 0, timezone('utc', now()) - interval '8 days', timezone('utc', now()) - interval '1 day'),
  ('33333333-cccc-4c3c-8c3c-333333330002', '33333333-cccc-4c3c-8c3c-333333333333', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Assumptions', 1, timezone('utc', now()) - interval '8 days', timezone('utc', now()) - interval '1 day'),
  ('44444444-dddd-4d4d-8d4d-444444440001', '44444444-dddd-4d4d-8d4d-444444444444', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Executive KPIs', 0, timezone('utc', now()) - interval '15 days', timezone('utc', now()) - interval '4 hours')
on conflict (id) do update
set
  name = excluded.name,
  position = excluded.position,
  updated_at = excluded.updated_at;

insert into public.cell_data (
  worksheet_id,
  row_index,
  column_index,
  raw_value,
  display_value,
  formula,
  value_type,
  format,
  metadata,
  updated_by
)
values
  ('11111111-aaaa-4a1a-8a1a-111111110001', 1, 1, 'Metric', 'Metric', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 1, 2, 'Q1', 'Q1', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 1, 3, 'Q2', 'Q2', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 1, 4, 'Q3', 'Q3', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 1, 5, 'Q4', 'Q4', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 2, 1, 'Revenue', 'Revenue', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 2, 2, '1200000', '1200000', null, 'number', '{"currency":"USD"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 2, 3, '1280000', '1280000', null, 'number', '{"currency":"USD"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 2, 4, '1340000', '1340000', null, 'number', '{"currency":"USD"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 2, 5, '1420000', '1420000', null, 'number', '{"currency":"USD"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 3, 1, 'Gross Margin %', 'Gross Margin %', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 3, 2, '0.38', '0.38', null, 'number', '{"format":"percent"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 3, 3, '0.39', '0.39', null, 'number', '{"format":"percent"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 3, 4, '0.40', '0.40', null, 'number', '{"format":"percent"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 3, 5, '0.41', '0.41', null, 'number', '{"format":"percent"}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 4, 1, 'Annual Revenue', 'Annual Revenue', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('11111111-aaaa-4a1a-8a1a-111111110001', 4, 2, '=SUM(B2:E2)', null, '=SUM(B2:E2)', 'formula', '{}'::jsonb, '{"seeded":true}'::jsonb, '3ca312cb-319a-46df-b5cd-8ffeea774839'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', 1, 1, 'Role', 'Role', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', 1, 2, 'Headcount', 'Headcount', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', 1, 3, 'Cost / Month', 'Cost / Month', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', 2, 1, 'Engineering', 'Engineering', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', 2, 2, '64', '64', null, 'number', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220001', 2, 3, '8700', '8700', null, 'number', '{"currency":"USD"}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220002', 1, 1, 'Month', 'Month', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220002', 1, 2, 'Planned Hires', 'Planned Hires', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220002', 2, 1, 'April', 'April', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('22222222-bbbb-4b2b-8b2b-222222220002', 2, 2, '6', '6', null, 'number', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001'),
  ('33333333-cccc-4c3c-8c3c-333333330001', 1, 1, 'Stage', 'Stage', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002'),
  ('33333333-cccc-4c3c-8c3c-333333330001', 1, 2, 'Pipeline Value', 'Pipeline Value', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002'),
  ('33333333-cccc-4c3c-8c3c-333333330001', 2, 1, 'Committed', 'Committed', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002'),
  ('33333333-cccc-4c3c-8c3c-333333330001', 2, 2, '860000', '860000', null, 'number', '{"currency":"USD"}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002'),
  ('33333333-cccc-4c3c-8c3c-333333330002', 1, 1, 'Close Rate', 'Close Rate', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002'),
  ('33333333-cccc-4c3c-8c3c-333333330002', 1, 2, '0.32', '0.32', null, 'number', '{"format":"percent"}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002'),
  ('44444444-dddd-4d4d-8d4d-444444440001', 1, 1, 'KPI', 'KPI', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005'),
  ('44444444-dddd-4d4d-8d4d-444444440001', 1, 2, 'Value', 'Value', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005'),
  ('44444444-dddd-4d4d-8d4d-444444440001', 2, 1, 'EBITDA Margin', 'EBITDA Margin', null, 'text', '{}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005'),
  ('44444444-dddd-4d4d-8d4d-444444440001', 2, 2, '0.22', '0.22', null, 'number', '{"format":"percent"}'::jsonb, '{"seeded":true}'::jsonb, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005')
on conflict (worksheet_id, row_index, column_index) do update
set
  raw_value = excluded.raw_value,
  display_value = excluded.display_value,
  formula = excluded.formula,
  value_type = excluded.value_type,
  format = excluded.format,
  metadata = excluded.metadata,
  updated_by = excluded.updated_by,
  updated_at = timezone('utc', now());

insert into public.budgets (
  id,
  organization_id,
  workbook_id,
  owner_id,
  name,
  status,
  starts_on,
  ends_on,
  created_at,
  updated_at
)
values
  ('55555555-aaaa-4555-8555-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'FY27 Company Budget', 'active', current_date - 45, current_date + 320, timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '5 hours'),
  ('55555555-aaaa-4555-8555-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '22222222-bbbb-4b2b-8b2b-222222222222', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Delivery Capacity Budget', 'draft', current_date - 10, current_date + 180, timezone('utc', now()) - interval '8 days', timezone('utc', now()) - interval '8 hours')
on conflict (id) do update
set
  name = excluded.name,
  status = excluded.status,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  updated_at = excluded.updated_at;

insert into public.forecasts (
  id,
  organization_id,
  workbook_id,
  owner_id,
  name,
  status,
  horizon_months,
  created_at,
  updated_at
)
values
  ('66666666-bbbb-4666-8666-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '33333333-cccc-4c3c-8c3c-333333333333', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Second Half Rolling Forecast', 'active', 18, timezone('utc', now()) - interval '7 days', timezone('utc', now()) - interval '1 day'),
  ('66666666-bbbb-4666-8666-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '22222222-bbbb-4b2b-8b2b-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Workforce Capacity Forecast', 'draft', 12, timezone('utc', now()) - interval '6 days', timezone('utc', now()) - interval '9 hours')
on conflict (id) do update
set
  name = excluded.name,
  status = excluded.status,
  horizon_months = excluded.horizon_months,
  updated_at = excluded.updated_at;

insert into public.reports (
  id,
  organization_id,
  workbook_id,
  created_by,
  name,
  status,
  definition,
  generated_at,
  created_at,
  updated_at
)
values
  ('77777777-cccc-4777-8777-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Executive Performance Pack', 'published', '{"layout":"executive_summary","sections":["Revenue","Margin","Cash"]}'::jsonb, timezone('utc', now()) - interval '4 hours', timezone('utc', now()) - interval '9 days', timezone('utc', now()) - interval '4 hours'),
  ('77777777-cccc-4777-8777-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '33333333-cccc-4c3c-8c3c-333333333333', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Revenue Variance Report', 'generated', '{"layout":"variance_bridge","sections":["Pipeline","Close Rate","Bookings"]}'::jsonb, timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '6 days', timezone('utc', now()) - interval '1 day'),
  ('77777777-cccc-4777-8777-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '22222222-bbbb-4b2b-8b2b-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Workforce Plan Status', 'draft', '{"layout":"workforce_summary","sections":["Open Roles","Attrition","Ramp"]}'::jsonb, null, timezone('utc', now()) - interval '3 days', timezone('utc', now()) - interval '3 days')
on conflict (id) do update
set
  name = excluded.name,
  status = excluded.status,
  definition = excluded.definition,
  generated_at = excluded.generated_at,
  updated_at = excluded.updated_at;

insert into public.workflows (
  id,
  organization_id,
  workbook_id,
  created_by,
  name,
  status,
  current_step,
  created_at,
  updated_at
)
values
  ('88888888-dddd-4888-8888-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'FY27 Budget Review', 'pending_approval', 'Controller sign-off', timezone('utc', now()) - interval '5 days', timezone('utc', now()) - interval '2 hours'),
  ('88888888-dddd-4888-8888-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '44444444-dddd-4d4d-8d4d-444444444444', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Board Report Publication', 'approved', 'Published', timezone('utc', now()) - interval '14 days', timezone('utc', now()) - interval '4 hours')
on conflict (id) do update
set
  name = excluded.name,
  status = excluded.status,
  current_step = excluded.current_step,
  updated_at = excluded.updated_at;

insert into public.approvals (
  id,
  workflow_id,
  approver_id,
  status,
  decision_note,
  decision_at,
  created_at,
  updated_at
)
values
  ('98989898-1111-4989-8989-111111111111', '88888888-dddd-4888-8888-111111111111', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'approved', 'Budget guardrails look acceptable.', timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '4 days', timezone('utc', now()) - interval '1 day'),
  ('98989898-1111-4989-8989-222222222222', '88888888-dddd-4888-8888-111111111111', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'pending', null, null, timezone('utc', now()) - interval '4 days', timezone('utc', now()) - interval '2 hours'),
  ('98989898-1111-4989-8989-333333333333', '88888888-dddd-4888-8888-222222222222', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'approved', 'Ready for distribution.', timezone('utc', now()) - interval '5 hours', timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '5 hours'),
  ('98989898-1111-4989-8989-444444444444', '88888888-dddd-4888-8888-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'approved', 'Compliance checks passed.', timezone('utc', now()) - interval '4 hours', timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '4 hours')
on conflict (workflow_id, approver_id) do update
set
  status = excluded.status,
  decision_note = excluded.decision_note,
  decision_at = excluded.decision_at,
  updated_at = excluded.updated_at;

insert into public.versions (
  id,
  organization_id,
  workbook_id,
  created_by,
  label,
  snapshot,
  created_at
)
values
  ('99999999-eeee-4999-8999-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Baseline import', '{"workbook":{"name":"FY27 Corporate Operating Plan"},"worksheets":[{"name":"Summary","cells":16}]}'::jsonb, timezone('utc', now()) - interval '11 days'),
  ('99999999-eeee-4999-8999-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'Pre-board review', '{"workbook":{"name":"FY27 Corporate Operating Plan"},"worksheets":[{"name":"Summary","cells":16},{"name":"Departments","cells":0}]}'::jsonb, timezone('utc', now()) - interval '2 days'),
  ('99999999-eeee-4999-8999-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '22222222-bbbb-4b2b-8b2b-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'Hiring committee review', '{"workbook":{"name":"Workforce Capacity Plan"},"worksheets":[{"name":"Roles","cells":6},{"name":"Hiring Plan","cells":4}]}'::jsonb, timezone('utc', now()) - interval '3 days')
on conflict (id) do update
set
  label = excluded.label,
  snapshot = excluded.snapshot;

insert into public.comments (
  id,
  organization_id,
  workbook_id,
  worksheet_id,
  version_id,
  row_index,
  column_index,
  author_id,
  body,
  resolved_at,
  created_at,
  updated_at
)
values
  ('aaaaaaaa-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', '11111111-aaaa-4a1a-8a1a-111111110001', null, 2, 2, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'Q1 revenue is pending final CRM reconciliation.', null, timezone('utc', now()) - interval '2 days', timezone('utc', now()) - interval '2 days'),
  ('aaaaaaaa-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '22222222-bbbb-4b2b-8b2b-222222222222', '22222222-bbbb-4b2b-8b2b-222222220002', '99999999-eeee-4999-8999-333333333333', 2, 2, '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Reduce April hiring by one role if utilization stays below 78%.', timezone('utc', now()) - interval '12 hours', timezone('utc', now()) - interval '3 days', timezone('utc', now()) - interval '12 hours'),
  ('aaaaaaaa-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '33333333-cccc-4c3c-8c3c-333333333333', '33333333-cccc-4c3c-8c3c-333333330002', null, 1, 2, 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'Approver note: use a lower close rate for the downside case.', null, timezone('utc', now()) - interval '20 hours', timezone('utc', now()) - interval '20 hours')
on conflict (id) do update
set
  body = excluded.body,
  resolved_at = excluded.resolved_at,
  updated_at = excluded.updated_at;

insert into public.templates (
  id,
  organization_id,
  created_by,
  name,
  category,
  description,
  workbook_template,
  created_at,
  updated_at
)
values
  ('bbbbbbbb-1111-4111-8111-111111111111', null, '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Executive Reporting Template', 'executive', 'Reusable executive reporting starter for monthly performance reviews.', '{"sheets":["Executive KPIs","Bridge","Notes"],"layout":"executive_summary"}'::jsonb, timezone('utc', now()) - interval '16 days', timezone('utc', now()) - interval '6 hours'),
  ('bbbbbbbb-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Workforce Planning Template', 'workforce', 'Team hiring model with capacity and payroll planning tabs.', '{"sheets":["Roles","Hiring Plan","Payroll"],"layout":"workforce_summary"}'::jsonb, timezone('utc', now()) - interval '9 days', timezone('utc', now()) - interval '7 hours')
on conflict (id) do update
set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  workbook_template = excluded.workbook_template,
  updated_at = excluded.updated_at;

insert into public.data_sources (
  id,
  organization_id,
  created_by,
  name,
  source_type,
  config,
  created_at,
  updated_at
)
values
  ('cccccccc-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'ERP Ledger Mirror', 'erp', '{"syncMode":"daily","entity":"gl_transactions","owner":"finance_systems"}'::jsonb, timezone('utc', now()) - interval '20 days', timezone('utc', now()) - interval '5 hours'),
  ('cccccccc-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'CRM Opportunity Snapshot', 'crm', '{"syncMode":"manual","entity":"opportunities","owner":"revops"}'::jsonb, timezone('utc', now()) - interval '11 days', timezone('utc', now()) - interval '1 day'),
  ('cccccccc-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Payroll Cost Feed', 'payroll', '{"syncMode":"weekly","entity":"employee_costs","owner":"people_ops"}'::jsonb, timezone('utc', now()) - interval '7 days', timezone('utc', now()) - interval '8 hours')
on conflict (id) do update
set
  name = excluded.name,
  source_type = excluded.source_type,
  config = excluded.config,
  updated_at = excluded.updated_at;

insert into public.notifications (
  id,
  organization_id,
  user_id,
  kind,
  title,
  body,
  link,
  metadata,
  read_at,
  created_at,
  updated_at
)
values
  ('eeeeeeee-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'workflow', 'Budget review moved forward', 'FY27 Budget Review now only needs final approver sign-off.', '/workflows', '{"workflowId":"88888888-dddd-4888-8888-111111111111"}'::jsonb, null, timezone('utc', now()) - interval '2 hours', timezone('utc', now()) - interval '2 hours'),
  ('eeeeeeee-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'comment', 'Revenue note still open', 'John left a revenue note that still needs an updated CRM pull.', '/workbooks/11111111-aaaa-4a1a-8a1a-111111111111', '{"commentId":"aaaaaaaa-1111-4111-8111-111111111111"}'::jsonb, null, timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '1 day'),
  ('eeeeeeee-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'system', 'Revenue forecast refreshed', 'A fresh opportunity snapshot is available for the revenue workbook.', '/workbooks/33333333-cccc-4c3c-8c3c-333333333333', '{"sourceId":"cccccccc-2222-4222-8222-222222222222"}'::jsonb, timezone('utc', now()) - interval '8 hours', timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '8 hours'),
  ('eeeeeeee-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003', 'workflow', 'Approval requested', 'Please review the FY27 Budget Review workflow.', '/workflows', '{"approvalId":"98989898-1111-4989-8989-222222222222"}'::jsonb, null, timezone('utc', now()) - interval '3 hours', timezone('utc', now()) - interval '3 hours'),
  ('eeeeeeee-5555-4555-8555-555555555555', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1004', 'report', 'Board report published', 'Executive Performance Pack is now published and visible to workspace members.', '/reports', '{"reportId":"77777777-cccc-4777-8777-111111111111"}'::jsonb, null, timezone('utc', now()) - interval '4 hours', timezone('utc', now()) - interval '4 hours')
on conflict (id) do update
set
  title = excluded.title,
  body = excluded.body,
  link = excluded.link,
  metadata = excluded.metadata,
  read_at = excluded.read_at,
  updated_at = excluded.updated_at;

insert into public.schedules (
  id,
  organization_id,
  report_id,
  created_by,
  name,
  cron_expression,
  timezone,
  status,
  next_run_at,
  last_run_at,
  created_at,
  updated_at
)
values
  ('dddddddd-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '77777777-cccc-4777-8777-111111111111', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'Monday performance pack', '0 8 * * 1', 'Asia/Kolkata', 'active', timezone('utc', now()) + interval '2 days', timezone('utc', now()) - interval '5 days', timezone('utc', now()) - interval '9 days', timezone('utc', now()) - interval '4 hours'),
  ('dddddddd-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '77777777-cccc-4777-8777-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Revenue review digest', '0 10 1 * *', 'Asia/Kolkata', 'paused', timezone('utc', now()) + interval '17 days', timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '6 days', timezone('utc', now()) - interval '1 day')
on conflict (id) do update
set
  name = excluded.name,
  cron_expression = excluded.cron_expression,
  timezone = excluded.timezone,
  status = excluded.status,
  next_run_at = excluded.next_run_at,
  last_run_at = excluded.last_run_at,
  updated_at = excluded.updated_at;

insert into public.audit_logs (
  organization_id,
  actor_id,
  entity_type,
  entity_id,
  action,
  details,
  created_at
)
select
  '6a601d44-72db-4c3b-a557-8a16f2a37b6b',
  '3ca312cb-319a-46df-b5cd-8ffeea774839',
  'workbooks',
  '11111111-aaaa-4a1a-8a1a-111111111111',
  'seed_workbook_verified',
  '{"source":"seed.sql"}'::jsonb,
  timezone('utc', now()) - interval '2 hours'
where not exists (
  select 1
  from public.audit_logs
  where organization_id = '6a601d44-72db-4c3b-a557-8a16f2a37b6b'
    and entity_id = '11111111-aaaa-4a1a-8a1a-111111111111'
    and action = 'seed_workbook_verified'
);

insert into public.audit_logs (
  organization_id,
  actor_id,
  entity_type,
  entity_id,
  action,
  details,
  created_at
)
select
  '6a601d44-72db-4c3b-a557-8a16f2a37b6b',
  'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001',
  'budgets',
  '55555555-aaaa-4555-8555-111111111111',
  'budget_seeded',
  '{"source":"seed.sql"}'::jsonb,
  timezone('utc', now()) - interval '5 hours'
where not exists (
  select 1
  from public.audit_logs
  where organization_id = '6a601d44-72db-4c3b-a557-8a16f2a37b6b'
    and entity_id = '55555555-aaaa-4555-8555-111111111111'
    and action = 'budget_seeded'
);

insert into public.audit_logs (
  organization_id,
  actor_id,
  entity_type,
  entity_id,
  action,
  details,
  created_at
)
select
  '6a601d44-72db-4c3b-a557-8a16f2a37b6b',
  'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
  'reports',
  '77777777-cccc-4777-8777-222222222222',
  'report_generated',
  '{"source":"seed.sql"}'::jsonb,
  timezone('utc', now()) - interval '1 day'
where not exists (
  select 1
  from public.audit_logs
  where organization_id = '6a601d44-72db-4c3b-a557-8a16f2a37b6b'
    and entity_id = '77777777-cccc-4777-8777-222222222222'
    and action = 'report_generated'
);

insert into public.audit_logs (
  organization_id,
  actor_id,
  entity_type,
  entity_id,
  action,
  details,
  created_at
)
select
  '6a601d44-72db-4c3b-a557-8a16f2a37b6b',
  'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1003',
  'approvals',
  '98989898-1111-4989-8989-222222222222',
  'approval_requested',
  '{"source":"seed.sql"}'::jsonb,
  timezone('utc', now()) - interval '3 hours'
where not exists (
  select 1
  from public.audit_logs
  where organization_id = '6a601d44-72db-4c3b-a557-8a16f2a37b6b'
    and entity_id = '98989898-1111-4989-8989-222222222222'
    and action = 'approval_requested'
);

insert into public.currencies (
  id,
  organization_id,
  created_by,
  code,
  name,
  symbol,
  decimal_places,
  is_base,
  created_at,
  updated_at
)
values
  ('12121212-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'USD', 'US Dollar', '$', 2, true, timezone('utc', now()) - interval '30 days', timezone('utc', now()) - interval '2 hours'),
  ('12121212-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'EUR', 'Euro', 'EUR', 2, false, timezone('utc', now()) - interval '29 days', timezone('utc', now()) - interval '1 day'),
  ('12121212-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'GBP', 'British Pound', 'GBP', 2, false, timezone('utc', now()) - interval '29 days', timezone('utc', now()) - interval '12 hours'),
  ('12121212-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'INR', 'Indian Rupee', 'Rs', 2, false, timezone('utc', now()) - interval '29 days', timezone('utc', now()) - interval '6 hours'),
  ('12121212-5555-4555-8555-555555555555', '6a601d44-72db-4c3b-a557-8a16f2a37b70', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'USD', 'US Dollar', '$', 2, true, timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '8 hours'),
  ('12121212-6666-4666-8666-666666666666', '6a601d44-72db-4c3b-a557-8a16f2a37b70', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'INR', 'Indian Rupee', 'Rs', 2, false, timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '8 hours')
on conflict (id) do update
set
  code = excluded.code,
  name = excluded.name,
  symbol = excluded.symbol,
  decimal_places = excluded.decimal_places,
  is_base = excluded.is_base,
  updated_at = excluded.updated_at;

insert into public.exchange_rates (
  id,
  organization_id,
  base_currency_id,
  quote_currency_id,
  rate,
  source,
  effective_at,
  created_by,
  created_at,
  updated_at
)
values
  ('13131313-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '12121212-1111-4111-8111-111111111111', '12121212-2222-4222-8222-222222222222', 0.923500, 'treasury', timezone('utc', now()) - interval '1 day', '3ca312cb-319a-46df-b5cd-8ffeea774839', timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '1 day'),
  ('13131313-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '12121212-1111-4111-8111-111111111111', '12121212-3333-4333-8333-333333333333', 0.791200, 'treasury', timezone('utc', now()) - interval '1 day', '3ca312cb-319a-46df-b5cd-8ffeea774839', timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '1 day'),
  ('13131313-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '12121212-1111-4111-8111-111111111111', '12121212-4444-4444-8444-444444444444', 83.120000, 'treasury', timezone('utc', now()) - interval '1 day', '3ca312cb-319a-46df-b5cd-8ffeea774839', timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '1 day'),
  ('13131313-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b70', '12121212-5555-4555-8555-555555555555', '12121212-6666-4666-8666-666666666666', 83.120000, 'treasury', timezone('utc', now()) - interval '1 day', '3ca312cb-319a-46df-b5cd-8ffeea774839', timezone('utc', now()) - interval '1 day', timezone('utc', now()) - interval '1 day')
on conflict (id) do update
set
  rate = excluded.rate,
  source = excluded.source,
  effective_at = excluded.effective_at,
  updated_at = excluded.updated_at;

insert into public.accounts (
  id,
  organization_id,
  code,
  name,
  category,
  created_at,
  updated_at
)
values
  ('14141414-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '4000', 'Services Revenue', 'Revenue', timezone('utc', now()) - interval '21 days', timezone('utc', now()) - interval '5 hours'),
  ('14141414-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '5100', 'Delivery Payroll', 'Operating Expense', timezone('utc', now()) - interval '21 days', timezone('utc', now()) - interval '4 hours'),
  ('14141414-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '5200', 'Sales and Marketing', 'Operating Expense', timezone('utc', now()) - interval '21 days', timezone('utc', now()) - interval '4 hours'),
  ('14141414-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '5300', 'General and Administrative', 'Operating Expense', timezone('utc', now()) - interval '21 days', timezone('utc', now()) - interval '3 hours'),
  ('14141414-5555-4555-8555-555555555555', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '6100', 'Cash Collections', 'Cash Flow', timezone('utc', now()) - interval '21 days', timezone('utc', now()) - interval '2 hours')
on conflict (id) do update
set
  name = excluded.name,
  category = excluded.category,
  updated_at = excluded.updated_at;

insert into public.cost_centers (
  id,
  organization_id,
  owner_id,
  code,
  name,
  region,
  created_at,
  updated_at
)
values
  ('15151515-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1001', 'DEL', 'Delivery', 'India', timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '3 hours'),
  ('15151515-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'REV', 'Revenue Operations', 'North America', timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '2 hours'),
  ('15151515-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '3ca312cb-319a-46df-b5cd-8ffeea774839', 'FIN', 'Finance', 'India', timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '90 minutes'),
  ('15151515-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'PEO', 'People Operations', 'India', timezone('utc', now()) - interval '18 days', timezone('utc', now()) - interval '60 minutes')
on conflict (id) do update
set
  name = excluded.name,
  region = excluded.region,
  updated_at = excluded.updated_at;

insert into public.dimensions (
  id,
  organization_id,
  key,
  name,
  value_options,
  created_at,
  updated_at
)
values
  ('16161616-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'department', 'Department', '["Delivery","Finance","People","Sales"]'::jsonb, timezone('utc', now()) - interval '16 days', timezone('utc', now()) - interval '4 hours'),
  ('16161616-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'region', 'Region', '["India","North America","Europe"]'::jsonb, timezone('utc', now()) - interval '16 days', timezone('utc', now()) - interval '3 hours'),
  ('16161616-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'practice', 'Practice', '["Salesforce","Data","Managed Services","Internal Ops"]'::jsonb, timezone('utc', now()) - interval '16 days', timezone('utc', now()) - interval '2 hours'),
  ('16161616-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', 'scenario_class', 'Scenario Class', '["Base","Upside","Downside"]'::jsonb, timezone('utc', now()) - interval '16 days', timezone('utc', now()) - interval '1 day')
on conflict (id) do update
set
  name = excluded.name,
  value_options = excluded.value_options,
  updated_at = excluded.updated_at;

insert into public.metrics (
  id,
  organization_id,
  workbook_id,
  name,
  slug,
  unit,
  actual_value,
  target_value,
  change_pct,
  created_at,
  updated_at
)
values
  ('17171717-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '11111111-aaaa-4a1a-8a1a-111111111111', 'Net Revenue', 'net-revenue', 'currency', 5240000, 5480000, -4.38, timezone('utc', now()) - interval '12 days', timezone('utc', now()) - interval '2 hours'),
  ('17171717-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '44444444-dddd-4d4d-8d4d-444444444444', 'Gross Margin', 'gross-margin', 'percent', 38.6, 40.0, -3.50, timezone('utc', now()) - interval '12 days', timezone('utc', now()) - interval '90 minutes'),
  ('17171717-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '22222222-bbbb-4b2b-8b2b-222222222222', 'Billable Headcount', 'billable-headcount', 'count', 92, 96, -4.17, timezone('utc', now()) - interval '10 days', timezone('utc', now()) - interval '50 minutes'),
  ('17171717-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '33333333-cccc-4c3c-8c3c-333333333333', 'Pipeline Coverage', 'pipeline-coverage', 'ratio', 3.2, 3.5, -8.57, timezone('utc', now()) - interval '8 days', timezone('utc', now()) - interval '40 minutes')
on conflict (id) do update
set
  actual_value = excluded.actual_value,
  target_value = excluded.target_value,
  change_pct = excluded.change_pct,
  updated_at = excluded.updated_at;

insert into public.scenarios (
  id,
  organization_id,
  forecast_id,
  workbook_id,
  created_by,
  name,
  status,
  driver_summary,
  created_at,
  updated_at
)
values
  ('18181818-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '66666666-bbbb-4666-8666-111111111111', '33333333-cccc-4c3c-8c3c-333333333333', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Core Case', 'active', '{"closeRate":0.32,"rampMonths":2,"pricing":"current"}'::jsonb, timezone('utc', now()) - interval '5 days', timezone('utc', now()) - interval '4 hours'),
  ('18181818-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '66666666-bbbb-4666-8666-111111111111', '33333333-cccc-4c3c-8c3c-333333333333', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002', 'Conservative Case', 'draft', '{"closeRate":0.26,"rampMonths":3,"pricing":"discounted"}'::jsonb, timezone('utc', now()) - interval '4 days', timezone('utc', now()) - interval '2 hours'),
  ('18181818-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '66666666-bbbb-4666-8666-222222222222', '22222222-bbbb-4b2b-8b2b-222222222222', 'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1005', 'Growth Hiring Case', 'draft', '{"backfills":8,"newLogos":3,"utilizationFloor":0.78}'::jsonb, timezone('utc', now()) - interval '2 days', timezone('utc', now()) - interval '1 hour')
on conflict (id) do update
set
  name = excluded.name,
  status = excluded.status,
  driver_summary = excluded.driver_summary,
  updated_at = excluded.updated_at;

insert into public.variances (
  id,
  organization_id,
  budget_id,
  forecast_id,
  account_id,
  cost_center_id,
  metric_id,
  name,
  period_label,
  plan_value,
  actual_value,
  variance_value,
  variance_percent,
  status,
  created_at,
  updated_at
)
values
  ('19191919-1111-4111-8111-111111111111', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '55555555-aaaa-4555-8555-111111111111', '66666666-bbbb-4666-8666-111111111111', '14141414-1111-4111-8111-111111111111', '15151515-2222-4222-8222-222222222222', '17171717-1111-4111-8111-111111111111', 'Revenue bridge', 'Q2 FY27', 1320000, 1264000, -56000, -4.24, 'unfavorable', timezone('utc', now()) - interval '3 days', timezone('utc', now()) - interval '3 hours'),
  ('19191919-2222-4222-8222-222222222222', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '55555555-aaaa-4555-8555-111111111111', '66666666-bbbb-4666-8666-111111111111', '14141414-2222-4222-8222-222222222222', '15151515-1111-4111-8111-111111111111', '17171717-3333-4333-8333-333333333333', 'Delivery payroll', 'Q2 FY27', 842000, 827500, -14500, -1.72, 'favorable', timezone('utc', now()) - interval '3 days', timezone('utc', now()) - interval '2 hours'),
  ('19191919-3333-4333-8333-333333333333', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', '55555555-aaaa-4555-8555-111111111111', null, '14141414-3333-4333-8333-333333333333', '15151515-2222-4222-8222-222222222222', null, 'Demand generation spend', 'Q2 FY27', 265000, 281000, 16000, 6.04, 'unfavorable', timezone('utc', now()) - interval '3 days', timezone('utc', now()) - interval '90 minutes'),
  ('19191919-4444-4444-8444-444444444444', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', null, '66666666-bbbb-4666-8666-111111111111', null, '15151515-3333-4333-8333-333333333333', '17171717-2222-4222-8222-222222222222', 'Gross margin gap', 'Q2 FY27', 40.0, 38.6, -1.4, -3.50, 'unfavorable', timezone('utc', now()) - interval '2 days', timezone('utc', now()) - interval '70 minutes'),
  ('19191919-5555-4555-8555-555555555555', '6a601d44-72db-4c3b-a557-8a16f2a37b6b', null, '66666666-bbbb-4666-8666-222222222222', null, '15151515-4444-4444-8444-444444444444', '17171717-3333-4333-8333-333333333333', 'Headcount pacing', 'May FY27', 96, 92, -4, -4.17, 'unfavorable', timezone('utc', now()) - interval '2 days', timezone('utc', now()) - interval '50 minutes')
on conflict (id) do update
set
  plan_value = excluded.plan_value,
  actual_value = excluded.actual_value,
  variance_value = excluded.variance_value,
  variance_percent = excluded.variance_percent,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.audit_logs (
  organization_id,
  actor_id,
  entity_type,
  entity_id,
  action,
  details,
  created_at
)
select
  '6a601d44-72db-4c3b-a557-8a16f2a37b6b',
  '3ca312cb-319a-46df-b5cd-8ffeea774839',
  'scenarios',
  '18181818-1111-4111-8111-111111111111',
  'scenario_seeded',
  '{"source":"seed.sql","status":"active"}'::jsonb,
  timezone('utc', now()) - interval '4 hours'
where not exists (
  select 1
  from public.audit_logs
  where organization_id = '6a601d44-72db-4c3b-a557-8a16f2a37b6b'
    and entity_id = '18181818-1111-4111-8111-111111111111'
    and action = 'scenario_seeded'
);

insert into public.audit_logs (
  organization_id,
  actor_id,
  entity_type,
  entity_id,
  action,
  details,
  created_at
)
select
  '6a601d44-72db-4c3b-a557-8a16f2a37b6b',
  'c4e7d7d7-91d8-4f12-8b44-07ce6d1a1002',
  'variances',
  '19191919-1111-4111-8111-111111111111',
  'variance_flagged',
  '{"source":"seed.sql","severity":"high"}'::jsonb,
  timezone('utc', now()) - interval '2 hours'
where not exists (
  select 1
  from public.audit_logs
  where organization_id = '6a601d44-72db-4c3b-a557-8a16f2a37b6b'
    and entity_id = '19191919-1111-4111-8111-111111111111'
    and action = 'variance_flagged'
);

commit;
