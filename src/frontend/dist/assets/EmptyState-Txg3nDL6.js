import { j as jsxRuntimeExports, T as cn } from "./index-Cdrxh2KL.js";
function EmptyState({
  icon,
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "empty-state",
      className: cn(
        "flex flex-col items-center justify-center gap-3 py-16 px-8 text-center",
        className
      ),
      children: [
        icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/60 mb-2", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-base text-foreground", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs leading-relaxed", children: description }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: action })
      ]
    }
  );
}
export {
  EmptyState as E
};
