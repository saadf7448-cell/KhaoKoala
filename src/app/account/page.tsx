import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";
import { createClient } from "@/lib/supabase/server";

import { updateProfile } from "./actions";

export const dynamic = "force-dynamic";

type AccountPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  name: "Display name is too long.",
  phone: "Enter a valid phone number.",
  language: "Choose a valid language.",
  save: "We could not save your profile. Please try again.",
};

export default async function AccountPage({
  searchParams,
}: AccountPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, phone, preferred_language")
    .eq("id", userId)
    .maybeSingle();

  const email =
    typeof data.claims.email === "string"
      ? data.claims.email
      : "";

  const errorMessage = params.error
    ? errorMessages[params.error] ??
      "Something went wrong. Please try again."
    : null;

  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <Card className="mx-auto max-w-2xl p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-strong">
            Your account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            KhaoKoala account
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Keep your account details up to date for ordering
            and restaurant communication.
          </p>

          {params.saved === "1" ? (
            <div className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm font-medium text-foreground">
              Profile saved successfully.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {profileError ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              We could not load your profile information.
            </div>
          ) : null}

          <form action={updateProfile} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled
              />

              <p className="mt-2 text-xs text-muted">
                Your verified account email cannot be changed here.
              </p>
            </div>

            <div>
              <label
                htmlFor="display_name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Display name
              </label>

              <Input
                id="display_name"
                name="display_name"
                type="text"
                defaultValue={profile?.display_name ?? ""}
                placeholder="Your name"
                autoComplete="name"
                maxLength={80}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Phone
              </label>

              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile?.phone ?? ""}
                placeholder="+92 300 1234567"
                autoComplete="tel"
                maxLength={32}
              />

              <p className="mt-2 text-xs text-muted">
                Used for order and delivery communication.
              </p>
            </div>

            <div>
              <label
                htmlFor="preferred_language"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Preferred language
              </label>

              <select
                id="preferred_language"
                name="preferred_language"
                defaultValue={profile?.preferred_language ?? "en"}
                className="min-h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              Save profile
            </Button>
          </form>

          <div className="my-8 border-t border-border" />

          <form action="/auth/signout" method="post">
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </Card>
      </PageContainer>
    </main>
  );
}