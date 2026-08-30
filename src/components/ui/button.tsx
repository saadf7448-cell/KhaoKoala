import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-foreground hover:bg-[#e79d00] disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4",
        "text-sm font-semibold transition-colors",
        "focus-visible:outline-none",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}