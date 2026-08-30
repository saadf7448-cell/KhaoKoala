import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/ui/page-container";

export default function CartPage() {
  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <EmptyState
          eyebrow="Your cart"
          title="Your cart is empty."
          description="Items you add from a real published restaurant will appear here."
        />
      </PageContainer>
    </main>
  );
}