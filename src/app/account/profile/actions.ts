"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function readText(
  value: FormDataEntryValue | null,
) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function updateProfile(
  formData: FormData,
) {
  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  const displayName = readText(
    formData.get("display_name"),
  );

  const phone = readText(
    formData.get("phone"),
  );

  const preferredLanguage = readText(
    formData.get("preferred_language"),
  );

  if (displayName.length > 80) {
    redirect("/account/profile?error=name");
  }

  if (phone.length > 32) {
    redirect("/account/profile?error=phone");
  }

  const phonePattern =
    /^\+?[0-9][0-9\s()-]{6,30}$/;

  if (
    phone &&
    !phonePattern.test(phone)
  ) {
    redirect("/account/profile?error=phone");
  }

  if (
    preferredLanguage !== "en" &&
    preferredLanguage !== "ur"
  ) {
    redirect("/account/profile?error=language");
  }

  const {
    data: updatedProfile,
    error: updateError,
  } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      phone: phone || null,
      preferred_language: preferredLanguage,
    })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (
    updateError ||
    !updatedProfile
  ) {
    redirect("/account/profile?error=save");
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");

  redirect("/account/profile?saved=1");
}