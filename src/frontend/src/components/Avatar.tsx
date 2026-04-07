import { cn } from "@/lib/utils";
import type { PresenceStatus } from "../types";

interface AvatarProps {
  name: string;
  src?: string;
  presence?: PresenceStatus;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

const dotSizeClasses = {
  xs: "size-2 border",
  sm: "size-2.5 border",
  md: "size-3 border-2",
  lg: "size-4 border-2",
};

const presenceColorClasses = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/50",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-primary/30 text-primary",
    "bg-purple-500/20 text-purple-300",
    "bg-rose-500/20 text-rose-300",
    "bg-amber-500/20 text-amber-300",
    "bg-emerald-500/20 text-emerald-300",
    "bg-sky-500/20 text-sky-300",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function Avatar({
  name,
  src,
  presence,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(name || "?");
  const colorClass = getColorFromName(name || "?");

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-medium overflow-hidden",
          sizeClasses[size],
          !src && colorClass,
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {presence !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-card",
            dotSizeClasses[size],
            presenceColorClasses[presence],
          )}
          aria-label={`Status: ${presence}`}
        />
      )}
    </div>
  );
}
