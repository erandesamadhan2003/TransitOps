import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";

const BAR_COLORS = ["#B3241F", "#B5540A", "#2563a8", "#4c7499", "#7e9db8"];

export function CostliestVehiclesBars({ data = [], className }) {
  const max = Math.max(1, ...data.map((d) => d.cost));

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item, i) => (
        <div
          key={item.vehicleId ?? item.vehicleName}
          className="flex items-center gap-3"
        >
          <span className="w-16 shrink-0 truncate text-xs font-medium text-text-primary">
            {item.vehicleName}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-50">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.cost / max) * 100}%`,
                backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
              }}
            />
          </div>
          <span className="w-20 shrink-0 text-right text-xs font-semibold text-text-primary">
            {formatCurrency(item.cost)}
          </span>
        </div>
      ))}
    </div>
  );
}
