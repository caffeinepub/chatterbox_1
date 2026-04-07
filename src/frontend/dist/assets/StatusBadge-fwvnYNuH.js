import { j as jsxRuntimeExports, T as cn } from "./index-Cdrxh2KL.js";
const statusConfig = {
  online: { color: "bg-emerald-500", label: "Online" },
  away: { color: "bg-amber-500", label: "Away" },
  offline: { color: "bg-muted-foreground/40", label: "Offline" }
};
function StatusBadge({
  presence,
  className,
  showLabel = false
}) {
  const config = statusConfig[presence] ?? statusConfig.offline;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1.5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("size-2 rounded-full", config.color) }),
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: config.label })
  ] });
}
export {
  StatusBadge as S
};
