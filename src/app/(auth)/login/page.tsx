import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";

export default function LoginPage() {
  return (
    <main className="py-12 sm:py-20">
      <PageContainer>
        <Card className="mx-auto max-w-lg p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-strong">Account</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            Sign in to KhaoKoala
          </h1>

          <p className="mt-3 leading-7 text-muted">
            Secure customer authentication will be enabled when Supabase Auth is
            connected in the authentication phase.
          </p>

          <p className="mt-6 text-sm text-muted">
            New to KhaoKoala?{" "}
            <Link
              href="/signup"
              className="font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </PageContainer>
    </main>
  );
}