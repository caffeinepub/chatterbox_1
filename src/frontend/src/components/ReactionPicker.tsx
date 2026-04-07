import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SmilePlus } from "lucide-react";
import { useState } from "react";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
  isSelf: boolean;
}

export function ReactionPicker({ onReact, isSelf }: ReactionPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "absolute -top-3 flex items-center justify-center size-6 rounded-full",
            "bg-card border border-border shadow-sm text-muted-foreground",
            "opacity-0 group-hover:opacity-100 transition-all duration-150",
            "hover:text-foreground hover:border-primary/40 hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isSelf ? "-left-7" : "-right-7",
          )}
          aria-label="Add reaction"
          data-ocid="reaction-picker-trigger"
        >
          <SmilePlus className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-1.5 flex gap-1"
        side="top"
        align={isSelf ? "end" : "start"}
        data-ocid="reaction-picker-popover"
      >
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="text-lg hover:scale-125 transition-transform duration-100 px-1 rounded cursor-pointer"
            onClick={() => {
              onReact(emoji);
              setOpen(false);
            }}
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
