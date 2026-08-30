export function MarketplaceEmptyState() {
  return (
    <section
      aria-labelledby="marketplace-empty-title"
      className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="rounded-[28px] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(35,30,20,0.06)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h16" />
              <path d="M5.5 10 7 4h10l1.5 6" />
              <path d="M6 10v9h12v-9" />
              <path d="M9 19v-5h6v5" />
            </svg>
          </div>

          <div className="max-w-2xl">
            <p className="mb-1 text-sm font-semibold text-brand-strong">
              Marketplace
            </p>

            <h2
              id="marketplace-empty-title"
              className="text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl"
            >
              No restaurants are available yet.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Restaurants will appear here only after they publish their real
              profiles and menus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
