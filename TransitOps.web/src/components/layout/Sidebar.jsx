import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Truck } from "lucide-react";
import { getInitials } from "@/utils/format";
import { cn } from "@/utils/cn";

export function Sidebar({
  nav = [],
  appName = "TransitOps",
  user = null,
  onLogout,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full glass-sidebar transition-all duration-300 shrink-0 overflow-hidden",
        "ease-[cubic-bezier(0.4,0,0.2,1)]",
        expanded ? "w-[260px]" : "w-[80px]",
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label="Primary navigation"
    >
      {}
      <div className="flex items-center gap-3 px-[22px] py-5 shrink-0">
        <div className="h-9 w-9 shrink-0 rounded-[10px] brand-gradient flex items-center justify-center">
          <Truck size={18} className="text-white" />
        </div>
        {expanded && (
          <div className="overflow-hidden whitespace-nowrap">
            <p className="text-[13px] font-bold text-text-primary">{appName}</p>
            {user?.role && (
              <p className="text-[11px] text-text-secondary mt-0.5 capitalize">
                {user.role.replace("_", " ")}
              </p>
            )}
          </div>
        )}
      </div>

      {}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scroll-none">
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                "border text-[13px] font-medium",
                isActive
                  ? "text-ink-600 bg-white/80 border-border/60 shadow-[0_4px_12px_rgba(37,99,168,0.06)]"
                  : "text-[#4A6278] bg-transparent border-transparent hover:bg-ink-50/70",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 inset-y-2 w-[3px] rounded-r bg-ink-500"
                    aria-hidden="true"
                  />
                )}
                <span className="shrink-0 ml-0.5">{item.icon}</span>
                {expanded && (
                  <span className="whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {}
      {user && (
        <div className="px-3 py-4 shrink-0">
          <div
            className="flex items-center gap-3 rounded-[16px] px-3 py-2.5"
            style={{
              background: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <div className="h-[34px] w-[34px] shrink-0 rounded-full brand-gradient flex items-center justify-center text-white text-[12px] font-bold">
              {getInitials(user.name)}
            </div>
            {expanded && (
              <>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[13px] font-medium text-text-primary truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-text-secondary truncate">
                    {user.email}
                  </p>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
