"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 text-center shadow-[0_12px_40px_rgba(35,30,20,0.05)]">
        <p className="text-sm font-semibold text-danger">
          Something went wrong
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground">
          KhaoKoala couldn&apos;t load this page.
        </h1>

        <p className="mt-4 leading-7 text-muted">
          Please try again. If the problem continues, you can return to the
          homepage.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground transition hover:brightness-95"
          >
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}