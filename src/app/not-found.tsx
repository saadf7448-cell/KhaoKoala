import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main className="py-16 sm:py-24">
        <PageContainer>
          <Card className="mx-auto max-w-2xl p-8 text-center sm:p-12">
            <p className="text-sm font-semibold text-brand-strong">
              404
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
              We couldn&apos;t find that page.
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-muted">
              The page may have moved, the link may be incorrect, or the
              content may no longer be available.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground"
              >
                Go home
              </Link>

              <Link
                href="/restaurants"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground"
              >
                Restaurants
              </Link>
            </div>
          </Card>
        </PageContainer>
      </main>
    </div>
  );
}