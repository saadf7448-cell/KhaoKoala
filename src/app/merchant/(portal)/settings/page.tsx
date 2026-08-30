import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { getMerchantContext } from "@/lib/merchant/get-merchant-context";

export const dynamic = "force-dynamic";

export default async function MerchantSettingsPage() {
  const merchant =
    await getMerchantContext();

  if (!merchant) {
    redirect("/merchant/onboarding");
  }

  const restaurant =
    merchant.restaurant;

  const branch =
    merchant.branch;

  return (
    <main className="py-8 sm:py-10">
      <PageContainer>
        <div>
          <p className="text-sm font-semibold text-brand-strong">
            Restaurant management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Restaurant
            </h2>

            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-muted">
                  Name
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {restaurant.name}
                </dd>
              </div>

              <div>
                <dt className="text-muted">
                  Business email
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {restaurant.businessEmail ??
                    "Not added"}
                </dd>
              </div>

              <div>
                <dt className="text-muted">
                  WhatsApp
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {restaurant.whatsappNumber ??
                    "Not added"}
                </dd>
              </div>

              <div>
                <dt className="text-muted">
                  Status
                </dt>

                <dd className="mt-1 font-semibold capitalize text-foreground">
                  {
                    restaurant.status
                  }
                </dd>
              </div>

              <div>
                <dt className="text-muted">
                  Marketplace
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {restaurant.isPublished
                    ? "Published"
                    : "Not published"}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Branch
            </h2>

            {branch ? (
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-muted">
                    Name
                  </dt>

                  <dd className="mt-1 font-semibold text-foreground">
                    {branch.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">
                    Address
                  </dt>

                  <dd className="mt-1 font-semibold text-foreground">
                    {branch.addressLine1 ??
                      "Not added"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">
                    Area
                  </dt>

                  <dd className="mt-1 font-semibold text-foreground">
                    {branch.area ??
                      "Not added"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">
                    City
                  </dt>

                  <dd className="mt-1 font-semibold text-foreground">
                    {branch.city ??
                      "Not added"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted">
                    Status
                  </dt>

                  <dd className="mt-1 font-semibold capitalize text-foreground">
                    {
                      branch.status
                    }
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-5 text-sm text-muted">
                No active branch found.
              </p>
            )}
          </Card>
        </div>
      </PageContainer>
    </main>
  );
}