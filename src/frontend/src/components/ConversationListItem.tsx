import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Avatar } from "./Avatar";
import { UnreadBadge } from "./UnreadBadge";

import type { PresenceStatus } from "../types";

interface ConversationListItemProps {
  conversationId: string;
  name: string;
  lastMessage?: string;
  unreadCount?: number;
  href: string;
  active?: boolean;
  isGroup?: boolean;
  presence?: PresenceStatus;
}

export function ConversationListItem({
  name,
  lastMessage,
  unreadCount = 0,
  href,
  active = false,
  isGroup = false,
  presence,
}: ConversationListItemProps) {
  return (
    <Link
      to={href}
      data-ocid="conversation-list-item"
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg transition-smooth cursor-pointer",
        active
          ? "bg-primary/10 text-foreground"
          : "hover:bg-accent/20 text-foreground",
      )}
    >
      <div className="relative flex-shrink-0">
        {isGroup ? (
          <div className="size-9 rounded-full bg-muted flex items-center justify-center">
            <Users className="size-4 text-muted-foreground" />
          </div>
        ) : (
          <Avatar name={name} size="sm" presence={presence} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span
            className={cn(
              "text-sm truncate",
              unreadCount > 0
                ? "font-semibold text-foreground"
                : "font-medium text-foreground/80",
            )}
          >
            {name}
          </span>
          {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
        </div>
        {lastMessage && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {lastMessage}
          </p>
        )}
      </div>
    </Link>
  );
}
