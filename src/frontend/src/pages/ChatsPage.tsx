import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { MessageSquare, UserPlus } from "lucide-react";
import { ConversationListItem } from "../components/ConversationListItem";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useConversations } from "../hooks/useConversations";
import { MessageKind } from "../types";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (isThisYear) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getLastMessagePreview(
  content: string,
  kind?: string,
  isSelf?: boolean,
): string {
  const prefix = isSelf ? "You: " : "";
  if (kind === MessageKind.file) return `${prefix}📎 File`;
  const trimmed = content.slice(0, 60);
  return `${prefix}${trimmed}${content.length > 60 ? "…" : ""}`;
}

export function ChatsPage() {
  const { data: conversations = [], isLoading } = useConversations();

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
        <h1 className="font-display font-semibold text-lg text-foreground">
          Messages
        </h1>
        <Link to="/contacts/add">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            data-ocid="new-chat-btn"
            aria-label="Add contact to start a chat"
          >
            <UserPlus className="size-4 mr-1.5" />
            New Chat
          </Button>
        </Link>
      </header>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-7" />}
            title="No messages yet"
            description="Start a conversation by adding a contact, then open a chat from the Contacts page."
            action={
              <Link to="/contacts/add">
                <Button variant="default" size="sm" data-ocid="start-chat-cta">
                  Add Contact
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="py-2 px-1">
            {conversations.map((conv) => {
              const lastMsgPreview = conv.lastMessage
                ? getLastMessagePreview(
                    conv.lastMessage.content,
                    conv.lastMessage.kind,
                  )
                : undefined;
              const timestamp = conv.lastMessage?.createdAt;

              return (
                <ConversationThreadRow
                  key={conv.conversationId.toString()}
                  conversationId={conv.conversationId.toString()}
                  name={conv.otherUsername}
                  lastMessage={lastMsgPreview}
                  unreadCount={Number(conv.unreadCount)}
                  timestamp={timestamp ? formatTimestamp(timestamp) : undefined}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Extended row that adds timestamp display alongside unread badge
function ConversationThreadRow({
  conversationId,
  name,
  lastMessage,
  unreadCount,
  timestamp,
}: {
  conversationId: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
  timestamp?: string;
}) {
  return (
    <ConversationListItem
      conversationId={conversationId}
      name={name}
      lastMessage={
        lastMessage && timestamp ? `${lastMessage} · ${timestamp}` : lastMessage
      }
      unreadCount={unreadCount}
      href={`/chats/${conversationId}`}
    />
  );
}
