export function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-brand"
      >
        <svg
          viewBox="0 0 48 48"
          className="size-8"
          role="presentation"
        >
          <circle cx="12" cy="14" r="7" fill="var(--brand-soft)" />
          <circle cx="36" cy="14" r="7" fill="var(--brand-soft)" />

          <circle cx="24" cy="25" r="17" fill="var(--surface)" />

          <circle cx="18" cy="23" r="2.1" fill="var(--foreground)" />
          <circle cx="30" cy="23" r="2.1" fill="var(--foreground)" />

          <ellipse
            cx="24"
            cy="29"
            rx="4.8"
            ry="4"
            fill="var(--foreground)"
          />

          <path
            d="M20 34.5C21.6 36.3 26.4 36.3 28 34.5"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="text-lg font-semibold tracking-[-0.035em] text-foreground">
        KhaoKoala
      </span>
    </div>
  );
}
