import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { getMerchantContext } from "@/lib/merchant/get-merchant-context";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MerchantDashboardPage() {
  const merchant =
    await getMerchantContext();

  if (!merchant) {
    redirect("/merchant/onboarding");
  }

  const supabase =
    await createClient();

  const [
    categoriesResult,
    itemsResult,
    branchesResult,
  ] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "restaurant_id",
        merchant.restaurantId,
      ),

    supabase
      .from("menu_items")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "restaurant_id",
        merchant.restaurantId,
      )
      .neq("status", "archived"),

    supabase
      .from("branches")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "restaurant_id",
        merchant.restaurantId,
      )
      .neq("status", "archived"),
  ]);

  if (
    categoriesResult.error ||
    itemsResult.error ||
    branchesResult.error
  ) {
    throw new Error(
      "Unable to load merchant dashboard.",
    );
  }

  const statistics = [
    {
      label: "Menu categories",
      value:
        categoriesResult.count ?? 0,
    },
    {
      label: "Menu items",
      value: itemsResult.count ?? 0,
    },
    {
      label: "Branches",
      value:
        branchesResult.count ?? 0,
    },
  ];

  return (
    <main className="py-8 sm:py-10">
      <PageContainer>
        <div>
          <p className="text-sm font-semibold text-brand-strong">
            Restaurant overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {merchant.restaurant.name}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium capitalize text-muted">
              {
                merchant.restaurant
                  .status
              }
            </span>

            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              {merchant.restaurant
                .isPublished
                ? "Published"
                : "Not published"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {statistics.map(
            (statistic) => (
              <Card
                key={statistic.label}
                className="p-5"
              >
                <p className="text-sm text-muted">
                  {statistic.label}
                </p>

                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {statistic.value}
                </p>
              </Card>
            ),
          )}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-semibold text-foreground">
              Restaurant
            </p>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-muted">
                  Business email
                </dt>

                <dd className="mt-1 font-medium text-foreground">
                  {merchant.restaurant
                    .businessEmail ??
                    "Not added"}
                </dd>
              </div>

              <div>
                <dt className="text-muted">
                  WhatsApp
                </dt>

                <dd className="mt-1 font-medium text-foreground">
                  {merchant.restaurant
                    .whatsappNumber ??
                    "Not added"}
                </dd>
              </div>

              <div>
                <dt className="text-muted">
                  Currency
                </dt>

                <dd className="mt-1 font-medium text-foreground">
                  {
                    merchant.restaurant
                      .defaultCurrency
                  }
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-foreground">
              Current branch
            </p>

            {merchant.branch ? (
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">
                    Branch
                  </dt>

                  <dd className="mt-1 font-medium text-foreground">
                    {
                      merchant.branch
                        .name
                    }
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">
                    Address
                  </dt>

                  <dd className="mt-1 font-medium text-foreground">
                    {[
                      merchant.branch
                        .addressLine1,

                      merchant.branch
                        .area,

                      merchant.branch
                        .city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm text-muted">
                No active branch found.
              </p>
            )}
          </Card>
        </div>
      </PageContainer>
    </main>
  );
}