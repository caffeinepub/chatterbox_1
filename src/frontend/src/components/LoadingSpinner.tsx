import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-7 border-2",
  lg: "size-10 border-[3px]",
};

export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "rounded-full border-border border-t-primary animate-spin",
        sizeClasses[size],
        className,
      )}
    />
  );
}
