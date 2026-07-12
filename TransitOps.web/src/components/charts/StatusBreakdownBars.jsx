import { cn } from "@/utils/cn";

const STATUS_META = {
  available: { label: "Available", color: "#16a34a" },
  on_trip: { label: "On Trip", color: "#2563a8" },
  in_shop: { label: "In Shop", color: "#d97706" },
  retired: { label: "Retired", color: "#64748b" },
};

export function StatusBreakdownBars({ data = {}, className }) {
  const entries = Object.entries(data);
  const max = Math.max(1, ...entries.map(([, v]) => v));

  return (
    <div className={cn("space-y-3", className)}>
      {entries.map(([key, value]) => {
        const meta = STATUS_META[key] ?? { label: key, color: "#2563a8" };
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-text-secondary">
              {meta.label}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-ink-50">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(value / max) * 100}%`,
                  backgroundColor: meta.color,
                }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-semibold text-text-primary">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
