import { cn } from "@/lib/utils";
import { Check, CheckCheck, FileText } from "lucide-react";
import type { ReactionEntry } from "../types";
import { MessageKind } from "../types";
import type { Message } from "../types";
import { ReactionPicker } from "./ReactionPicker";
import { ReactionPills } from "./ReactionPills";

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
  senderName?: string;
  showSender?: boolean;
  selfId?: string;
  conversationId?: string;
  reactions?: ReactionEntry[];
  onReact?: (emoji: string, alreadyReacted: boolean) => void;
  // Read receipt: undefined = no receipt shown, false = sent, true = read
  isRead?: boolean;
  readByCount?: number;
}

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({
  message,
  isSelf,
  senderName,
  showSender = false,
  selfId,
  reactions,
  onReact,
  isRead,
  readByCount,
}: MessageBubbleProps) {
  const hasReactions = reactions && reactions.length > 0;

  return (
    <div
      className={cn(
        "flex flex-col max-w-[70%] group relative",
        isSelf ? "self-end items-end" : "self-start items-start",
      )}
    >
      {showSender && !isSelf && senderName && (
        <span className="text-xs text-primary font-medium mb-1 px-1">
          {senderName}
        </span>
      )}

      {/* Reaction picker trigger (appears on hover) */}
      {onReact && selfId && (
        <ReactionPicker
          onReact={(emoji) => {
            const alreadyReacted = (reactions ?? []).some(
              (r) =>
                r.emoji === emoji && r.users.some((u) => u.toText() === selfId),
            );
            onReact(emoji, alreadyReacted);
          }}
          isSelf={isSelf}
        />
      )}

      <div
        className={cn(
          "px-3 py-2 rounded-2xl text-sm leading-relaxed",
          isSelf
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm",
        )}
      >
        {message.kind === MessageKind.file && message.file ? (
          <a
            href={message.file.getDirectURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <FileText className="size-4 flex-shrink-0" />
            <span className="truncate max-w-[200px]">
              {message.content || "Download file"}
            </span>
          </a>
        ) : (
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        )}
      </div>

      {/* Time + read receipt row */}
      <div
        className={cn(
          "flex items-center gap-1 mt-0.5 px-1",
          isSelf ? "flex-row-reverse" : "flex-row",
        )}
      >
        <span className="text-[10px] text-muted-foreground">
          {formatTime(message.createdAt)}
        </span>

        {/* Read receipt for outgoing messages */}
        {isSelf && isRead !== undefined && (
          <span title={isRead ? "Read" : "Sent"} data-ocid="read-receipt">
            {isRead ? (
              <CheckCheck className="size-3 text-primary" />
            ) : (
              <Check className="size-3 text-muted-foreground" />
            )}
          </span>
        )}

        {/* Group "Seen by N" */}
        {isSelf && readByCount !== undefined && readByCount > 0 && (
          <span
            className="text-[10px] text-primary"
            data-ocid="group-read-count"
          >
            Seen by {readByCount}
          </span>
        )}
      </div>

      {/* Reaction pills */}
      {hasReactions && selfId && onReact && (
        <ReactionPills
          reactions={reactions}
          selfId={selfId}
          onToggle={(emoji, alreadyReacted) => onReact(emoji, alreadyReacted)}
          className={isSelf ? "justify-end" : "justify-start"}
        />
      )}
    </div>
  );
}
