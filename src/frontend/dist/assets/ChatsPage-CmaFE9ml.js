import { u as useConversations, j as jsxRuntimeExports, L as Link, B as Button, S as ScrollArea, a as LoadingSpinner, M as MessageSquare, b as MessageKind, C as ConversationListItem } from "./index-Cdrxh2KL.js";
import { E as EmptyState } from "./EmptyState-Txg3nDL6.js";
import { U as UserPlus } from "./user-plus-CMnLDUOd.js";
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  const date = new Date(ms);
  const now = /* @__PURE__ */ new Date();
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
    day: "numeric"
  });
}
function getLastMessagePreview(content, kind, isSelf) {
  const prefix = "";
  if (kind === MessageKind.file) return `${prefix}📎 File`;
  const trimmed = content.slice(0, 60);
  return `${prefix}${trimmed}${content.length > 60 ? "…" : ""}`;
}
function ChatsPage() {
  const { data: conversations = [], isLoading } = useConversations();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground", children: "Messages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contacts/add", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "ghost",
          className: "text-muted-foreground hover:text-foreground",
          "data-ocid": "new-chat-btn",
          "aria-label": "Add contact to start a chat",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4 mr-1.5" }),
            "New Chat"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }) : conversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-7" }),
        title: "No messages yet",
        description: "Start a conversation by adding a contact, then open a chat from the Contacts page.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contacts/add", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "default", size: "sm", "data-ocid": "start-chat-cta", children: "Add Contact" }) })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2 px-1", children: conversations.map((conv) => {
      var _a;
      const lastMsgPreview = conv.lastMessage ? getLastMessagePreview(
        conv.lastMessage.content,
        conv.lastMessage.kind
      ) : void 0;
      const timestamp = (_a = conv.lastMessage) == null ? void 0 : _a.createdAt;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ConversationThreadRow,
        {
          conversationId: conv.conversationId.toString(),
          name: conv.otherUsername,
          lastMessage: lastMsgPreview,
          unreadCount: Number(conv.unreadCount),
          timestamp: timestamp ? formatTimestamp(timestamp) : void 0
        },
        conv.conversationId.toString()
      );
    }) }) })
  ] });
}
function ConversationThreadRow({
  conversationId,
  name,
  lastMessage,
  unreadCount,
  timestamp
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ConversationListItem,
    {
      conversationId,
      name,
      lastMessage: lastMessage && timestamp ? `${lastMessage} · ${timestamp}` : lastMessage,
      unreadCount,
      href: `/chats/${conversationId}`
    }
  );
}
export {
  ChatsPage
};
