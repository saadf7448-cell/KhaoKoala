import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "min-h-11 w-full rounded-xl border border-border bg-surface px-4",
        "text-sm text-foreground placeholder:text-muted",
        "outline-none transition",
        "focus:border-brand focus:ring-2 focus:ring-brand-soft",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      {...props}
    />
  );
}