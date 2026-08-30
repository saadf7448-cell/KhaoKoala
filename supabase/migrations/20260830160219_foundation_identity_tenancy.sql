-- ============================================================
-- KhaoKoala
-- Foundation: identity, restaurant tenancy, branches and RLS
-- No seed/demo/dummy data.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ============================================================
-- COMMON UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- PROFILES
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  display_name text,
  phone text,
  avatar_path text,

  preferred_language text not null default 'en'
    check (preferred_language in ('en', 'ur')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Automatically create an application profile for new auth users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================
-- RESTAURANTS
-- ============================================================

create table public.restaurants (
  id uuid primary key default extensions.gen_random_uuid(),

  name text not null
    check (char_length(trim(name)) between 2 and 120),

  slug text not null unique
    check (
      slug = lower(slug)
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  description text,

  logo_path text,
  cover_path text,

  business_email text,
  whatsapp_number text,

  status text not null default 'draft'
    check (status in ('draft', 'active', 'suspended', 'archived')),

  is_published boolean not null default false,

  default_currency text not null default 'PKR'
    check (default_currency = 'PKR'),

  created_by uuid not null
    references public.profiles(id)
    on delete restrict,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  archived_at timestamptz,
  suspended_at timestamptz
);

create trigger restaurants_set_updated_at
before update on public.restaurants
for each row
execute function public.set_updated_at();

-- ============================================================
-- BRANCHES
-- ============================================================

create table public.branches (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null
    references public.restaurants(id)
    on delete restrict,

  name text not null
    check (char_length(trim(name)) between 2 and 120),

  slug text not null
    check (
      slug = lower(slug)
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  phone text,
  email text,

  address_line_1 text,
  address_line_2 text,

  area text,
  city text,
  postal_code text,

  latitude numeric(9,6)
    check (latitude between -90 and 90),

  longitude numeric(9,6)
    check (longitude between -180 and 180),

  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),

  is_temporarily_paused boolean not null default false,

  dine_in_enabled boolean not null default false,
  pickup_enabled boolean not null default false,
  delivery_enabled boolean not null default false,

  minimum_order_amount_minor bigint not null default 0
    check (minimum_order_amount_minor >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  archived_at timestamptz,

  constraint branches_restaurant_slug_unique
    unique (restaurant_id, slug),

  constraint branches_id_restaurant_unique
    unique (id, restaurant_id)
);

create index branches_restaurant_id_idx
on public.branches (restaurant_id);

create trigger branches_set_updated_at
before update on public.branches
for each row
execute function public.set_updated_at();

-- ============================================================
-- RESTAURANT MEMBERSHIPS
-- ============================================================

create table public.restaurant_memberships (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null
    references public.restaurants(id)
    on delete restrict,

  user_id uuid not null
    references public.profiles(id)
    on delete restrict,

  role text not null
    check (
      role in (
        'owner',
        'manager',
        'cashier',
        'kitchen',
        'waiter'
      )
    ),

  status text not null default 'active'
    check (
      status in (
        'active',
        'suspended',
        'revoked'
      )
    ),

  created_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint restaurant_membership_user_unique
    unique (restaurant_id, user_id),

  constraint restaurant_memberships_id_restaurant_unique
    unique (id, restaurant_id)
);

create index restaurant_memberships_user_id_idx
on public.restaurant_memberships (user_id);

create index restaurant_memberships_restaurant_id_idx
on public.restaurant_memberships (restaurant_id);

create trigger restaurant_memberships_set_updated_at
before update on public.restaurant_memberships
for each row
execute function public.set_updated_at();

-- ============================================================
-- MEMBERSHIP BRANCH SCOPE
-- ============================================================

create table public.membership_branches (
  restaurant_id uuid not null,

  membership_id uuid not null,

  branch_id uuid not null,

  created_at timestamptz not null default now(),

  primary key (membership_id, branch_id),

  foreign key (membership_id, restaurant_id)
    references public.restaurant_memberships(id, restaurant_id)
    on delete cascade,

  foreign key (branch_id, restaurant_id)
    references public.branches(id, restaurant_id)
    on delete cascade
);

create index membership_branches_restaurant_idx
on public.membership_branches (restaurant_id);

create index membership_branches_branch_idx
on public.membership_branches (branch_id);

-- ============================================================
-- BRANCH HOURS
-- One operating interval per weekday for initial launch.
-- ============================================================

create table public.branch_hours (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null,

  branch_id uuid not null,

  day_of_week smallint not null
    check (day_of_week between 0 and 6),

  is_closed boolean not null default false,

  open_time time,
  close_time time,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  foreign key (branch_id, restaurant_id)
    references public.branches(id, restaurant_id)
    on delete cascade,

  constraint branch_hours_day_unique
    unique (branch_id, day_of_week),

  constraint branch_hours_opening_values
    check (
      (
        is_closed
        and open_time is null
        and close_time is null
      )
      or
      (
        not is_closed
        and open_time is not null
        and close_time is not null
      )
    )
);

create index branch_hours_restaurant_idx
on public.branch_hours (restaurant_id);

create trigger branch_hours_set_updated_at
before update on public.branch_hours
for each row
execute function public.set_updated_at();

-- ============================================================
-- SECURITY HELPERS
-- These functions centralize tenant membership checks and avoid
-- recursive RLS policy evaluation.
-- ============================================================

create or replace function public.is_restaurant_member(
  target_restaurant_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_memberships rm
    where rm.restaurant_id = target_restaurant_id
      and rm.user_id = auth.uid()
      and rm.status = 'active'
  );
$$;

create or replace function public.has_restaurant_role(
  target_restaurant_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_memberships rm
    where rm.restaurant_id = target_restaurant_id
      and rm.user_id = auth.uid()
      and rm.status = 'active'
      and rm.role = any (allowed_roles)
  );
$$;

revoke all on function public.is_restaurant_member(uuid) from public;
revoke all on function public.has_restaurant_role(uuid, text[]) from public;

grant execute on function public.is_restaurant_member(uuid)
to authenticated;

grant execute on function public.has_restaurant_role(uuid, text[])
to authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.branches enable row level security;
alter table public.restaurant_memberships enable row level security;
alter table public.membership_branches enable row level security;
alter table public.branch_hours enable row level security;

-- Profiles: authenticated users can see and update only themselves.

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Restaurant records: only current active members can read raw
-- tenant records at this stage.
-- Public marketplace access will later use purpose-built safe views/RPCs.

create policy restaurants_member_select
on public.restaurants
for select
to authenticated
using (public.is_restaurant_member(id));

create policy branches_member_select
on public.branches
for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

create policy memberships_member_select
on public.restaurant_memberships
for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

create policy membership_branches_member_select
on public.membership_branches
for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

create policy branch_hours_member_select
on public.branch_hours
for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

-- ============================================================
-- EXPLICIT API GRANTS
-- We intentionally grant no anonymous access to raw tenant tables.
-- No restaurant writes are exposed yet.
-- ============================================================

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.restaurants from anon, authenticated;
revoke all on table public.branches from anon, authenticated;
revoke all on table public.restaurant_memberships from anon, authenticated;
revoke all on table public.membership_branches from anon, authenticated;
revoke all on table public.branch_hours from anon, authenticated;

grant select, update
on table public.profiles
to authenticated;

grant select
on table public.restaurants,
         public.branches,
         public.restaurant_memberships,
         public.membership_branches,
         public.branch_hours
to authenticated;

-- ============================================================
-- END FOUNDATION
-- ============================================================