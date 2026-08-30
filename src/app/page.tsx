import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { MarketplaceEmptyState } from "@/components/marketplace/marketplace-empty-state";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main>
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-brand-strong">
              {siteConfig.tagline}
            </p>

            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-foreground sm:text-5xl">
              Good food, made simpler.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Discover food for pickup, restaurant-managed delivery, or dine-in
              QR ordering through one clean marketplace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/restaurants"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground transition hover:brightness-95"
              >
                Browse restaurants
              </Link>

              <Link
                href="/deals"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
              >
                View deals
              </Link>
            </div>
          </div>
        </section>

        <MarketplaceEmptyState />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center px-4 text-sm text-muted sm:px-6 lg:px-8">
          {siteConfig.name} · {siteConfig.tagline}
        </div>
      </footer>
    </div>
  );
}