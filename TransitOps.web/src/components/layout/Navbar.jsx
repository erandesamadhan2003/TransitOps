import { Menu, Truck } from "lucide-react";

export function Navbar({ appName = "TransitOps", onMenuClick }) {
  return (
    <header
      className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-[60px]"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(197,216,236,0.5)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-[8px] brand-gradient flex items-center justify-center">
          <Truck size={16} className="text-white" />
        </div>
        <span className="text-[14px] font-bold text-text-primary">
          {appName}
        </span>
      </div>

      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
