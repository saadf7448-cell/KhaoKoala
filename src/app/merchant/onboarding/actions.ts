"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function value(
  formData: FormData,
  key: string,
) {
  const item = formData.get(key);

  return typeof item === "string"
    ? item.trim()
    : "";
}

export async function createRestaurant(
  formData: FormData,
) {
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

  const name = value(
    formData,
    "name",
  );

  const businessEmail = value(
    formData,
    "business_email",
  ).toLowerCase();

  const whatsappNumber = value(
    formData,
    "whatsapp_number",
  );

  const branchName = value(
    formData,
    "branch_name",
  );

  const addressLine1 = value(
    formData,
    "address_line_1",
  );

  const area = value(
    formData,
    "area",
  );

  const city = value(
    formData,
    "city",
  );

  if (
    name.length < 2 ||
    name.length > 120
  ) {
    redirect(
      "/merchant/onboarding?error=restaurant-name",
    );
  }

  if (
    branchName.length < 2 ||
    branchName.length > 120
  ) {
    redirect(
      "/merchant/onboarding?error=branch-name",
    );
  }

  if (
    !businessEmail ||
    !businessEmail.includes("@")
  ) {
    redirect(
      "/merchant/onboarding?error=email",
    );
  }

  if (!whatsappNumber) {
    redirect(
      "/merchant/onboarding?error=whatsapp",
    );
  }

  if (!addressLine1) {
    redirect(
      "/merchant/onboarding?error=address",
    );
  }

  if (!city) {
    redirect(
      "/merchant/onboarding?error=city",
    );
  }

  const {
    error,
  } = await supabase.rpc(
    "create_restaurant_onboarding",
    {
      p_name: name,
      p_business_email:
        businessEmail,

      p_whatsapp_number:
        whatsappNumber,

      p_branch_name:
        branchName,

      p_address_line_1:
        addressLine1,

      p_area:
        area || null,

      p_city:
        city,
    },
  );

  if (error) {
    redirect(
      `/merchant/onboarding?error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath(
    "/merchant",
    "layout",
  );

  redirect("/merchant/dashboard");
}