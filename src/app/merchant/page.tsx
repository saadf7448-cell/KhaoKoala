import { redirect } from "next/navigation";

import { getMerchantContext } from "@/lib/merchant/get-merchant-context";

export const dynamic = "force-dynamic";

export default async function MerchantPage() {
  const merchant =
    await getMerchantContext();

  if (!merchant) {
    redirect("/merchant/onboarding");
  }

  redirect("/merchant/dashboard");
}