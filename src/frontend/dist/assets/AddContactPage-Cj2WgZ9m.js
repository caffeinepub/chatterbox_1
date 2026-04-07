import { y as createLucideIcon, d as useNavigate, e as useAuth, v as useFindUserByUsername, r as reactExports, j as jsxRuntimeExports, B as Button, I as Input, a as LoadingSpinner, w as Search, A as Avatar } from "./index-Cdrxh2KL.js";
import { L as Label } from "./label-C_Jd5bfH.js";
import { u as ue } from "./index-DcPRr7eS.js";
import { S as StatusBadge } from "./StatusBadge-fwvnYNuH.js";
import { u as useContacts, a as useSendContactRequest } from "./useContacts-Ddo-GIcN.js";
import { A as ArrowLeft } from "./arrow-left-CpdXjC9x.js";
import { U as UserPlus } from "./user-plus-CMnLDUOd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
function AddContactPage() {
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { data: contacts = [] } = useContacts();
  const findUser = useFindUserByUsername();
  const sendRequest = useSendContactRequest();
  const [query, setQuery] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(
    void 0
  );
  const [sent, setSent] = reactExports.useState(false);
  const isAlreadyContact = result != null ? contacts.some((c) => c.userId.toText() === result.userId.toText()) : false;
  const isSelf = result != null ? (principal == null ? void 0 : principal.toText()) === result.userId.toText() : false;
  async function handleSearch(e) {
    e == null ? void 0 : e.preventDefault();
    if (!query.trim()) return;
    setSent(false);
    setResult(void 0);
    const user = await findUser.mutateAsync(query.trim());
    setResult(user);
  }
  function handleAdd() {
    if (!result) return;
    sendRequest.mutate(result.userId, {
      onSuccess: () => {
        ue.success(`Request sent to ${result.username}`);
        setSent(true);
      },
      onError: () => ue.error("Failed to send request. A request may already exist.")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 px-4 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "size-8",
          onClick: () => navigate({ to: "/contacts" }),
          "aria-label": "Go back",
          "data-ocid": "add-contact-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground", children: "Add Contact" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSearch, className: "flex flex-col gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username-search", className: "text-sm font-medium", children: "Find by username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "username-search",
              "data-ocid": "username-search-input",
              placeholder: "Enter exact username…",
              value: query,
              onChange: (e) => {
                setQuery(e.target.value);
                setResult(void 0);
                setSent(false);
              },
              className: "flex-1 bg-secondary/30",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: findUser.isPending || !query.trim(),
              "data-ocid": "search-user-btn",
              children: findUser.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 mr-1.5" }),
                "Find"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Username must be exact — share your username from your profile so others can find you." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
        findUser.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }),
        findUser.isSuccess && result === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 px-5 py-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No user found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Make sure the username is spelled exactly right." })
        ] }),
        result != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4",
            "data-ocid": "search-result",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  name: result.username,
                  size: "md",
                  presence: result.presence
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: result.username }),
                result.status && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate mt-0.5", children: result.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusBadge,
                  {
                    presence: result.presence,
                    showLabel: true,
                    className: "mt-1"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: isSelf ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted", children: "That's you" }) : isAlreadyContact ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-emerald-400 px-2 py-1 rounded-md bg-emerald-500/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3.5" }),
                "Connected"
              ] }) : sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-primary px-2 py-1 rounded-md bg-primary/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3.5" }),
                "Sent"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: handleAdd,
                  disabled: sendRequest.isPending,
                  "data-ocid": "send-request-btn",
                  children: sendRequest.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-3.5 mr-1.5" }),
                    "Add"
                  ] })
                }
              ) })
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AddContactPage
};
