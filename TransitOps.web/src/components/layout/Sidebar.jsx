import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Truck, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getInitials } from "@/utils/format";
import { cn } from "@/utils/cn";

export function Sidebar({
  nav = [],
  appName = "TransitOps",
  user = null,
  onLogout,
  mobileOpen = false,
  onMobileClose,
  expanded = true,
  onToggleExpand,
}) {

  const mainNav = nav.filter(item => item.label !== "Settings" && item.label !== "Users");
  const bottomNav = nav.filter(item => item.label === "Settings" || item.label === "Users");

  const NavItem = ({ item, isMobile }) => (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={isMobile ? onMobileClose : undefined}
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
          {(!expanded && !isMobile) ? null : (
            <span className="whitespace-nowrap overflow-hidden">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  const navLinks = (
    <>
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scroll-none">
        {mainNav.map((item) => <NavItem key={item.path} item={item} isMobile={true} />)}
      </nav>
      {bottomNav.length > 0 && (
        <nav className="px-3 py-2 space-y-0.5 shrink-0 border-t border-border/50">
          {bottomNav.map((item) => <NavItem key={item.path} item={item} isMobile={true} />)}
        </nav>
      )}
    </>
  );

  const userBlock = user && (
    <div className="px-3 py-4 shrink-0">
      <div
        className="flex items-center gap-3 rounded-[16px] px-3 py-2.5"
        style={{
          background: "rgba(255,255,255,0.4)",
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        <div className="h-[34px] w-[34px] shrink-0 rounded-full brand-gradient flex items-center justify-center text-white text-[12px] font-bold">
          {getInitials(user.fullName || user.name)}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[13px] font-medium text-text-primary truncate">
            {user.fullName || user.name}
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
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center gap-3 px-[22px] py-5 shrink-0">
      <div className="h-9 w-9 shrink-0 rounded-[10px] brand-gradient flex items-center justify-center">
        <Truck size={18} className="text-white" />
      </div>
      <div className="overflow-hidden whitespace-nowrap">
        <p className="text-[13px] font-bold text-text-primary">{appName}</p>
        {user?.roleName && (
          <p className="text-[11px] text-text-secondary mt-0.5">
            {user.roleName}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — explicit toggle */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-40 glass-sidebar transition-all duration-300 shrink-0 overflow-hidden",
          "ease-[cubic-bezier(0.4,0,0.2,1)]",
          expanded ? "w-[260px]" : "w-[80px]",
        )}
        aria-label="Primary navigation"
      >
        <div className={cn("flex items-center px-[22px] py-5 shrink-0 transition-all", expanded ? "justify-between" : "flex-col justify-center gap-4")}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-[10px] brand-gradient flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            {expanded && (
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-[13px] font-bold text-text-primary">{appName}</p>
                {user?.roleName && (
                  <p className="text-[11px] text-text-secondary mt-0.5 capitalize">
                    {user.roleName}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={onToggleExpand}
            className="p-1.5 shrink-0 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scroll-none">
          {mainNav.map((item) => <NavItem key={item.path} item={item} isMobile={false} />)}
        </nav>
        {bottomNav.length > 0 && (
          <nav className="px-3 py-2 space-y-0.5 shrink-0 border-t border-border/50">
            {bottomNav.map((item) => <NavItem key={item.path} item={item} isMobile={false} />)}
          </nav>
        )}

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
                {getInitials(user.fullName || user.name)}
              </div>
              {expanded && (
                <>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[13px] font-medium text-text-primary truncate">
                      {user.fullName || user.name}
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

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside className="relative flex flex-col w-[280px] h-full glass-elevated">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[10px] brand-gradient flex items-center justify-center">
                  <Truck size={18} className="text-white" />
                </div>
                <span className="text-[14px] font-bold text-text-primary">{appName}</span>
              </div>
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {navLinks}
            {userBlock}
          </aside>
        </div>
      )}
    </>
  );
}
