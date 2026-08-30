import Link from "next/link";
import type { ReactNode } from "react";

import { PageContainer } from "@/components/ui/page-container";

type MerchantShellProps = {
  restaurantName: string;
  role: string;
  children: ReactNode;
};

const navigation = [
  {
    href: "/merchant/dashboard",
    label: "Overview",
  },
  {
    href: "/merchant/menu",
    label: "Menu",
  },
  {
    href: "/merchant/orders",
    label: "Orders",
  },
  {
    href: "/merchant/settings",
    label: "Settings",
  },
];

export function MerchantShell({
  restaurantName,
  role,
  children,
}: MerchantShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <PageContainer>
          <div className="flex min-h-16 items-center justify-between gap-4">
            <div className="min-w-0">
              <Link
                href="/merchant/dashboard"
                className="block truncate text-base font-semibold text-foreground"
              >
                {restaurantName}
              </Link>

              <p className="mt-0.5 text-xs capitalize text-muted">
                {role}
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
            >
              Marketplace
            </Link>
          </div>
        </PageContainer>
      </header>

      <div className="border-b border-border bg-surface">
        <PageContainer>
          <nav
            aria-label="Merchant navigation"
            className="flex gap-1 overflow-x-auto py-2"
          >
            {navigation.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </PageContainer>
      </div>

      {children}
    </div>
  );
}