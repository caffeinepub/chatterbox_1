const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Cdrxh2KL.js","assets/index-BsaToAap.css"])))=>i.map(i=>d[i]);
import { y as createLucideIcon, e as useAuth, Z as useProfile, _ as useSaveProfile, r as reactExports, $ as PresenceStatus, j as jsxRuntimeExports, a as LoadingSpinner, a0 as Settings, B as Button, a1 as LogOut, A as Avatar, I as Input, a2 as __vitePreload } from "./index-Cdrxh2KL.js";
import { L as Label } from "./label-C_Jd5bfH.js";
import { u as ue } from "./index-DcPRr7eS.js";
import { S as StatusBadge } from "./StatusBadge-fwvnYNuH.js";
import { C as Camera } from "./camera-DKP42KTi.js";
import { C as Check } from "./check-1SopV4gL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode);
const presenceOptions = [
  { value: PresenceStatus.online, label: "Online", dotClass: "bg-emerald-500" },
  { value: PresenceStatus.away, label: "Away", dotClass: "bg-amber-500" },
  {
    value: PresenceStatus.offline,
    label: "Offline",
    dotClass: "bg-muted-foreground/50"
  }
];
function ProfilePage() {
  const { principal, logout } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const saveProfile = useSaveProfile();
  const [username, setUsername] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [presence, setPresence] = reactExports.useState(
    PresenceStatus.online
  );
  const [avatarBlob, setAvatarBlob] = reactExports.useState(
    void 0
  );
  const [avatarPreview, setAvatarPreview] = reactExports.useState(
    void 0
  );
  const [saved, setSaved] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setStatus(profile.status ?? "");
      setPresence(profile.presence ?? PresenceStatus.online);
      if (profile.avatar && !avatarPreview) {
        setAvatarPreview(profile.avatar.getDirectURL());
      }
    }
  }, [profile]);
  async function handleAvatarChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const { ExternalBlob: EB } = await __vitePreload(async () => {
      const { ExternalBlob: EB2 } = await import("./index-Cdrxh2KL.js").then((n) => n.aj);
      return { ExternalBlob: EB2 };
    }, true ? __vite__mapDeps([0,1]) : void 0);
    const bytes = new Uint8Array(await file.arrayBuffer());
    setAvatarBlob(EB.fromBytes(bytes));
    setAvatarPreview(URL.createObjectURL(file));
  }
  async function handleSave(e) {
    e.preventDefault();
    setSaved(false);
    await saveProfile.mutateAsync({
      username: username.trim(),
      status: status.trim(),
      avatar: avatarBlob
    });
    ue.success("Profile saved!");
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  }
  function copyPrincipal() {
    if (principal) {
      navigator.clipboard.writeText(principal.toText());
      ue.success("Principal ID copied to clipboard");
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground", children: "Profile Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "text-muted-foreground hover:text-destructive",
          onClick: logout,
          "data-ocid": "logout-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 mr-1.5" }),
            "Sign Out"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-lg mx-auto px-6 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "flex flex-col gap-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              name: username || "?",
              src: avatarPreview,
              presence,
              size: "lg"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              className: "absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth cursor-pointer",
              "aria-label": "Change avatar",
              "data-ocid": "avatar-upload-trigger",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5 text-white" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handleAvatarChange,
            "data-ocid": "avatar-file-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-base text-foreground", children: (profile == null ? void 0 : profile.username) || "New User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { presence, showLabel: true, className: "mt-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Click avatar to change photo" })
        ] })
      ] }),
      principal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Your Principal ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-xs text-muted-foreground font-mono truncate", children: principal.toText() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "size-6 flex-shrink-0",
              onClick: copyPrincipal,
              "aria-label": "Copy principal ID",
              "data-ocid": "copy-principal-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Share this ID with others so they can add you as a contact." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username-input", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "username-input",
            "data-ocid": "username-input",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            placeholder: "Choose a unique username",
            maxLength: 32,
            className: "bg-secondary/30"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status-input", children: "Status Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "status-input",
            "data-ocid": "status-input",
            value: status,
            onChange: (e) => setStatus(e.target.value),
            placeholder: "What's on your mind?",
            maxLength: 120,
            className: "bg-secondary/30"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
          status.length,
          "/120"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Presence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: presenceOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setPresence(opt.value),
            className: `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-smooth ${presence === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"}`,
            "data-ocid": `presence-${opt.value}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-2 rounded-full ${opt.dotClass}` }),
              opt.label
            ]
          },
          opt.value
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: saveProfile.isPending || !username.trim(),
          className: "w-full",
          "data-ocid": "save-profile-btn",
          children: saveProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "Saving…" })
          ] }) : saved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 mr-2" }),
            "Saved!"
          ] }) : "Save Changes"
        }
      ),
      saveProfile.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive text-center -mt-3", children: "Failed to save. Please try again." })
    ] }) }) })
  ] });
}
export {
  ProfilePage
};
