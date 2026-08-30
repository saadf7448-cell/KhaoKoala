import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";
import { getMerchantContext } from "@/lib/merchant/get-merchant-context";
import { createClient } from "@/lib/supabase/server";

import { createRestaurant } from "./actions";

export const dynamic = "force-dynamic";

type MerchantOnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<
  string,
  string
> = {
  "restaurant-name":
    "Enter a valid restaurant name.",

  "branch-name":
    "Enter a valid branch name.",

  email:
    "Enter a valid business email.",

  whatsapp:
    "Enter a WhatsApp number.",

  address:
    "Enter your restaurant address.",

  city:
    "Enter your city.",
};

export default async function MerchantOnboardingPage({
  searchParams,
}: MerchantOnboardingPageProps) {
  const merchant =
    await getMerchantContext();

  if (merchant) {
    redirect("/merchant/dashboard");
  }

  const params = await searchParams;

  const supabase =
    await createClient();

  const { data } =
    await supabase.auth.getClaims();

  const accountEmail =
    typeof data?.claims?.email ===
    "string"
      ? data.claims.email
      : "";

  const errorMessage =
    params.error
      ? errorMessages[params.error] ??
        params.error
      : null;

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main className="py-10 sm:py-16">
        <PageContainer>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <p className="text-sm font-semibold text-brand-strong">
                KhaoKoala for restaurants
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Create your restaurant
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Add your real business
                information to start setting
                up your restaurant on
                KhaoKoala.
              </p>
            </div>

            <Card className="p-6 sm:p-8">
              {errorMessage ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <form
                action={
                  createRestaurant
                }
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Restaurant name
                  </label>

                  <Input
                    id="name"
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="organization"
                    placeholder="Enter restaurant name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="business_email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Business email
                  </label>

                  <Input
                    id="business_email"
                    name="business_email"
                    type="email"
                    required
                    defaultValue={
                      accountEmail
                    }
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="whatsapp_number"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    WhatsApp number
                  </label>

                  <Input
                    id="whatsapp_number"
                    name="whatsapp_number"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Enter WhatsApp number"
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-sm font-semibold text-foreground">
                    First branch
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    Add the location you
                    currently operate from.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="branch_name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Branch name
                  </label>

                  <Input
                    id="branch_name"
                    name="branch_name"
                    required
                    maxLength={120}
                    placeholder="Enter branch name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address_line_1"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Address
                  </label>

                  <Input
                    id="address_line_1"
                    name="address_line_1"
                    required
                    autoComplete="street-address"
                    placeholder="Enter restaurant address"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="area"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Area
                    </label>

                    <Input
                      id="area"
                      name="area"
                      placeholder="Enter area"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      City
                    </label>

                    <Input
                      id="city"
                      name="city"
                      required
                      autoComplete="address-level2"
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-foreground transition hover:bg-[#e79d00]"
                  >
                    Create restaurant
                  </button>

                  <Link
                    href="/"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}