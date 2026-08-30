import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/ui/page-container";

export default function LocationPage() {
  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <EmptyState
          eyebrow="Location"
          title="Choose where you want to order."
          description="Available cities and delivery areas will appear here after real restaurant service areas are connected."
        />
      </PageContainer>
    </main>
  );
}