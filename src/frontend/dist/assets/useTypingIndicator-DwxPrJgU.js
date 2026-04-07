import { y as createLucideIcon, k as useBackend, m as useQueryClient, l as useQuery, n as useMutation, r as reactExports, z as useControllableState, j as jsxRuntimeExports, ad as Root2$1, D as useId, K as useComposedRefs, G as Primitive, H as composeEventHandlers, ae as Anchor, F as Presence, J as Portal$1, af as createPopperScope, N as createContextScope, Q as createSlot, O as DismissableLayer, ag as Content, ah as Arrow, T as cn, b as MessageKind } from "./index-Cdrxh2KL.js";
import { h as hideOthers, R as ReactRemoveScroll, u as useFocusGuards, F as FocusScope } from "./Combination-BH4Lzw6f.js";
import { C as Check } from "./check-1SopV4gL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M22 11v1a10 10 0 1 1-9-10", key: "ew0xw9" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }],
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }]
];
const SmilePlus = createLucideIcon("smile-plus", __iconNode);
function useReactions(conversationId, messageId) {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const queryKey = ["reactions", conversationId, messageId.toString()];
  const reactionsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReactions(conversationId, messageId);
    },
    enabled: !!actor && !isFetching && !!conversationId,
    refetchInterval: 5e3,
    staleTime: 2e3
  });
  const addReaction = useMutation({
    mutationFn: async (emoji) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.addReaction(conversationId, messageId, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
  const removeReaction = useMutation({
    mutationFn: async (emoji) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.removeReaction(conversationId, messageId, emoji);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });
  return {
    reactions: reactionsQuery.data ?? [],
    addReaction,
    removeReaction
  };
}
function useDirectMessageReaders(conversationId, messageId, enabled) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: [
      "direct-msg-readers",
      conversationId.toString(),
      messageId.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDirectMessageReaders(conversationId, messageId);
    },
    enabled: !!actor && !isFetching && enabled,
    refetchInterval: 5e3,
    staleTime: 3e3
  });
}
function useGroupMessageReaders(groupId, messageId, enabled) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["group-msg-readers", groupId.toString(), messageId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGroupMessageReaders(groupId, messageId);
    },
    enabled: !!actor && !isFetching && enabled,
    refetchInterval: 5e3,
    staleTime: 3e3
  });
}
var POPOVER_NAME = "Popover";
var [createPopoverContext] = createContextScope(POPOVER_NAME, [
  createPopperScope
]);
var usePopperScope = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover$1 = (props) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false
  } = props;
  const popperScope = usePopperScope(__scopePopover);
  const triggerRef = reactExports.useRef(null);
  const [hasCustomAnchor, setHasCustomAnchor] = reactExports.useState(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    PopoverProvider,
    {
      scope: __scopePopover,
      contentId: useId(),
      triggerRef,
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      hasCustomAnchor,
      onCustomAnchorAdd: reactExports.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: reactExports.useCallback(() => setHasCustomAnchor(false), []),
      modal,
      children
    }
  ) });
};
Popover$1.displayName = POPOVER_NAME;
var ANCHOR_NAME = "PopoverAnchor";
var PopoverAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...anchorProps } = props;
    const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
    reactExports.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
PopoverAnchor.displayName = ANCHOR_NAME;
var TRIGGER_NAME = "PopoverTrigger";
var PopoverTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    const trigger = /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
    return context.hasCustomAnchor ? trigger : /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: trigger });
  }
);
PopoverTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "PopoverPortal";
var [PortalProvider, usePortalContext] = createPopoverContext(PORTAL_NAME, {
  forceMount: void 0
});
var PopoverPortal = (props) => {
  const { __scopePopover, forceMount, children, container } = props;
  const context = usePopoverContext(PORTAL_NAME, __scopePopover);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopePopover, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
PopoverPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "PopoverContent";
var PopoverContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopePopover);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
PopoverContent$1.displayName = CONTENT_NAME;
var Slot = createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a;
          event.preventDefault();
          if (!isRightClickOutsideRef.current) (_a = context.triggerRef.current) == null ? void 0 : _a.focus();
        }),
        onPointerDownOutside: composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            isRightClickOutsideRef.current = isRightClick;
          },
          { checkForDefaultPrevented: false }
        ),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
var PopoverContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a, _b;
          (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a, _b;
          (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var PopoverContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FocusScope,
      {
        asChild: true,
        loop: true,
        trapped: trapFocus,
        onMountAutoFocus: onOpenAutoFocus,
        onUnmountAutoFocus: onCloseAutoFocus,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DismissableLayer,
          {
            asChild: true,
            disableOutsidePointerEvents,
            onInteractOutside,
            onEscapeKeyDown,
            onPointerDownOutside,
            onFocusOutside,
            onDismiss: () => context.onOpenChange(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Content,
              {
                "data-state": getState(context.open),
                role: "dialog",
                id: context.contentId,
                ...popperScope,
                ...contentProps,
                ref: forwardedRef,
                style: {
                  ...contentProps.style,
                  // re-namespace exposed content custom properties
                  ...{
                    "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                  }
                }
              }
            )
          }
        )
      }
    );
  }
);
var CLOSE_NAME = "PopoverClose";
var PopoverClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props;
    const context = usePopoverContext(CLOSE_NAME, __scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
PopoverClose.displayName = CLOSE_NAME;
var ARROW_NAME = "PopoverArrow";
var PopoverArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
PopoverArrow.displayName = ARROW_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var Root2 = Popover$1;
var Trigger = PopoverTrigger$1;
var Portal = PopoverPortal;
var Content2 = PopoverContent$1;
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];
function ReactionPicker({ onReact, isSelf }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: cn(
          "absolute -top-3 flex items-center justify-center size-6 rounded-full",
          "bg-card border border-border shadow-sm text-muted-foreground",
          "opacity-0 group-hover:opacity-100 transition-all duration-150",
          "hover:text-foreground hover:border-primary/40 hover:scale-110",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSelf ? "-left-7" : "-right-7"
        ),
        "aria-label": "Add reaction",
        "data-ocid": "reaction-picker-trigger",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmilePlus, { className: "size-3.5" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-auto p-1.5 flex gap-1",
        side: "top",
        align: isSelf ? "end" : "start",
        "data-ocid": "reaction-picker-popover",
        children: EMOJI_OPTIONS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "text-lg hover:scale-125 transition-transform duration-100 px-1 rounded cursor-pointer",
            onClick: () => {
              onReact(emoji);
              setOpen(false);
            },
            "aria-label": `React with ${emoji}`,
            children: emoji
          },
          emoji
        ))
      }
    )
  ] });
}
function ReactionPills({
  reactions,
  selfId,
  onToggle,
  className
}) {
  if (reactions.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("flex flex-wrap gap-1 mt-1", className),
      "data-ocid": "reaction-pills",
      children: reactions.map((entry) => {
        const alreadyReacted = entry.users.some((u) => u.toText() === selfId);
        const count = entry.users.length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onToggle(entry.emoji, alreadyReacted),
            className: cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-smooth",
              "hover:scale-105 active:scale-95",
              alreadyReacted ? "bg-primary/20 border-primary/50 text-primary" : "bg-secondary/60 border-border text-foreground"
            ),
            "aria-label": `${entry.emoji} reaction, ${count} ${count === 1 ? "person" : "people"}. ${alreadyReacted ? "Click to remove" : "Click to add"}`,
            "data-ocid": "reaction-pill",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: entry.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: count })
            ]
          },
          entry.emoji
        );
      })
    }
  );
}
function formatTime(ts) {
  const ms = Number(ts) / 1e6;
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function MessageBubble({
  message,
  isSelf,
  senderName,
  showSender = false,
  selfId,
  reactions,
  onReact,
  isRead,
  readByCount
}) {
  const hasReactions = reactions && reactions.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col max-w-[70%] group relative",
        isSelf ? "self-end items-end" : "self-start items-start"
      ),
      children: [
        showSender && !isSelf && senderName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium mb-1 px-1", children: senderName }),
        onReact && selfId && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReactionPicker,
          {
            onReact: (emoji) => {
              const alreadyReacted = (reactions ?? []).some(
                (r) => r.emoji === emoji && r.users.some((u) => u.toText() === selfId)
              );
              onReact(emoji, alreadyReacted);
            },
            isSelf
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "px-3 py-2 rounded-2xl text-sm leading-relaxed",
              isSelf ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"
            ),
            children: message.kind === MessageKind.file && message.file ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: message.file.getDirectURL(),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 text-sm hover:underline",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[200px]", children: message.content || "Download file" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-words whitespace-pre-wrap", children: message.content })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-1 mt-0.5 px-1",
              isSelf ? "flex-row-reverse" : "flex-row"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: formatTime(message.createdAt) }),
              isSelf && isRead !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: isRead ? "Read" : "Sent", "data-ocid": "read-receipt", children: isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "size-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 text-muted-foreground" }) }),
              isSelf && readByCount !== void 0 && readByCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-[10px] text-primary",
                  "data-ocid": "group-read-count",
                  children: [
                    "Seen by ",
                    readByCount
                  ]
                }
              )
            ]
          }
        ),
        hasReactions && selfId && onReact && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReactionPills,
          {
            reactions,
            selfId,
            onToggle: (emoji, alreadyReacted) => onReact(emoji, alreadyReacted),
            className: isSelf ? "justify-end" : "justify-start"
          }
        )
      ]
    }
  );
}
function DirectMessageWithExtras({
  message,
  isSelf,
  selfId,
  senderName,
  showSender,
  conversationId,
  otherUserId
}) {
  const { reactions, addReaction, removeReaction } = useReactions(
    conversationId,
    message.id
  );
  const convIdBigInt = BigInt(conversationId);
  const { data: readers = [] } = useDirectMessageReaders(
    convIdBigInt,
    message.id,
    isSelf
  );
  const isRead = isSelf ? otherUserId ? readers.some((r) => r.toText() === otherUserId.toText()) : false : void 0;
  const handleReact = (emoji, alreadyReacted) => {
    if (alreadyReacted) {
      removeReaction.mutate(emoji);
    } else {
      addReaction.mutate(emoji);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MessageBubble,
    {
      message,
      isSelf,
      senderName,
      showSender,
      selfId,
      conversationId,
      reactions,
      onReact: handleReact,
      isRead
    }
  );
}
function GroupMessageWithExtras({
  message,
  isSelf,
  selfId,
  senderName,
  showSender,
  groupId
}) {
  const conversationId = `group:${groupId}`;
  const { reactions, addReaction, removeReaction } = useReactions(
    conversationId,
    message.id
  );
  const { data: readers = [] } = useGroupMessageReaders(
    BigInt(groupId),
    message.id,
    isSelf
  );
  const handleReact = (emoji, alreadyReacted) => {
    if (alreadyReacted) {
      removeReaction.mutate(emoji);
    } else {
      addReaction.mutate(emoji);
    }
  };
  const readByCount = isSelf ? readers.filter((r) => r.toText() !== selfId).length : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MessageBubble,
    {
      message,
      isSelf,
      senderName,
      showSender,
      selfId,
      conversationId,
      reactions,
      onReact: handleReact,
      readByCount
    }
  );
}
function useTypingIndicator(conversationId) {
  const { actor, isFetching } = useBackend();
  const typingTimeoutRef = reactExports.useRef(null);
  const setTypingMutation = useMutation({
    mutationFn: async (isTyping) => {
      if (!actor) return;
      await actor.setTypingStatus(conversationId, isTyping);
    }
  });
  const typingUsersQuery = useQuery({
    queryKey: ["typing-users", conversationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTypingUsers(conversationId);
    },
    enabled: !!actor && !isFetching && !!conversationId,
    refetchInterval: 2e3
  });
  const onKeydown = () => {
    setTypingMutation.mutate(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTypingMutation.mutate(false);
    }, 3e3);
  };
  const onStopTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingMutation.mutate(false);
  };
  return {
    typingUsers: typingUsersQuery.data ?? [],
    onKeydown,
    onStopTyping
  };
}
export {
  DirectMessageWithExtras as D,
  GroupMessageWithExtras as G,
  Paperclip as P,
  Send as S,
  useTypingIndicator as u
};
