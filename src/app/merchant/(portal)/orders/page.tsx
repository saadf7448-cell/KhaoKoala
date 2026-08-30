import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";

export default function MerchantOrdersPage() {
  return (
    <main className="py-8 sm:py-10">
      <PageContainer>
        <p className="text-sm font-semibold text-brand-strong">
          Restaurant orders
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>

        <Card className="mt-8 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Order infrastructure is not
            connected yet
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
            We will connect this section
            when we create the real
            ordering database in the next
            phase.
          </p>
        </Card>
      </PageContainer>
    </main>
  );
}