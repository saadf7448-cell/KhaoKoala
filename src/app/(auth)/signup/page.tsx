import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";

import { signup } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({
  searchParams,
}: SignupPageProps) {
  const params = await searchParams;

  return (
    <main className="py-12 sm:py-20">
      <PageContainer>
        <Card className="mx-auto max-w-md p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-strong">
            Customer account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            Create your KhaoKoala account
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Create an account to order and track your purchases.
          </p>

          {params.error ? (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {params.error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Confirm password
              </label>

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              formAction={signup}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground transition hover:brightness-95"
            >
              Create account
            </button>
          </form>

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