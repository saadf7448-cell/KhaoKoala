import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/ui/page-container";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <main className="py-10 sm:py-14">
      <PageContainer>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground">
            Search
          </h1>

          <form action="/search" method="get" className="mt-6">
            <label htmlFor="marketplace-search" className="sr-only">
              Search restaurants and dishes
            </label>

            <Input
              id="marketplace-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search restaurants or dishes"
              autoFocus
            />
          </form>

          <div className="mt-8">
            <EmptyState
              eyebrow={query ? "Search results" : "Marketplace search"}
              title={
                query
                  ? `No results for “${query}” yet.`
                  : "Search the live marketplace catalogue."
              }
              description={
                query
                  ? "Matching restaurants and dishes will appear here when real published marketplace data is available."
                  : "Enter a restaurant or dish name. Results will come only from real published marketplace data."
              }
            />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}