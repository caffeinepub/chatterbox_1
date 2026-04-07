import { d as useNavigate, s as useCreateGroup, t as useAddGroupMember, v as useFindUserByUsername, r as reactExports, j as jsxRuntimeExports, B as Button, U as Users, I as Input, A as Avatar, X, a as LoadingSpinner, w as Search, x as LoaderCircle, E as ExternalBlob } from "./index-Cdrxh2KL.js";
import { L as Label } from "./label-C_Jd5bfH.js";
import { T as Textarea, U as UserMinus } from "./textarea-DvKDpSw7.js";
import { u as ue } from "./index-DcPRr7eS.js";
import { A as ArrowLeft } from "./arrow-left-CpdXjC9x.js";
import { C as Camera } from "./camera-DKP42KTi.js";
import { U as UserPlus } from "./user-plus-CMnLDUOd.js";
function NewGroupPage() {
  const navigate = useNavigate();
  const createGroup = useCreateGroup();
  const addMember = useAddGroupMember();
  const findUser = useFindUserByUsername();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [iconFile, setIconFile] = reactExports.useState(null);
  const [iconPreview, setIconPreview] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [memberQuery, setMemberQuery] = reactExports.useState("");
  const [memberResult, setMemberResult] = reactExports.useState(void 0);
  const [pendingMembers, setPendingMembers] = reactExports.useState([]);
  const fileInputRef = reactExports.useRef(null);
  const handleIconChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setIconFile(file);
    const url = URL.createObjectURL(file);
    setIconPreview(url);
  };
  const handleMemberSearch = async (e) => {
    e == null ? void 0 : e.preventDefault();
    if (!memberQuery.trim()) return;
    setMemberResult(void 0);
    const user = await findUser.mutateAsync(memberQuery.trim());
    setMemberResult(user);
  };
  const addPendingMember = (user) => {
    if (!pendingMembers.some((m) => m.userId.toText() === user.userId.toText())) {
      setPendingMembers((prev) => [...prev, user]);
    }
    setMemberQuery("");
    setMemberResult(void 0);
  };
  const removePendingMember = (userId) => {
    setPendingMembers(
      (prev) => prev.filter((m) => m.userId.toText() !== userId)
    );
  };
  const handleCreate = async () => {
    if (!name.trim()) return;
    let icon;
    if (iconFile) {
      const bytes = new Uint8Array(await iconFile.arrayBuffer());
      icon = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (pct) => setUploadProgress(pct)
      );
    }
    try {
      const groupId = await createGroup.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        icon
      });
      if (pendingMembers.length > 0) {
        await Promise.allSettled(
          pendingMembers.map(
            (m) => addMember.mutateAsync({ groupId, newMember: m.userId })
          )
        );
      }
      ue.success(`Group "${name.trim()}" created!`);
      navigate({ to: "/groups/$id", params: { id: groupId.toString() } });
    } catch {
      ue.error("Failed to create group. Please try again.");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleCreate();
    }
  };
  const isSubmitting = createGroup.isPending || addMember.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 px-6 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "size-8",
          onClick: () => navigate({ to: "/groups" }),
          "aria-label": "Go back to groups",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground", children: "New Group" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md mx-auto px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            className: "relative group size-24 rounded-2xl overflow-hidden bg-secondary/60 border-2 border-dashed border-border hover:border-primary/50 transition-smooth cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "aria-label": "Upload group icon",
            "data-ocid": "group-icon-upload",
            children: iconPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: iconPreview,
                  alt: "Group icon preview",
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-6 text-foreground" }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-1.5 h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-8 text-muted-foreground/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-4 text-muted-foreground/50" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click to upload icon (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handleIconChange,
            tabIndex: -1
          }
        )
      ] }),
      isSubmitting && iconFile && uploadProgress > 0 && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Uploading icon…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            uploadProgress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-primary transition-all duration-300 rounded-full",
            style: { width: `${uploadProgress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "group-name", className: "font-medium", children: [
          "Group Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "group-name",
            "data-ocid": "group-name-input",
            placeholder: "e.g. Design Team, Project Alpha, Family Chat",
            value: name,
            onChange: (e) => setName(e.target.value),
            onKeyDown: handleKeyDown,
            className: "bg-secondary/30",
            maxLength: 80,
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
          name.length,
          "/80"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "group-description", className: "font-medium", children: [
          "Description",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "group-description",
            "data-ocid": "group-description-input",
            placeholder: "What's this group about? Give members context.",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            className: "bg-secondary/30 resize-none",
            rows: 3,
            maxLength: 300
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
          description.length,
          "/300"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-medium", children: [
          "Add Members",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: "Search by username. You can also add members later from the group page." }),
        pendingMembers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col gap-2",
            "data-ocid": "pending-members-list",
            children: pendingMembers.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/40 border border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Avatar,
                    {
                      name: m.username,
                      size: "sm",
                      presence: m.presence
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-foreground truncate", children: m.username }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      className: "size-6 text-muted-foreground hover:text-destructive flex-shrink-0",
                      onClick: () => removePendingMember(m.userId.toText()),
                      "aria-label": `Remove ${m.username}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
                    }
                  )
                ]
              },
              m.userId.toText()
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleMemberSearch, className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "member-search-input",
              placeholder: "Enter exact username…",
              value: memberQuery,
              onChange: (e) => {
                setMemberQuery(e.target.value);
                setMemberResult(void 0);
              },
              className: "flex-1 bg-secondary/30"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              variant: "outline",
              disabled: findUser.isPending || !memberQuery.trim(),
              "data-ocid": "member-search-btn",
              className: "flex-shrink-0",
              children: findUser.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4" })
            }
          )
        ] }),
        findUser.isSuccess && memberResult === null && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-1", children: "No user found with that username." }),
        memberResult != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card",
            "data-ocid": "member-search-result",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  name: memberResult.username,
                  size: "sm",
                  presence: memberResult.presence
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-foreground truncate", children: memberResult.username }),
              pendingMembers.some(
                (m) => m.userId.toText() === memberResult.userId.toText()
              ) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted", children: "Added" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  onClick: () => addPendingMember(memberResult),
                  "data-ocid": "add-member-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-3.5 mr-1" }),
                    "Add"
                  ]
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleCreate,
          disabled: isSubmitting || !name.trim(),
          "data-ocid": "create-group-submit-btn",
          className: "w-full",
          size: "lg",
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-2 animate-spin" }),
            "Creating…"
          ] }) : pendingMembers.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "size-4 mr-2" }),
            "Create Group with ",
            pendingMembers.length,
            " member",
            pendingMembers.length !== 1 ? "s" : ""
          ] }) : "Create Group"
        }
      )
    ] }) }) })
  ] });
}
export {
  NewGroupPage
};
