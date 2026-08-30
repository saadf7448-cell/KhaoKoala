import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";

import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="py-12 sm:py-20">
      <PageContainer>
        <Card className="mx-auto max-w-md p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-strong">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            Sign in to KhaoKoala
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to manage your account and orders.
          </p>

          {params.error ? (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {params.error}
            </div>
          ) : null}

          {params.message ? (
            <div className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
              {params.message}
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
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              formAction={login}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground transition hover:brightness-95"
            >
              Sign in
            </button>
          </form>

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