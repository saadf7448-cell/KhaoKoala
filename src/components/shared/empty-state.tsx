import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  eyebrow,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {icon ? (
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-soft">
            {icon}
          </div>
        ) : null}

        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-1 text-sm font-semibold text-brand-strong">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}