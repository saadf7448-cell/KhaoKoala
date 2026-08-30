import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/ui/page-container";

export default function SearchPage() {
  return (
    <main className="py-12 sm:py-16">
      <PageContainer>
        <EmptyState
          eyebrow="Search"
          title="Search will use the live marketplace catalogue."
          description="Restaurant and dish results will appear here after real marketplace data is available."
        />
      </PageContainer>
    </main>
  );
}