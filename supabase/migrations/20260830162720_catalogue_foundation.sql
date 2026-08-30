-- ============================================================
-- KhaoKoala
-- Catalogue foundation
--
-- Categories
-- Menu items
-- Variants
-- Modifier groups/options
-- Item-to-modifier relationships
-- Branch item availability
--
-- NO SEED / DEMO / DUMMY DATA
-- ============================================================


-- ============================================================
-- MENU CATEGORIES
-- ============================================================

create table public.menu_categories (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null
    references public.restaurants(id)
    on delete restrict,

  name text not null
    check (char_length(trim(name)) between 1 and 100),

  slug text not null
    check (
      slug = lower(slug)
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  description text,

  sort_order integer not null default 0
    check (sort_order >= 0),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint menu_categories_restaurant_slug_unique
    unique (restaurant_id, slug),

  constraint menu_categories_id_restaurant_unique
    unique (id, restaurant_id)
);

create index menu_categories_restaurant_idx
on public.menu_categories (restaurant_id);

create trigger menu_categories_set_updated_at
before update on public.menu_categories
for each row
execute function private.set_updated_at();


-- ============================================================
-- MENU ITEMS
-- ============================================================

create table public.menu_items (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null,

  category_id uuid not null,

  name text not null
    check (char_length(trim(name)) between 1 and 160),

  slug text not null
    check (
      slug = lower(slug)
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),

  description text,

  image_path text,

  base_price_minor bigint not null
    check (base_price_minor >= 0),

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'active',
        'archived'
      )
    ),

  is_published boolean not null default false,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  archived_at timestamptz,

  foreign key (category_id, restaurant_id)
    references public.menu_categories(id, restaurant_id)
    on delete restrict,

  constraint menu_items_restaurant_slug_unique
    unique (restaurant_id, slug),

  constraint menu_items_id_restaurant_unique
    unique (id, restaurant_id)
);

create index menu_items_restaurant_idx
on public.menu_items (restaurant_id);

create index menu_items_category_restaurant_idx
on public.menu_items (category_id, restaurant_id);

create index menu_items_published_idx
on public.menu_items (restaurant_id, is_published, status);

create trigger menu_items_set_updated_at
before update on public.menu_items
for each row
execute function private.set_updated_at();


-- ============================================================
-- MENU ITEM VARIANTS
-- ============================================================

create table public.menu_item_variants (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null,

  menu_item_id uuid not null,

  name text not null
    check (char_length(trim(name)) between 1 and 100),

  price_minor bigint not null
    check (price_minor >= 0),

  is_default boolean not null default false,

  is_active boolean not null default true,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  foreign key (menu_item_id, restaurant_id)
    references public.menu_items(id, restaurant_id)
    on delete cascade,

  constraint menu_item_variants_id_restaurant_unique
    unique (id, restaurant_id),

  constraint menu_item_variant_name_unique
    unique (menu_item_id, name)
);

create index menu_item_variants_item_restaurant_idx
on public.menu_item_variants (menu_item_id, restaurant_id);

create unique index menu_item_variants_one_default_idx
on public.menu_item_variants (menu_item_id)
where is_default = true;

create trigger menu_item_variants_set_updated_at
before update on public.menu_item_variants
for each row
execute function private.set_updated_at();


-- ============================================================
-- MODIFIER GROUPS
--
-- Examples later from REAL restaurant data:
-- sauces, drinks, toppings, extras
-- No example rows are inserted here.
-- ============================================================

create table public.modifier_groups (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null
    references public.restaurants(id)
    on delete restrict,

  name text not null
    check (char_length(trim(name)) between 1 and 100),

  minimum_selections smallint not null default 0
    check (minimum_selections >= 0),

  maximum_selections smallint not null default 1
    check (maximum_selections >= 1),

  is_active boolean not null default true,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint modifier_group_selection_bounds
    check (
      maximum_selections >= minimum_selections
    ),

  constraint modifier_groups_id_restaurant_unique
    unique (id, restaurant_id)
);

create index modifier_groups_restaurant_idx
on public.modifier_groups (restaurant_id);

create trigger modifier_groups_set_updated_at
before update on public.modifier_groups
for each row
execute function private.set_updated_at();


-- ============================================================
-- MODIFIER OPTIONS
-- ============================================================

create table public.modifier_options (
  id uuid primary key default extensions.gen_random_uuid(),

  restaurant_id uuid not null,

  modifier_group_id uuid not null,

  name text not null
    check (char_length(trim(name)) between 1 and 100),

  price_delta_minor bigint not null default 0
    check (price_delta_minor >= 0),

  is_active boolean not null default true,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  foreign key (modifier_group_id, restaurant_id)
    references public.modifier_groups(id, restaurant_id)
    on delete cascade,

  constraint modifier_options_id_restaurant_unique
    unique (id, restaurant_id),

  constraint modifier_option_name_unique
    unique (modifier_group_id, name)
);

