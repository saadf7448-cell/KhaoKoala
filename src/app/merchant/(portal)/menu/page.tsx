import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { getMerchantContext } from "@/lib/merchant/get-merchant-context";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatPrice(
  minor: number | string,
) {
  const value =
    Number(minor) / 100;

  return new Intl.NumberFormat(
    "en-PK",
    {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

export default async function MerchantMenuPage() {
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
  ] = await Promise.all([
    supabase
      .from("menu_categories")
      .select(
        "id, name, description, sort_order, is_active",
      )
      .eq(
        "restaurant_id",
        merchant.restaurantId,
      )
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("menu_items")
      .select(
        "id, category_id, name, description, base_price_minor, status, is_published, sort_order",
      )
      .eq(
        "restaurant_id",
        merchant.restaurantId,
      )
      .neq("status", "archived")
      .order("sort_order", {
        ascending: true,
      }),
  ]);

  if (
    categoriesResult.error ||
    itemsResult.error
  ) {
    throw new Error(
      "Unable to load restaurant menu.",
    );
  }

  const categories =
    categoriesResult.data ?? [];

  const items =
    itemsResult.data ?? [];

  return (
    <main className="py-8 sm:py-10">
      <PageContainer>
        <div>
          <p className="text-sm font-semibold text-brand-strong">
            Restaurant menu
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Menu
          </h1>

          <p className="mt-3 text-sm text-muted">
            Your real menu data from
            KhaoKoala.
          </p>
        </div>

        {categories.length === 0 ? (
          <Card className="mt-8 p-8 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              No menu categories yet
            </h2>

            <p className="mt-2 text-sm text-muted">
              Your restaurant does not
              currently have any menu
              categories.
            </p>
          </Card>
        ) : (
          <div className="mt-8 space-y-6">
            {categories.map(
              (category) => {
                const categoryItems =
                  items.filter(
                    (item) =>
                      item.category_id ===
                      category.id,
                  );

                return (
                  <Card
                    key={category.id}
                    className="overflow-hidden"
                  >
                    <div className="border-b border-border p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {category.name}
                          </h2>

                          {category.description ? (
                            <p className="mt-1 text-sm text-muted">
                              {
                                category.description
                              }
                            </p>
                          ) : null}
                        </div>

                        <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                          {
                            categoryItems.length
                          }{" "}
                          items
                        </span>
                      </div>
                    </div>

                    {categoryItems.length ===
                    0 ? (
                      <div className="p-5 text-sm text-muted sm:p-6">
                        No items in this
                        category.
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {categoryItems.map(
                          (item) => (
                            <div
                              key={item.id}
                              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                            >
                              <div>
                                <p className="font-semibold text-foreground">
                                  {item.name}
                                </p>

                                {item.description ? (
                                  <p className="mt-1 text-sm text-muted">
                                    {
                                      item.description
                                    }
                                  </p>
                                ) : null}

                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="text-xs capitalize text-muted">
                                    {item.status}
                                  </span>

                                  <span className="text-xs text-muted">
                                    {item.is_published
                                      ? "Published"
                                      : "Not published"}
                                  </span>
                                </div>
                              </div>

                              <p className="shrink-0 font-semibold text-foreground">
                                {formatPrice(
                                  item.base_price_minor,
                                )}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </Card>
                );
              },
            )}
          </div>
        )}
      </PageContainer>
    </main>
  );
}