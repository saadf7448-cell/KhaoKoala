import { SiteHeader } from "@/components/layout/site-header";
import { MarketplaceEmptyState } from "@/components/marketplace/marketplace-empty-state";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main>
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold tracking-wide text-brand-strong">
              {siteConfig.tagline}
            </p>

            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
              Good food, made simpler.
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg">
              Discover food for pickup, restaurant-managed delivery, or dine-in
              QR ordering through one clean marketplace.
            </p>
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
