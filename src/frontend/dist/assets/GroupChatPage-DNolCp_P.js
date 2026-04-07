const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Cdrxh2KL.js","assets/index-BsaToAap.css"])))=>i.map(i=>d[i]);
import { y as createLucideIcon, j as jsxRuntimeExports, X, T as cn, c as useParams, d as useNavigate, e as useAuth, a3 as useGroup, a4 as useGroupMembers, a5 as useGroupMessages, a6 as useSendGroupMessage, a7 as useLeaveGroup, a8 as useMarkGroupRead, r as reactExports, a9 as GroupMemberRole, U as Users, B as Button, a as LoadingSpinner, x as LoaderCircle, E as ExternalBlob, aa as useRemoveGroupMember, S as ScrollArea, a1 as LogOut, A as Avatar, ab as useEditGroup, I as Input, v as useFindUserByUsername, t as useAddGroupMember, w as Search, $ as PresenceStatus, a2 as __vitePreload } from "./index-Cdrxh2KL.js";
import { R as Root, C as Content, a as Close, T as Title, D as Description, P as Portal, O as Overlay } from "./index-u65c228r.js";
import { L as Label } from "./label-C_Jd5bfH.js";
import { U as UserMinus, T as Textarea } from "./textarea-DvKDpSw7.js";
import { u as ue } from "./index-DcPRr7eS.js";
import { E as EmptyState } from "./EmptyState-Txg3nDL6.js";
import { u as useTypingIndicator, G as GroupMessageWithExtras, P as Paperclip, S as Send } from "./useTypingIndicator-DwxPrJgU.js";
import { S as StatusBadge } from "./StatusBadge-fwvnYNuH.js";
import { U as UserPlus } from "./user-plus-CMnLDUOd.js";
import { C as Camera } from "./camera-DKP42KTi.js";
import { C as Check } from "./check-1SopV4gL.js";
import "./Combination-BH4Lzw6f.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function EditGroupDialog({
  groupId,
  initialName,
  initialDescription,
  initialIconUrl,
  open,
  onClose
}) {
  const editGroup = useEditGroup();
  const [name, setName] = reactExports.useState(initialName);
  const [description, setDescription] = reactExports.useState(initialDescription);
  const [iconFile, setIconFile] = reactExports.useState(null);
  const [iconPreview, setIconPreview] = reactExports.useState(
    initialIconUrl ?? null
  );
  const fileRef = reactExports.useRef(null);
  const handleIconChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };
  const handleSave = async () => {
    if (!name.trim()) return;
    let icon;
    if (iconFile) {
      const bytes = new Uint8Array(await iconFile.arrayBuffer());
      icon = ExternalBlob.fromBytes(bytes);
    }
    try {
      await editGroup.mutateAsync({
        groupId,
        req: { name: name.trim(), description: description.trim(), icon }
      });
      ue.success("Group updated!");
      onClose();
    } catch {
      ue.error("Failed to update group.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Group" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update your group's name, description, or icon." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a;
              return (_a = fileRef.current) == null ? void 0 : _a.click();
            },
            className: "relative group size-20 rounded-2xl overflow-hidden bg-secondary/60 border-2 border-dashed border-border hover:border-primary/50 transition-smooth cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "aria-label": "Change group icon",
            children: iconPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: iconPreview,
                  alt: "Group icon",
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5 text-foreground" }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-7 text-muted-foreground/40" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileRef,
            type: "file",
            accept: "image/*",
            className: "sr-only",
            onChange: handleIconChange
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-name", children: "Group Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-name",
            "data-ocid": "edit-group-name-input",
            value: name,
            onChange: (e) => setName(e.target.value),
            maxLength: 80
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "edit-desc",
            "data-ocid": "edit-group-description-input",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            rows: 2,
            className: "resize-none",
            maxLength: 300
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onClose,
          disabled: editGroup.isPending,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleSave,
          disabled: editGroup.isPending || !name.trim(),
          "data-ocid": "edit-group-save-btn",
          children: [
            editGroup.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1.5" }) : null,
            "Save Changes"
          ]
        }
      )
    ] })
  ] }) });
}
function AddMemberDialog({ groupId, open, onClose }) {
  const findUser = useFindUserByUsername();
  const addMember = useAddGroupMember();
  const [username, setUsername] = reactExports.useState("");
  const [found, setFound] = reactExports.useState(
    void 0
  );
  const handleSearch = async () => {
    if (!username.trim()) return;
    const result = await findUser.mutateAsync(username.trim());
    setFound(result);
  };
  const handleAdd = async () => {
    if (!found) return;
    try {
      await addMember.mutateAsync({ groupId, newMember: found.userId });
      ue.success(`${found.username} added to the group!`);
      onClose();
      setUsername("");
      setFound(void 0);
    } catch {
      ue.error("Failed to add member. They may already be in the group.");
    }
  };
  const handleClose = () => {
    setUsername("");
    setFound(void 0);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Member" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Search by username to add someone to this group." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "add-member-username-input",
            placeholder: "Username",
            value: username,
            onChange: (e) => {
              setUsername(e.target.value);
              setFound(void 0);
            },
            onKeyDown: (e) => e.key === "Enter" && handleSearch(),
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            onClick: handleSearch,
            disabled: findUser.isPending || !username.trim(),
            "aria-label": "Search user",
            "data-ocid": "search-member-btn",
            children: findUser.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4" })
          }
        )
      ] }),
      found === null && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-2", children: "No user found with that username." }),
      found && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            name: found.username,
            size: "sm",
            presence: found.presence
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: found.username }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusBadge,
            {
              presence: found.presence ?? PresenceStatus.offline,
              showLabel: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleAdd,
            disabled: addMember.isPending,
            "data-ocid": "confirm-add-member-btn",
            children: [
              addMember.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 mr-1" }),
              "Add"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: handleClose, children: "Cancel" }) })
  ] }) });
}
function LeaveConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isLeaving
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Leave Group?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "You'll stop receiving messages from this group. You can be re-invited by the owner." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: onCancel, disabled: isLeaving, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "destructive",
          onClick: onConfirm,
          disabled: isLeaving,
          "data-ocid": "confirm-leave-group-btn",
          children: [
            isLeaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1.5" }) : null,
            "Leave Group"
          ]
        }
      )
    ] })
  ] }) });
}
function MembersPanel({
  groupId,
  selfId,
  isOwner,
  onClose,
  onEditGroup,
  onAddMember,
  onLeave
}) {
  const { data: members = [] } = useGroupMembers(groupId);
  const removeGroupMember = useRemoveGroupMember();
  const { data: group } = useGroup(groupId);
  const handleRemove = async (userId, username) => {
    try {
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-Cdrxh2KL.js").then((n) => n.ak);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1]) : void 0);
      await removeGroupMember.mutateAsync({
        groupId,
        target: Principal.fromText(userId)
      });
      ue.success(`${username} removed from group.`);
    } catch {
      ue.error("Failed to remove member.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      className: "w-72 border-l border-border bg-card flex flex-col flex-shrink-0",
      "data-ocid": "members-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3.5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Group Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "size-7",
              onClick: onClose,
              "aria-label": "Close panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden", children: (group == null ? void 0 : group.icon) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: group.icon.getDirectURL(),
                alt: group.name,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-7 text-primary/70" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: group == null ? void 0 : group.name }),
              (group == null ? void 0 : group.description) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 max-w-[200px]", children: group.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "w-full justify-start gap-2",
                  onClick: onEditGroup,
                  "data-ocid": "edit-group-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }),
                    "Edit Group"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "w-full justify-start gap-2",
                  onClick: onAddMember,
                  "data-ocid": "add-member-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-3.5" }),
                    "Add Member"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full justify-start gap-2 text-destructive hover:text-destructive hover:border-destructive/40",
                onClick: onLeave,
                "data-ocid": "leave-group-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-3.5" }),
                  "Leave Group"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2", children: [
              "Members · ",
              members.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: members.map((m) => {
              const userId = m.userId.toText();
              const isMe = userId === selfId;
              const isMemberOwner = m.role === GroupMemberRole.owner;
              const shortId = `${userId.slice(0, 6)}…${userId.slice(-4)}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "member-row",
                  className: "flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-secondary/60 transition-smooth group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { name: shortId, size: "sm" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: shortId }),
                        isMe && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold text-primary/70 bg-primary/10 px-1 rounded", children: "You" })
                      ] }),
                      isMemberOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-primary font-medium", children: "Owner" })
                    ] }),
                    isOwner && !isMe && !isMemberOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-6 opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive",
                        onClick: () => handleRemove(userId, shortId),
                        "aria-label": `Remove ${shortId}`,
                        "data-ocid": "remove-member-btn",
                        disabled: removeGroupMember.isPending,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "size-3" })
                      }
                    )
                  ]
                },
                userId
              );
            }) })
          ] })
        ] }) })
      ]
    }
  );
}
function GroupChatPage() {
  var _a, _b;
  const { id } = useParams({ from: "/groups/$id" });
  const groupId = BigInt(id);
  const navigate = useNavigate();
  const { principal } = useAuth();
  const selfId = (principal == null ? void 0 : principal.toText()) ?? "";
  const { data: group } = useGroup(groupId);
  const { data: members = [] } = useGroupMembers(groupId);
  const { data: messages = [], isLoading } = useGroupMessages(groupId);
  const sendMessage = useSendGroupMessage();
  const leaveGroup = useLeaveGroup();
  const markRead = useMarkGroupRead();
  const groupIdStr = id;
  const typingConvId = `group:${groupIdStr}`;
  const { typingUsers, onKeydown, onStopTyping } = useTypingIndicator(typingConvId);
  const [text, setText] = reactExports.useState("");
  const [showPanel, setShowPanel] = reactExports.useState(false);
  const [showEditDialog, setShowEditDialog] = reactExports.useState(false);
  const [showAddMember, setShowAddMember] = reactExports.useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = reactExports.useState(false);
  const [attachedFile, setAttachedFile] = reactExports.useState(null);
  const fileAttachRef = reactExports.useRef(null);
  const scrollRef = reactExports.useRef(null);
  const memberMap = Object.fromEntries(
    members.map((m) => [m.userId.toText(), m])
  );
  const selfMember = memberMap[selfId];
  const isOwner = (selfMember == null ? void 0 : selfMember.role) === GroupMemberRole.owner;
  const lastMsgId = ((_a = messages[messages.length - 1]) == null ? void 0 : _a.id) ?? null;
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lastMsgId]);
  reactExports.useEffect(() => {
    if (lastMsgId !== null) {
      markRead.mutate({ groupId, upToMsgId: lastMsgId });
    }
  }, [lastMsgId, groupId]);
  const handleSend = async () => {
    const content = text.trim();
    if (!content && !attachedFile) return;
    setText("");
    onStopTyping();
    let file;
    if (attachedFile) {
      const bytes = new Uint8Array(await attachedFile.arrayBuffer());
      file = ExternalBlob.fromBytes(bytes);
      setAttachedFile(null);
    }
    sendMessage.mutate({
      groupId,
      req: { content: content || (attachedFile == null ? void 0 : attachedFile.name) || "", file }
    });
  };
  const handleLeaveConfirm = async () => {
    try {
      await leaveGroup.mutateAsync(groupId);
      ue.success("You've left the group.");
      navigate({ to: "/groups" });
    } catch {
      ue.error("Failed to leave group.");
    }
  };
  const handleFileAttach = (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (file) {
      setAttachedFile(file);
      ue.info(`${file.name} ready to send`);
    }
  };
  const getSenderName = (senderId) => {
    return `${senderId.slice(0, 6)}…${senderId.slice(-4)}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 px-5 py-3 border-b border-border bg-card flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden", children: (group == null ? void 0 : group.icon) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: group.icon.getDirectURL(),
            alt: group.name,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-primary/70" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: (group == null ? void 0 : group.name) ?? "Loading…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            members.length,
            " member",
            members.length !== 1 ? "s" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "size-8",
            onClick: () => setShowPanel((v) => !v),
            "aria-label": showPanel ? "Hide group info" : "Show group info",
            "data-ocid": "toggle-panel-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: scrollRef,
          className: "flex-1 overflow-y-auto px-5 py-4",
          "data-ocid": "messages-scroll-area",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-6" }),
              title: "No messages yet",
              description: "Be the first to say something!",
              className: "h-full"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            GroupMessageWithExtras,
            {
              message: msg,
              isSelf: msg.senderId.toText() === selfId,
              selfId,
              showSender: true,
              senderName: getSenderName(msg.senderId.toText()),
              groupId: id
            },
            msg.id.toString()
          )) })
        }
      ),
      typingUsers.filter((u) => u.toText() !== selfId).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-4 py-1.5 bg-background border-t border-border/50 flex-shrink-0",
          "data-ocid": "typing-indicator",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: typingUsers.filter((u) => u.toText() !== selfId).length === 1 ? "Someone is typing…" : "Several people are typing…" })
        }
      ),
      attachedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-primary/10 border-t border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium truncate flex-1", children: attachedFile.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "size-5",
            onClick: () => setAttachedFile(null),
            "aria-label": "Remove attachment",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-t border-border bg-card flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "text-muted-foreground hover:text-foreground size-8 flex-shrink-0",
            "aria-label": "Attach file",
            "data-ocid": "attach-file-btn",
            onClick: () => {
              var _a2;
              return (_a2 = fileAttachRef.current) == null ? void 0 : _a2.click();
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileAttachRef,
            type: "file",
            className: "sr-only",
            onChange: handleFileAttach
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-ocid": "group-message-input",
            type: "text",
            value: text,
            onChange: (e) => setText(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              } else {
                onKeydown();
              }
            },
            onBlur: onStopTyping,
            placeholder: attachedFile ? "Add a caption (optional)…" : "Type a message…",
            className: "flex-1 min-w-0 bg-secondary/40 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-smooth"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            className: "size-8 flex-shrink-0",
            onClick: handleSend,
            disabled: !text.trim() && !attachedFile || sendMessage.isPending,
            "data-ocid": "send-group-message-btn",
            "aria-label": "Send message",
            children: sendMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
          }
        )
      ] })
    ] }),
    showPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MembersPanel,
      {
        groupId,
        selfId,
        isOwner,
        onClose: () => setShowPanel(false),
        onEditGroup: () => setShowEditDialog(true),
        onAddMember: () => setShowAddMember(true),
        onLeave: () => setShowLeaveConfirm(true)
      }
    ),
    group && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditGroupDialog,
      {
        groupId,
        initialName: group.name,
        initialDescription: group.description,
        initialIconUrl: (_b = group.icon) == null ? void 0 : _b.getDirectURL(),
        open: showEditDialog,
        onClose: () => setShowEditDialog(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddMemberDialog,
      {
        groupId,
        open: showAddMember,
        onClose: () => setShowAddMember(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LeaveConfirmDialog,
      {
        open: showLeaveConfirm,
        onConfirm: handleLeaveConfirm,
        onCancel: () => setShowLeaveConfirm(false),
        isLeaving: leaveGroup.isPending
      }
    )
  ] });
}
export {
  GroupChatPage
};
