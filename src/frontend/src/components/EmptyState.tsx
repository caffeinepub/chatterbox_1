import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-ocid="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 px-8 text-center",
        className,
      )}
    >
      {icon && (
        <div className="size-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/60 mb-2">
          {icon}
        </div>
      )}
      <h3 className="font-display font-semibold text-base text-foreground">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
