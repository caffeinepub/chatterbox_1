import { o as useGroups, j as jsxRuntimeExports, L as Link, B as Button, p as CirclePlus, S as ScrollArea, a as LoadingSpinner, U as Users, q as UnreadBadge, M as MessageSquare } from "./index-Cdrxh2KL.js";
import { E as EmptyState } from "./EmptyState-Txg3nDL6.js";
function GroupsPage() {
  const { data: groups = [], isLoading } = useGroups();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground", children: "Groups" }),
        groups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          groups.length,
          " group",
          groups.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/groups/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", "data-ocid": "create-group-header-btn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "size-4 mr-1.5" }),
        "New Group"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-7" }),
        title: "No groups yet",
        description: "Create a group to start chatting with multiple people at once.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/groups/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", "data-ocid": "create-first-group-cta", children: "Create your first group" }) })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3 px-3 flex flex-col gap-1", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/groups/$id",
        params: { id: g.group.id.toString() },
        "data-ocid": "group-list-item",
        className: "flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/60 transition-smooth group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden", children: g.group.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: g.group.icon.getDirectURL(),
                alt: g.group.name,
                className: "size-12 object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-primary/70" }) }),
            Number(g.unreadCount) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UnreadBadge, { count: Number(g.unreadCount) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors", children: g.group.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/60 flex-shrink-0 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3" }),
                Number(g.memberCount)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1", children: g.group.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: g.group.description }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: g.lastMessage ? "View messages" : "No messages yet" })
            ] }) })
          ] })
        ]
      },
      g.group.id.toString()
    )) }) })
  ] });
}
export {
  GroupsPage
};
