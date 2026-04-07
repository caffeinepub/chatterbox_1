import { cn } from "@/lib/utils";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export function UnreadBadge({ count, className }: UnreadBadgeProps) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none",
        count > 9 ? "min-w-[18px] h-[18px] px-1" : "size-[18px]",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
