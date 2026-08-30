"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  );

  if (!email) {
    redirect("/signup?error=Please%20enter%20a%20valid%20email.");
  }

  if (password.length < 8) {
    redirect(
      "/signup?error=Password%20must%20contain%20at%20least%208%20characters.",
    );
  }

  if (password !== confirmPassword) {
    redirect("/signup?error=Passwords%20do%20not%20match.");
  }

  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ?? "http://localhost:3000";

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(
    "/login?message=Check%20your%20email%20to%20confirm%20your%20KhaoKoala%20account.",
  );
}