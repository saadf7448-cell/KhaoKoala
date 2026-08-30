-- ============================================================
-- KHAOKOALA
-- MERCHANT ONBOARDING FOUNDATION
-- ============================================================

create or replace function public.create_restaurant_onboarding(
    p_name text,
    p_business_email text,
    p_whatsapp_number text,
    p_branch_name text,
    p_address_line_1 text,
    p_area text,
    p_city text
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
    v_user_id uuid;
    v_restaurant_id uuid;

    v_restaurant_slug text;
    v_restaurant_base_slug text;

    v_branch_slug text;
begin
    v_user_id := auth.uid();

    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    if not exists (
        select 1
        from public.profiles
        where id = v_user_id
    ) then
        raise exception 'User profile not found';
    end if;

    p_name := trim(p_name);
    p_business_email := lower(trim(p_business_email));
    p_whatsapp_number := trim(p_whatsapp_number);
    p_branch_name := trim(p_branch_name);
    p_address_line_1 := trim(p_address_line_1);
    p_area := nullif(trim(p_area), '');
    p_city := trim(p_city);

    if char_length(p_name) < 2
       or char_length(p_name) > 120 then
        raise exception 'Restaurant name must be between 2 and 120 characters';
    end if;

    if char_length(p_branch_name) < 2
       or char_length(p_branch_name) > 120 then
        raise exception 'Branch name must be between 2 and 120 characters';
    end if;

    if p_business_email = ''
       or position('@' in p_business_email) <= 1 then
        raise exception 'A valid business email is required';
    end if;

    if p_whatsapp_number = '' then
        raise exception 'WhatsApp number is required';
    end if;

    if p_address_line_1 = '' then
        raise exception 'Address is required';
    end if;

    if p_city = '' then
        raise exception 'City is required';
    end if;

    v_restaurant_base_slug :=
        trim(
            both '-'
            from regexp_replace(
                lower(p_name),
                '[^a-z0-9]+',
                '-',
                'g'
            )
        );

    if v_restaurant_base_slug = '' then
        v_restaurant_base_slug := 'restaurant';
    end if;

    v_restaurant_slug := v_restaurant_base_slug;

    while exists (
        select 1
        from public.restaurants
        where slug = v_restaurant_slug
    ) loop
        v_restaurant_slug :=
            v_restaurant_base_slug
            || '-'
            || substr(
                replace(
                    extensions.gen_random_uuid()::text,
                    '-',
                    ''
                ),
                1,
                6
            );
    end loop;

    insert into public.restaurants (
        name,
        slug,
        business_email,
        whatsapp_number,
        created_by
    )
    values (
        p_name,
        v_restaurant_slug,
        p_business_email,
        p_whatsapp_number,
        v_user_id
    )
    returning id into v_restaurant_id;

    insert into public.restaurant_memberships (
        restaurant_id,
        user_id,
        role,
        status,
        created_by
    )
    values (
        v_restaurant_id,
        v_user_id,
        'owner',
        'active',
        v_user_id
    );

    v_branch_slug :=
        trim(
            both '-'
            from regexp_replace(
                lower(p_branch_name),
                '[^a-z0-9]+',
                '-',
                'g'
            )
        );

    if v_branch_slug = '' then
        v_branch_slug := 'branch';
    end if;

    insert into public.branches (
        restaurant_id,
        name,
        slug,
        phone,
        email,
        address_line_1,
        area,
        city
    )
    values (
        v_restaurant_id,
        p_branch_name,
        v_branch_slug,
        p_whatsapp_number,
        p_business_email,
        p_address_line_1,
        p_area,
        p_city
    );

    return v_restaurant_id;
end;
$$;

revoke all
on function public.create_restaurant_onboarding(
    text,
    text,
    text,
    text,
    text,
    text,
    text
)
from public;

revoke all
on function public.create_restaurant_onboarding(
    text,
    text,
    text,
    text,
    text,
    text,
    text
)
from anon;

grant execute
on function public.create_restaurant_onboarding(
    text,
    text,
    text,
    text,
    text,
    text,
    text
)
to authenticated;