create index modifier_options_group_restaurant_idx
on public.modifier_options (modifier_group_id, restaurant_id);

create trigger modifier_options_set_updated_at
before update on public.modifier_options
for each row
execute function private.set_updated_at();


-- ============================================================
-- ITEM ↔ MODIFIER GROUP RELATIONSHIP
-- ============================================================

create table public.menu_item_modifier_groups (
  restaurant_id uuid not null,

  menu_item_id uuid not null,

  modifier_group_id uuid not null,

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default now(),

  primary key (
    menu_item_id,
    modifier_group_id
  ),

  foreign key (menu_item_id, restaurant_id)
    references public.menu_items(id, restaurant_id)
    on delete cascade,

  foreign key (modifier_group_id, restaurant_id)
    references public.modifier_groups(id, restaurant_id)
    on delete cascade
);

create index menu_item_modifier_groups_item_restaurant_idx
on public.menu_item_modifier_groups (
  menu_item_id,
  restaurant_id
);

create index menu_item_modifier_groups_group_restaurant_idx
on public.menu_item_modifier_groups (
  modifier_group_id,
  restaurant_id
);


-- ============================================================
-- BRANCH MENU AVAILABILITY
--
-- Restaurant defines the catalogue.
-- Individual branches control availability and optional price
-- override without duplicating the menu item.
-- ============================================================

create table public.branch_menu_items (
  restaurant_id uuid not null,

  branch_id uuid not null,

  menu_item_id uuid not null,

  is_available boolean not null default true,

  price_override_minor bigint
    check (
      price_override_minor is null
      or price_override_minor >= 0
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (
    branch_id,
    menu_item_id
  ),

  foreign key (branch_id, restaurant_id)
    references public.branches(id, restaurant_id)
    on delete cascade,

  foreign key (menu_item_id, restaurant_id)
    references public.menu_items(id, restaurant_id)
    on delete cascade
);

create index branch_menu_items_branch_restaurant_idx
on public.branch_menu_items (
  branch_id,
  restaurant_id
);

create index branch_menu_items_item_restaurant_idx
on public.branch_menu_items (
  menu_item_id,
  restaurant_id
);

create index branch_menu_items_available_idx
on public.branch_menu_items (
  branch_id,
  is_available
);

create trigger branch_menu_items_set_updated_at
before update on public.branch_menu_items
for each row
execute function private.set_updated_at();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.menu_categories
enable row level security;

alter table public.menu_items
enable row level security;

alter table public.menu_item_variants
enable row level security;

alter table public.modifier_groups
enable row level security;

alter table public.modifier_options
enable row level security;

alter table public.menu_item_modifier_groups
enable row level security;

alter table public.branch_menu_items
enable row level security;


-- ============================================================
-- AUTHENTICATED RESTAURANT MEMBER READ POLICIES
--
-- Public marketplace access will be added separately through
-- deliberately safe public queries/views/RPCs.
-- ============================================================

create policy menu_categories_member_select
on public.menu_categories
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


create policy menu_items_member_select
on public.menu_items
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


create policy menu_item_variants_member_select
on public.menu_item_variants
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


create policy modifier_groups_member_select
on public.modifier_groups
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


create policy modifier_options_member_select
on public.modifier_options
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


create policy menu_item_modifier_groups_member_select
on public.menu_item_modifier_groups
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


create policy branch_menu_items_member_select
on public.branch_menu_items
for select
to authenticated
using (
  private.is_restaurant_member(restaurant_id)
);


-- ============================================================
-- EXPLICIT GRANTS
--
-- No anonymous access to raw catalogue tables.
-- No client-side writes yet.
-- ============================================================

revoke all
on table public.menu_categories
from anon, authenticated;

revoke all
on table public.menu_items
from anon, authenticated;

revoke all
on table public.menu_item_variants
from anon, authenticated;

revoke all
on table public.modifier_groups
from anon, authenticated;

revoke all
on table public.modifier_options
from anon, authenticated;

revoke all
on table public.menu_item_modifier_groups
from anon, authenticated;

revoke all
on table public.branch_menu_items
from anon, authenticated;


grant select
on table
  public.menu_categories,
  public.menu_items,
  public.menu_item_variants,
  public.modifier_groups,
  public.modifier_options,
  public.menu_item_modifier_groups,
  public.branch_menu_items
to authenticated;


-- ============================================================
-- END CATALOGUE FOUNDATION
-- ============================================================