import { y as createLucideIcon, j as jsxRuntimeExports, X, T as cn, r as reactExports, L as Link, B as Button, w as Search, a as LoadingSpinner, U as Users, A as Avatar, $ as PresenceStatus, k as useBackend, d as useNavigate, M as MessageSquare } from "./index-Cdrxh2KL.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-u65c228r.js";
import { u as ue } from "./index-DcPRr7eS.js";
import { E as EmptyState } from "./EmptyState-Txg3nDL6.js";
import { S as StatusBadge } from "./StatusBadge-fwvnYNuH.js";
import { u as useContacts, b as usePendingContactRequests, c as useAcceptContactRequest, d as useRejectContactRequest, e as useRemoveContact } from "./useContacts-Ddo-GIcN.js";
import { U as UserPlus } from "./user-plus-CMnLDUOd.js";
import { C as Check } from "./check-1SopV4gL.js";
import "./Combination-BH4Lzw6f.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function ContactSheet({ contact, open, onClose }) {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const remove = useRemoveContact();
  const [navigating, setNavigating] = reactExports.useState(false);
  async function handleSendMessage() {
    if (!actor || !contact) return;
    setNavigating(true);
    try {
      const convId = await actor.getOrCreateDirectConversation(contact.userId);
      onClose();
      navigate({ to: "/chats/$id", params: { id: convId.toString() } });
    } finally {
      setNavigating(false);
    }
  }
  function handleRemove() {
    if (!contact) return;
    remove.mutate(contact.userId, {
      onSuccess: () => {
        ue.success("Contact removed");
        onClose();
      }
    });
  }
  if (!contact) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "bg-card border-border w-80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "font-display text-foreground", children: "Contact Info" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Avatar,
        {
          name: contact.username,
          size: "lg",
          presence: PresenceStatus.offline
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-lg text-foreground", children: contact.username }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono break-all px-2", children: contact.userId.toText() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 w-full mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full",
            onClick: handleSendMessage,
            disabled: navigating,
            "data-ocid": "contact-sheet-send-message",
            children: navigating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-4 mr-2" }),
              "Send Message"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            className: "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
            onClick: handleRemove,
            disabled: remove.isPending,
            "data-ocid": "contact-sheet-remove",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 mr-2" }),
              "Remove Contact"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function PendingRow({ request }) {
  const accept = useAcceptContactRequest();
  const reject = useRejectContactRequest();
  const fromText = request.from.toText();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-smooth",
      "data-ocid": "pending-request-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { name: fromText, size: "sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
            fromText.slice(0, 10),
            "…",
            fromText.slice(-6)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Wants to connect" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "size-8 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400",
              onClick: () => accept.mutate(request.id, {
                onSuccess: () => ue.success("Contact request accepted")
              }),
              disabled: accept.isPending,
              "aria-label": "Accept request",
              "data-ocid": "accept-request-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "size-8 hover:bg-destructive/10 hover:text-destructive",
              onClick: () => reject.mutate(request.id),
              disabled: reject.isPending,
              "aria-label": "Reject request",
              "data-ocid": "reject-request-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
            }
          )
        ] })
      ]
    }
  );
}
function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts();
  const { data: pendingRequests = [] } = usePendingContactRequests();
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const [sheetOpen, setSheetOpen] = reactExports.useState(false);
  const filtered = contacts.filter(
    (c) => c.username.toLowerCase().includes(search.toLowerCase())
  );
  function openContact(contact) {
    setSelected(contact);
    setSheetOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground", children: "Contacts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contacts/add", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", "data-ocid": "add-contact-header-btn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4 mr-1.5" }),
        "Add Contact"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-card/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Search contacts…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth",
          "data-ocid": "contacts-search"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      pendingRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-b border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-4 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Incoming Requests (",
          pendingRequests.length,
          ")"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-3", children: pendingRequests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsx(PendingRow, { request: req }, req.id.toString())) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "p-2", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-7" }),
          title: search ? "No matching contacts" : "No contacts yet",
          description: search ? "Try a different name or username." : "Add people to start chatting with them.",
          action: !search ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contacts/add", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", "data-ocid": "contacts-empty-add", children: "Add your first contact" }) }) : void 0
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        !search && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1", children: [
          "All Contacts (",
          contacts.length,
          ")"
        ] }),
        search && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground px-3 pb-1", children: [
          filtered.length,
          " result",
          filtered.length !== 1 ? "s" : ""
        ] }),
        filtered.map((contact) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-smooth text-left cursor-pointer group",
            onClick: () => openContact(contact),
            "data-ocid": "contact-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  name: contact.username,
                  size: "md",
                  presence: PresenceStatus.offline
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: contact.username }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                  contact.userId.toText().slice(0, 18),
                  "…"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { presence: PresenceStatus.offline })
            ]
          },
          contact.userId.toText()
        ))
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContactSheet,
      {
        contact: selected,
        open: sheetOpen,
        onClose: () => setSheetOpen(false)
      }
    )
  ] });
}
export {
  ContactsPage
};
