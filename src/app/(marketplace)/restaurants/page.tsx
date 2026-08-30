import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/ui/page-container";

export default function RestaurantsPage() {
  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <EmptyState
          eyebrow="Restaurants"
          title="No restaurants are published yet."
          description="Real restaurants will appear here after they complete their profiles and publish their marketplace listings."
        />
      </PageContainer>
    </main>
  );
}