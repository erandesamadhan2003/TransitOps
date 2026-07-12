import { ArrowDown, Minus, ArrowUp, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

const PRIORITY_CONFIG = {
  low: {
    fg: "#4B5A6A",
    bg: "#EEF1F4",
    border: "#D2D9E0",
    icon: <ArrowDown size={11} />,
  },
  medium: {
    fg: "#2563a8",
    bg: "#dceaf7",
    border: "#a8c0d6",
    icon: <Minus size={11} />,
  },
  high: {
    fg: "#B5540A",
    bg: "#FCE9D9",
    border: "#F0BE8E",
    icon: <ArrowUp size={11} />,
  },
  critical: {
    fg: "#B3241F",
    bg: "#FBE2E1",
    border: "#F0AFAC",
    icon: <AlertTriangle size={11} />,
  },
};

const FALLBACK = PRIORITY_CONFIG.low;

export function PriorityBadge({ priority, label, className }) {
  const key = priority?.toLowerCase();
  const config = PRIORITY_CONFIG[key] ?? FALLBACK;
  const displayLabel = label ?? key;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold capitalize",
        className,
      )}
      style={{
        color: config.fg,
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      {config.icon}
      {displayLabel}
    </span>
  );
}
