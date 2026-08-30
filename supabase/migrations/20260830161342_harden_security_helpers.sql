-- ============================================================
-- KhaoKoala
-- Security hardening:
-- move internal helper functions out of exposed public schema.
-- No data is inserted.
-- ============================================================

create schema if not exists private;

revoke all on schema private from PUBLIC;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
revoke all on schema private from service_role;

grant usage on schema private
to authenticated, service_role, supabase_auth_admin;

-- ============================================================
-- INTERNAL UPDATED_AT TRIGGER
-- ============================================================

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all
on function private.set_updated_at()
from PUBLIC, anon, authenticated, service_role;

grant execute
on function private.set_updated_at()
to authenticated, service_role;

-- ============================================================
-- INTERNAL AUTH PROFILE TRIGGER
-- ============================================================

create or replace function private.handle_new_user()
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

revoke all
on function private.handle_new_user()
from PUBLIC, anon, authenticated, service_role;

grant execute
on function private.handle_new_user()
to supabase_auth_admin;

-- ============================================================
-- PRIVATE TENANT AUTHORIZATION HELPERS
-- ============================================================

create or replace function private.is_restaurant_member(
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

create or replace function private.has_restaurant_role(
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

revoke all
on function private.is_restaurant_member(uuid)
from PUBLIC, anon, authenticated, service_role;

revoke all
on function private.has_restaurant_role(uuid, text[])
from PUBLIC, anon, authenticated, service_role;

grant execute
on function private.is_restaurant_member(uuid)
to authenticated;

grant execute
on function private.has_restaurant_role(uuid, text[])
to authenticated;

-- ============================================================
-- REWIRE UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists profiles_set_updated_at
on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();


drop trigger if exists restaurants_set_updated_at
on public.restaurants;

create trigger restaurants_set_updated_at
before update on public.restaurants
for each row
execute function private.set_updated_at();


drop trigger if exists branches_set_updated_at
on public.branches;

create trigger branches_set_updated_at
before update on public.branches
for each row
execute function private.set_updated_at();


drop trigger if exists restaurant_memberships_set_updated_at
on public.restaurant_memberships;

create trigger restaurant_memberships_set_updated_at
before update on public.restaurant_memberships
for each row
execute function private.set_updated_at();


drop trigger if exists branch_hours_set_updated_at
on public.branch_hours;

create trigger branch_hours_set_updated_at
before update on public.branch_hours
for each row
execute function private.set_updated_at();

-- ============================================================
-- REWIRE AUTH USER TRIGGER
-- ============================================================

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

-- ============================================================
-- REWIRE TENANT RLS POLICIES
-- ============================================================

drop policy if exists restaurants_member_select
on public.restaurants;

create policy restaurants_member_select
on public.restaurants
for select
to authenticated
using (
  private.is_restaurant_member(id)
);


drop policy if exists branches_member_select
on public.branches;

create policy branches_member_select
on public.branches
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


drop policy if exists memberships_member_select
on public.restaurant_memberships;

create policy memberships_member_select
on public.restaurant_memberships
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


drop policy if exists membership_branches_member_select
on public.membership_branches;

create policy membership_branches_member_select
on public.membership_branches
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


drop policy if exists branch_hours_member_select
on public.branch_hours;

create policy branch_hours_member_select
on public.branch_hours
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);

-- ============================================================
-- REMOVE EXPOSED PUBLIC HELPERS
-- ============================================================

drop function if exists public.has_restaurant_role(uuid, text[]);
drop function if exists public.is_restaurant_member(uuid);
drop function if exists public.handle_new_user();
drop function if exists public.set_updated_at();

-- ============================================================
-- END SECURITY HARDENING
-- ============================================================