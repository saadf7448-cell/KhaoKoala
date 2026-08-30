import { redirect } from "next/navigation";

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
    .select("display_name, phone, preferred_language")
    .eq("id", userId)
    .maybeSingle();

  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <Card className="mx-auto max-w-2xl p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-strong">
            Your account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            KhaoKoala account
          </h1>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-muted">Email</p>
              <p className="mt-1 font-medium text-foreground">
                {typeof data.claims.email === "string"
                  ? data.claims.email
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-muted">Display name</p>
              <p className="mt-1 font-medium text-foreground">
                {profile?.display_name || "Not added yet"}
              </p>
            </div>

            <div>
              <p className="text-muted">Phone</p>
              <p className="mt-1 font-medium text-foreground">
                {profile?.phone || "Not added yet"}
              </p>
            </div>
          </div>

          <form
            action="/auth/signout"
            method="post"
            className="mt-8"
          >
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
            >
              Sign out
            </button>
          </form>
        </Card>
      </PageContainer>
    </main>
  );
}