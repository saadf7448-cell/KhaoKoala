export default function Loading() {
  return (
    <main className="grid min-h-[60dvh] place-items-center px-4">
      <div
        role="status"
        className="flex flex-col items-center gap-4 text-center"
      >
        <span
          aria-hidden="true"
          className="size-9 animate-spin rounded-full border-[3px] border-brand-soft border-t-brand"
        />

        <p className="text-sm font-medium text-muted">
          Loading KhaoKoala…
        </p>

        <span className="sr-only">Loading</span>
      </div>
    </main>
  );
}