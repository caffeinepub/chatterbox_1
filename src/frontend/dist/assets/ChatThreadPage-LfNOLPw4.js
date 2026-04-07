import { c as useParams, d as useNavigate, e as useAuth, u as useConversations, r as reactExports, f as useUserProfile, g as useDirectMessages, h as useSendDirectMessage, i as useMarkDirectRead, j as jsxRuntimeExports, B as Button, A as Avatar, P as Phone, V as Video, a as LoadingSpinner, X } from "./index-Cdrxh2KL.js";
import { u as ue } from "./index-DcPRr7eS.js";
import { E as EmptyState } from "./EmptyState-Txg3nDL6.js";
import { u as useTypingIndicator, S as Send, D as DirectMessageWithExtras, P as Paperclip } from "./useTypingIndicator-DwxPrJgU.js";
import { A as ArrowLeft } from "./arrow-left-CpdXjC9x.js";
import "./Combination-BH4Lzw6f.js";
import "./check-1SopV4gL.js";
function formatDayLabel(ts) {
  const ms = Number(ts) / 1e6;
  const date = new Date(ms);
  const now = /* @__PURE__ */ new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}
function getDayKey(ts) {
  return new Date(Number(ts) / 1e6).toDateString();
}
const presenceLabel = {
  online: "Online",
  away: "Away",
  offline: "Offline"
};
function ChatThreadPage({ onStartCall }) {
  var _a, _b;
  const { id } = useParams({ from: "/chats/$id" });
  const convId = BigInt(id);
  const navigate = useNavigate();
  const { principal } = useAuth();
  const selfId = (principal == null ? void 0 : principal.toText()) ?? "";
  const { data: conversations = [] } = useConversations();
  const convSummary = reactExports.useMemo(
    () => conversations.find((c) => c.conversationId === convId),
    [conversations, convId]
  );
  const otherUserIdText = (_a = convSummary == null ? void 0 : convSummary.otherUserId) == null ? void 0 : _a.toText();
  const { data: otherProfile } = useUserProfile(otherUserIdText);
  const { data: messages = [], isLoading } = useDirectMessages(convId);
  const sendMessage = useSendDirectMessage();
  const markRead = useMarkDirectRead();
  const conversationIdStr = id;
  const { typingUsers, onKeydown, onStopTyping } = useTypingIndicator(conversationIdStr);
  const [text, setText] = reactExports.useState("");
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const scrollRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const lastMsgId = ((_b = messages[messages.length - 1]) == null ? void 0 : _b.id) ?? null;
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lastMsgId]);
  reactExports.useEffect(() => {
    if (lastMsgId !== null) {
      markRead.mutate({ conversationId: convId, upToMessageId: lastMsgId });
    }
  }, [lastMsgId, convId]);
  const groupedMessages = reactExports.useMemo(() => {
    const groups = [];
    for (const msg of messages) {
      const dk = getDayKey(msg.createdAt);
      const last = groups[groups.length - 1];
      if (last && last.dayKey === dk) {
        last.messageIds.push(msg.id);
      } else {
        groups.push({
          dayKey: dk,
          dayLabel: formatDayLabel(msg.createdAt),
          messageIds: [msg.id]
        });
      }
    }
    return groups;
  }, [messages]);
  const msgById = reactExports.useMemo(
    () => new Map(messages.map((m) => [m.id, m])),
    [messages]
  );
  const handleSend = reactExports.useCallback(async () => {
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
          req: { content: content || fileName }
        });
        clearInterval(interval);
        setUploadProgress(0);
      } catch {
        ue.error("Failed to send file");
        setUploadProgress(0);
      }
    } else {
      sendMessage.mutate({ conversationId: convId, req: { content } });
    }
  }, [text, pendingFile, convId, sendMessage, onStopTyping]);
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onKeydown();
    }
  };
  const handleFileChange = (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
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
  const otherName = (convSummary == null ? void 0 : convSummary.otherUsername) ?? `Chat #${id}`;
  const rawPresence = otherProfile == null ? void 0 : otherProfile.presence;
  const displayPresence = otherUserIdText === void 0 ? "Unknown" : rawPresence !== void 0 ? presenceLabel[rawPresence] ?? "Unknown" : "Unknown";
  const othersTyping = typingUsers.filter((u) => u.toText() !== selfId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "size-8 text-muted-foreground md:hidden",
          onClick: () => navigate({ to: "/chats" }),
          "aria-label": "Back to chats",
          "data-ocid": "back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { name: otherName, size: "md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm font-semibold text-foreground truncate",
            "data-ocid": "chat-header-name",
            children: otherName
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-muted-foreground",
            "data-ocid": "chat-header-presence",
            children: displayPresence
          }
        )
      ] }),
      onStartCall && otherUserIdText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "size-8 text-muted-foreground hover:text-foreground",
            "aria-label": "Audio call",
            "data-ocid": "audio-call-btn",
            onClick: () => onStartCall(otherUserIdText, otherName, false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "size-8 text-muted-foreground hover:text-foreground",
            "aria-label": "Video call",
            "data-ocid": "video-call-btn",
            onClick: () => onStartCall(otherUserIdText, otherName, true),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: scrollRef,
        className: "flex-1 overflow-y-auto px-4 py-4 bg-background",
        "data-ocid": "message-list",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-6" }),
            title: "Start the conversation",
            description: `Say hello to ${otherName}!`
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: groupedMessages.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-muted-foreground px-2 bg-background", children: group.dayLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: group.messageIds.map((msgId) => {
            const msg = msgById.get(msgId);
            if (!msg) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              DirectMessageWithExtras,
              {
                message: msg,
                isSelf: msg.senderId.toText() === selfId,
                selfId,
                senderName: otherName,
                showSender: false,
                conversationId: id,
                otherUserId: convSummary == null ? void 0 : convSummary.otherUserId
              },
              msg.id.toString()
            );
          }) })
        ] }, group.dayKey)) })
      }
    ),
    othersTyping.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-4 py-1.5 bg-background border-t border-border/50 flex-shrink-0",
        "data-ocid": "typing-indicator",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground italic", children: [
          otherName,
          " is typing…"
        ] })
      }
    ),
    pendingFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-muted/40 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-4 text-muted-foreground flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate flex-1", children: pendingFile.name }),
      uploadProgress > 0 && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary", children: [
        uploadProgress,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "size-5 text-muted-foreground hover:text-destructive",
          onClick: clearFile,
          "aria-label": "Remove attached file",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          className: "hidden",
          onChange: handleFileChange,
          "aria-label": "Attach file"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "text-muted-foreground hover:text-foreground flex-shrink-0",
          "aria-label": "Attach file",
          "data-ocid": "attach-file-btn",
          onClick: () => {
            var _a2;
            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-ocid": "message-input",
          type: "text",
          value: text,
          onChange: (e) => setText(e.target.value),
          onKeyDown: handleKey,
          onBlur: onStopTyping,
          placeholder: "Type a message…",
          className: "flex-1 min-w-0 bg-secondary/40 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-smooth"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          onClick: handleSend,
          disabled: !text.trim() && !pendingFile || sendMessage.isPending,
          "data-ocid": "send-message-btn",
          "aria-label": "Send message",
          className: "flex-shrink-0",
          children: sendMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
        }
      )
    ] })
  ] });
}
export {
  ChatThreadPage
};
