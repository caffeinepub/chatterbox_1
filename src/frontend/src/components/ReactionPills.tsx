import { cn } from "@/lib/utils";
import type { ReactionEntry } from "../types";

interface ReactionPillsProps {
  reactions: ReactionEntry[];
  selfId: string;
  onToggle: (emoji: string, alreadyReacted: boolean) => void;
  className?: string;
}

export function ReactionPills({
  reactions,
  selfId,
  onToggle,
  className,
}: ReactionPillsProps) {
  if (reactions.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap gap-1 mt-1", className)}
      data-ocid="reaction-pills"
    >
      {reactions.map((entry) => {
        const alreadyReacted = entry.users.some((u) => u.toText() === selfId);
        const count = entry.users.length;

        return (
          <button
            key={entry.emoji}
            type="button"
            onClick={() => onToggle(entry.emoji, alreadyReacted)}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-smooth",
              "hover:scale-105 active:scale-95",
              alreadyReacted
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-secondary/60 border-border text-foreground",
            )}
            aria-label={`${entry.emoji} reaction, ${count} ${count === 1 ? "person" : "people"}. ${alreadyReacted ? "Click to remove" : "Click to add"}`}
            data-ocid="reaction-pill"
          >
            <span>{entry.emoji}</span>
            <span className="font-medium">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
