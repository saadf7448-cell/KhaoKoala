import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-surface",
        "shadow-[0_12px_40px_rgba(35,30,20,0.05)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}