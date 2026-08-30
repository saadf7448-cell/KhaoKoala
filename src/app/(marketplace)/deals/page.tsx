import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/ui/page-container";

export default function DealsPage() {
  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <EmptyState
          eyebrow="Deals"
          title="No active deals right now."
          description="Only genuine, currently active restaurant promotions will be shown here."
        />
      </PageContainer>
    </main>
  );
}