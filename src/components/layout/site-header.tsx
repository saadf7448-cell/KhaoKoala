import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <PageContainer>
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="KhaoKoala home">
            <BrandMark />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            <Link
              href="/restaurants"
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              Restaurants
            </Link>

            <Link
              href="/deals"
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              Deals
            </Link>
          </nav>

          <form
            action="/search"
            method="get"
            role="search"
            className="hidden w-full max-w-sm lg:block"
          >
            <label htmlFor="site-search" className="sr-only">
              Search restaurants and dishes
            </label>

            <Input
              id="site-search"
              name="q"
              type="search"
              placeholder="Search restaurants or dishes"
              autoComplete="off"
            />
          </form>

          <div className="flex items-center md:hidden">
            <Link
              href="/search"
              aria-label="Search"
              className="grid size-11 place-items-center rounded-xl text-foreground transition hover:bg-surface-muted"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </Link>
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex gap-2 overflow-x-auto border-t border-border py-2 md:hidden"
        >
          <Link
            href="/restaurants"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted"
          >
            Restaurants
          </Link>

          <Link
            href="/deals"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted"
          >
            Deals
          </Link>
        </nav>
      </PageContainer>
    </header>
  );
}