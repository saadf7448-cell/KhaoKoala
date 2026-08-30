import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";
import { createClient } from "@/lib/supabase/server";

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 7h15l-2 8H8L6 3H3" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export async function SiteHeader() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const signedIn = Boolean(data?.claims?.sub);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <PageContainer>
        <div className="flex min-h-16 items-center gap-3">
          <Link
            href="/"
            aria-label="KhaoKoala home"
            className="shrink-0"
          >
            <BrandMark />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="ml-3 hidden items-center gap-1 md:flex"
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
            className="ml-auto hidden w-full max-w-sm lg:block"
          >
            <label
              htmlFor="site-search"
              className="sr-only"
            >
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

          <div className="ml-auto flex items-center gap-1 lg:ml-3">
            <Link
              href="/location"
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <LocationIcon />
              <span className="hidden xl:inline">
                Location
              </span>
            </Link>

            <Link
              href={signedIn ? "/account" : "/login"}
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <UserIcon />

              <span className="hidden xl:inline">
                {signedIn ? "Account" : "Sign in"}
              </span>
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="grid size-11 place-items-center rounded-xl text-foreground transition hover:bg-surface-muted"
            >
              <CartIcon />
            </Link>

            <Link
              href="/search"
              aria-label="Search"
              className="grid size-11 place-items-center rounded-xl text-foreground transition hover:bg-surface-muted lg:hidden"
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
          className="flex gap-1 overflow-x-auto border-t border-border py-2 md:hidden"
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