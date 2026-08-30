import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, phone, preferred_language",
    )
    .eq("id", userId)
    .maybeSingle();

  const email =
    typeof data.claims.email === "string"
      ? data.claims.email
      : "";

  const language =
    profile?.preferred_language === "ur"
      ? "Urdu"
      : "English";

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <PageContainer>
          <Card className="mx-auto max-w-2xl p-6 sm:p-8">
            <p className="text-sm font-semibold text-brand-strong">
              Your account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Manage your KhaoKoala customer account.
            </p>

            <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Display name
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {profile?.display_name || "Not added yet"}
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-foreground">
                  {email}
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Phone
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {profile?.phone || "Not added yet"}
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Preferred language
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  {language}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/account/profile"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground transition hover:brightness-95"
              >
                Edit profile
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
              >
                Back to marketplace
              </Link>
            </div>

            <div className="my-8 border-t border-border" />

            <form action="/auth/signout" method="post">
              <Button
                type="submit"
                variant="secondary"
              >
                Sign out
              </Button>
            </form>
          </Card>
        </PageContainer>
      </main>
    </div>
  );
}