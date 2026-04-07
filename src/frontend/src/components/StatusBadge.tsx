import { cn } from "@/lib/utils";
import type { PresenceStatus } from "../types";

interface StatusBadgeProps {
  presence: PresenceStatus;
  className?: string;
  showLabel?: boolean;
}

const statusConfig = {
  online: { color: "bg-emerald-500", label: "Online" },
  away: { color: "bg-amber-500", label: "Away" },
  offline: { color: "bg-muted-foreground/40", label: "Offline" },
};

export function StatusBadge({
  presence,
  className,
  showLabel = false,
}: StatusBadgeProps) {
  const config = statusConfig[presence] ?? statusConfig.offline;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("size-2 rounded-full", config.color)} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </span>
  );
}
