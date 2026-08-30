import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { MerchantShell } from "@/components/merchant/shared/merchant-shell";
import { getMerchantContext } from "@/lib/merchant/get-merchant-context";

export const dynamic = "force-dynamic";

export default async function MerchantPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const merchant =
    await getMerchantContext();

  if (!merchant) {
    redirect("/merchant/onboarding");
  }

  return (
    <MerchantShell
      restaurantName={
        merchant.restaurant.name
      }
      role={merchant.role}
    >
      {children}
    </MerchantShell>
  );
}