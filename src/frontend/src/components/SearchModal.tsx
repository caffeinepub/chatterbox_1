import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchMessages } from "../hooks/useSearch";
import { ConversationType } from "../types";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const searchMessages = useSearchMessages();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      searchMessages.reset();
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: debounce search
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      searchMessages.reset();
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchMessages.mutate(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  const handleResultClick = (
    conversationId: string,
    type: ConversationType,
  ) => {
    onClose();
    if (type === ConversationType.direct) {
      navigate({ to: "/chats/$id", params: { id: conversationId } });
    } else {
      navigate({ to: "/groups/$id", params: { id: conversationId } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      aria-label="Search messages"
      data-ocid="search-modal"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="size-4 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages…"
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
            data-ocid="search-input"
          />
          {searchMessages.isPending && (
            <Loader2 className="size-4 text-muted-foreground animate-spin flex-shrink-0" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!query.trim() && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Type to search messages
            </div>
          )}

          {query.trim() &&
            !searchMessages.isPending &&
            searchMessages.data?.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No messages found for "{query}"
              </div>
            )}

          {(searchMessages.data ?? []).map((result) => (
            <button
              key={`${result.conversationId}-${result.messageId.toString()}`}
              type="button"
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-left",
                "hover:bg-secondary/50 transition-smooth border-b border-border/50 last:border-0",
              )}
              onClick={() =>
                handleResultClick(
                  result.conversationId,
                  result.conversationType,
                )
              }
              data-ocid="search-result-item"
            >
              {/* Conversation type tag */}
              <div className="flex-shrink-0 mt-0.5">
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide",
                    result.conversationType === ConversationType.direct
                      ? "bg-primary/15 text-primary"
                      : "bg-accent/20 text-accent-foreground",
                  )}
                >
                  {result.conversationType === ConversationType.direct
                    ? "DM"
                    : "Group"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5 truncate">
                  {result.conversationId}
                </p>
                <p className="text-sm text-foreground line-clamp-2 break-words">
                  {result.content}
                </p>
              </div>

              <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
                {formatTimestamp(result.createdAt)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
