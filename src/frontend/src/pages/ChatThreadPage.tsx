import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Paperclip, Phone, Send, Video, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { DirectMessageWithExtras } from "../components/MessageWithExtras";
import { useAuth } from "../hooks/useAuth";
import {
  useConversations,
  useDirectMessages,
  useMarkDirectRead,
  useSendDirectMessage,
} from "../hooks/useConversations";
import { useUserProfile } from "../hooks/useProfile";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import type { DirectConversationSummary } from "../types";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDayLabel(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDayKey(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toDateString();
}

const presenceLabel: Record<string, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

// ── Component ─────────────────────────────────────────────────────────────────

interface ChatThreadPageProps {
  onStartCall?: (
    calleeIdText: string,
    peerName: string,
    isVideo: boolean,
  ) => void;
}

export function ChatThreadPage({ onStartCall }: ChatThreadPageProps) {
  const { id } = useParams({ from: "/chats/$id" });
  const convId = BigInt(id);
  const navigate = useNavigate();
  const { principal } = useAuth();
  const selfId = principal?.toText() ?? "";

  const { data: conversations = [] } = useConversations();
  const convSummary: DirectConversationSummary | undefined = useMemo(
    () => conversations.find((c) => c.conversationId === convId),
    [conversations, convId],
  );

  const otherUserIdText = convSummary?.otherUserId?.toText();
  const { data: otherProfile } = useUserProfile(otherUserIdText);
  const { data: messages = [], isLoading } = useDirectMessages(convId);
  const sendMessage = useSendDirectMessage();
  const markRead = useMarkDirectRead();

  const conversationIdStr = id;
  const { typingUsers, onKeydown, onStopTyping } =
    useTypingIndicator(conversationIdStr);

  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastMsgId = messages[messages.length - 1]?.id ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lastMsgId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: markRead is stable mutation fn
  useEffect(() => {
    if (lastMsgId !== null) {
      markRead.mutate({ conversationId: convId, upToMessageId: lastMsgId });
    }
  }, [lastMsgId, convId]);

  const groupedMessages = useMemo(() => {
    const groups: { dayKey: string; dayLabel: string; messageIds: bigint[] }[] =
      [];
    for (const msg of messages) {
      const dk = getDayKey(msg.createdAt);
      const last = groups[groups.length - 1];
      if (last && last.dayKey === dk) {
        last.messageIds.push(msg.id);
      } else {
        groups.push({
          dayKey: dk,
          dayLabel: formatDayLabel(msg.createdAt),
          messageIds: [msg.id],
        });
      }
    }
    return groups;
  }, [messages]);

  const msgById = useMemo(
    () => new Map(messages.map((m) => [m.id, m])),
    [messages],
  );

  const handleSend = useCallback(async () => {
    const content = text.trim();
    if (!content && !pendingFile) return;
    setText("");
    onStopTyping();

    if (pendingFile) {
      const fileName = pendingFile.name;
      setPendingFile(null);
      setUploadProgress(0);
      try {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          setUploadProgress(Math.min(progress, 100));
          if (progress >= 100) clearInterval(interval);
        }, 150);
        await sendMessage.mutateAsync({
          conversationId: convId,
          req: { content: content || fileName },
        });
        clearInterval(interval);
        setUploadProgress(0);
      } catch {
        toast.error("Failed to send file");
        setUploadProgress(0);
      }
    } else {
      sendMessage.mutate({ conversationId: convId, req: { content } });
    }
  }, [text, pendingFile, convId, sendMessage, onStopTyping]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onKeydown();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setText(file.name);
    }
    e.target.value = "";
  };

  const clearFile = () => {
    setPendingFile(null);
    setText("");
    setUploadProgress(0);
  };

  const otherName = convSummary?.otherUsername ?? `Chat #${id}`;
  const rawPresence = otherProfile?.presence;
  const displayPresence =
    otherUserIdText === undefined
      ? "Unknown"
      : rawPresence !== undefined
        ? (presenceLabel[rawPresence] ?? "Unknown")
        : "Unknown";

  // Filter out self from typing users
  const othersTyping = typingUsers.filter((u) => u.toText() !== selfId);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground md:hidden"
          onClick={() => navigate({ to: "/chats" })}
          aria-label="Back to chats"
          data-ocid="back-btn"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Avatar name={otherName} size="md" />

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold text-foreground truncate"
            data-ocid="chat-header-name"
          >
            {otherName}
          </p>
          <p
            className="text-xs text-muted-foreground"
            data-ocid="chat-header-presence"
          >
            {displayPresence}
          </p>
        </div>

        {/* Call buttons */}
        {onStartCall && otherUserIdText && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Audio call"
              data-ocid="audio-call-btn"
              onClick={() => onStartCall(otherUserIdText, otherName, false)}
            >
              <Phone className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Video call"
              data-ocid="video-call-btn"
              onClick={() => onStartCall(otherUserIdText, otherName, true)}
            >
              <Video className="size-4" />
            </Button>
          </div>
        )}
      </header>

      {/* ── Message area ───────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-background"
        data-ocid="message-list"
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={<Send className="size-6" />}
            title="Start the conversation"
            description={`Say hello to ${otherName}!`}
          />
        ) : (
          <div className="flex flex-col gap-1">
            {groupedMessages.map((group) => (
              <div key={group.dayKey}>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] font-medium text-muted-foreground px-2 bg-background">
                    {group.dayLabel}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="flex flex-col gap-1.5">
                  {group.messageIds.map((msgId) => {
                    const msg = msgById.get(msgId);
                    if (!msg) return null;
                    return (
                      <DirectMessageWithExtras
                        key={msg.id.toString()}
                        message={msg}
                        isSelf={msg.senderId.toText() === selfId}
                        selfId={selfId}
                        senderName={otherName}
                        showSender={false}
                        conversationId={id}
                        otherUserId={convSummary?.otherUserId}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Typing indicator ───────────────────────────────────────────── */}
      {othersTyping.length > 0 && (
        <div
          className="px-4 py-1.5 bg-background border-t border-border/50 flex-shrink-0"
          data-ocid="typing-indicator"
        >
          <p className="text-xs text-muted-foreground italic">
            {otherName} is typing…
          </p>
        </div>
      )}

      {/* ── File preview bar ───────────────────────────────────────────── */}
      {pendingFile && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-t border-border">
          <Paperclip className="size-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-foreground truncate flex-1">
            {pendingFile.name}
          </span>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <span className="text-xs text-primary">{uploadProgress}%</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-5 text-muted-foreground hover:text-destructive"
            onClick={clearFile}
            aria-label="Remove attached file"
          >
            <X className="size-3" />
          </Button>
        </div>
      )}

      {/* ── Input bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card flex-shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Attach file"
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
          aria-label="Attach file"
          data-ocid="attach-file-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="size-4" />
        </Button>

        <input
          data-ocid="message-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          onBlur={onStopTyping}
          placeholder="Type a message…"
          className="flex-1 min-w-0 bg-secondary/40 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-smooth"
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={(!text.trim() && !pendingFile) || sendMessage.isPending}
          data-ocid="send-message-btn"
          aria-label="Send message"
          className="flex-shrink-0"
        >
          {sendMessage.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
