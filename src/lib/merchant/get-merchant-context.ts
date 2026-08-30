import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type {
  MerchantContext,
  MerchantRole,
} from "@/types/merchant";

const merchantRoles: MerchantRole[] = [
  "owner",
  "manager",
  "cashier",
  "kitchen",
  "waiter",
];

function isMerchantRole(
  value: string,
): value is MerchantRole {
  return merchantRoles.includes(
    value as MerchantRole,
  );
}

export async function getMerchantContext(): Promise<
  MerchantContext | null
> {
  const supabase = await createClient();

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getClaims();

  if (
    authError ||
    !authData?.claims?.sub
  ) {
    redirect("/login");
  }

  const userId = authData.claims.sub;

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from("restaurant_memberships")
    .select(
      "restaurant_id, role, status, created_at",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(
      "Unable to load merchant membership.",
    );
  }

  if (!membership) {
    return null;
  }

  if (!isMerchantRole(membership.role)) {
    throw new Error(
      "Invalid merchant role.",
    );
  }

  const {
    data: restaurant,
    error: restaurantError,
  } = await supabase
    .from("restaurants")
    .select(
      "id, name, slug, business_email, whatsapp_number, status, is_published, default_currency",
    )
    .eq(
      "id",
      membership.restaurant_id,
    )
    .maybeSingle();

  if (
    restaurantError ||
    !restaurant
  ) {
    throw new Error(
      "Unable to load restaurant.",
    );
  }

  const {
    data: branch,
    error: branchError,
  } = await supabase
    .from("branches")
    .select(
      "id, name, slug, phone, email, address_line_1, address_line_2, area, city, postal_code, status",
    )
    .eq(
      "restaurant_id",
      membership.restaurant_id,
    )
    .neq("status", "archived")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (branchError) {
    throw new Error(
      "Unable to load restaurant branch.",
    );
  }

  return {
    userId,

    restaurantId:
      membership.restaurant_id,

    role: membership.role,

    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,

      businessEmail:
        restaurant.business_email,

      whatsappNumber:
        restaurant.whatsapp_number,

      status: restaurant.status,

      isPublished:
        restaurant.is_published,

      defaultCurrency:
        restaurant.default_currency,
    },

    branch: branch
      ? {
          id: branch.id,
          name: branch.name,
          slug: branch.slug,

          phone: branch.phone,
          email: branch.email,

          addressLine1:
            branch.address_line_1,

          addressLine2:
            branch.address_line_2,

          area: branch.area,
          city: branch.city,

          postalCode:
            branch.postal_code,

          status: branch.status,
        }
      : null,
  };
}