import { cn } from "@/utils/cn";

const ACCENT = {
  ink: { bg: "bg-ink-50", text: "text-ink-600", icon: "text-ink-400" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", icon: "text-teal-400" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-400" },
  slate: { bg: "bg-slate-50", text: "text-slate-600", icon: "text-slate-400" },
  red: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-400" },
};

export function StatCard({ label, value, accent = "ink", icon, className }) {
  const a = ACCENT[accent] ?? ACCENT.ink;
  return (
    <div className={cn("glass-card flex flex-col gap-3 p-4", className)}>
      {icon && (
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            a.bg,
            a.icon,
          )}
        >
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <p className={cn("mt-0.5 font-display text-2xl font-bold", a.text)}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}
