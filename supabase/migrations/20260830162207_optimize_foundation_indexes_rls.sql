-- ============================================================
-- KhaoKoala
-- Foundation performance hardening
-- No data inserted or modified.
-- ============================================================

-- ============================================================
-- FOREIGN KEY COVERING INDEXES
-- ============================================================

create index if not exists branch_hours_branch_restaurant_idx
on public.branch_hours (branch_id, restaurant_id);

create index if not exists membership_branches_branch_restaurant_idx
on public.membership_branches (branch_id, restaurant_id);

create index if not exists membership_branches_membership_restaurant_idx
on public.membership_branches (membership_id, restaurant_id);

create index if not exists restaurant_memberships_created_by_idx
on public.restaurant_memberships (created_by);

create index if not exists restaurants_created_by_idx
on public.restaurants (created_by);

-- ============================================================
-- OPTIMIZE PROFILE RLS
-- Evaluate auth.uid() once per statement rather than per row.
-- ============================================================

drop policy if exists profiles_select_own
on public.profiles;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
);


drop policy if exists profiles_update_own
on public.profiles;

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
)
with check (
  id = (select auth.uid())
);

-- ============================================================
-- END
-- ============================================================