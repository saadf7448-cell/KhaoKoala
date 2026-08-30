import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";

export default function SignupPage() {
  return (
    <main className="py-12 sm:py-20">
      <PageContainer>
        <Card className="mx-auto max-w-lg p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-strong">
            Customer account
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            Create your KhaoKoala account
          </h1>

          <p className="mt-3 leading-7 text-muted">
            Registration will become available when the new Supabase
            authentication system is connected.
          </p>

          <p className="mt-6 text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-strong underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </PageContainer>
    </main>
  );
}