import { Menu, Truck, Moon, Sun } from "lucide-react";

export function Navbar({ appName = "TransitOps", onMenuClick, isDark, onToggleTheme }) {
  return (
    <header
      className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-[60px]"
      style={{
        background: isDark
          ? "rgba(13,21,32,0.92)"
          : "rgba(255,255,255,0.85)",
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

      <div className="flex items-center gap-1">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

// Desktop dark mode toggle — rendered in AppLayout beside main content on md+
export function DesktopThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="hidden md:flex fixed bottom-6 right-6 z-30 p-3 rounded-full glass-elevated shadow-lg text-text-secondary hover:text-ink-600 transition-all hover:scale-105"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
