import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Wrench,
  Navigation,
  AlertTriangle,
  Ban,
  Archive,
} from "lucide-react";
import { cn } from "@/utils/cn";

const STATUS_CONFIG = {
  available: {
    fg: "#1F7A5C",
    bg: "#E1F5EC",
    border: "#A9DFC7",
    icon: <CheckCircle2 size={11} />,
    label: "Available",
  },
  on_trip: {
    fg: "#2563a8",
    bg: "#dceaf7",
    border: "#a8c0d6",
    icon: <Navigation size={11} />,
    label: "On Trip",
  },
  in_shop: {
    fg: "#92620A",
    bg: "#FDF3DC",
    border: "#F1D896",
    icon: <Wrench size={11} />,
    label: "In Shop",
  },
  retired: {
    fg: "#5A6A7A",
    bg: "#EEF1F4",
    border: "#D2D9E0",
    icon: <Archive size={11} />,
    label: "Retired",
  },

  off_duty: {
    fg: "#5A6A7A",
    bg: "#EEF1F4",
    border: "#D2D9E0",
    icon: <Circle size={11} />,
    label: "Off Duty",
  },
  suspended: {
    fg: "#B3241F",
    bg: "#FDECEA",
    border: "#FACFCC",
    icon: <Ban size={11} />,
    label: "Suspended",
  },

  draft: {
    fg: "#5A6A7A",
    bg: "#EEF1F4",
    border: "#D2D9E0",
    icon: <Circle size={11} />,
    label: "Draft",
  },
  dispatched: {
    fg: "#2563a8",
    bg: "#dceaf7",
    border: "#a8c0d6",
    icon: <Navigation size={11} />,
    label: "Dispatched",
  },
  completed: {
    fg: "#1F7A5C",
    bg: "#E1F5EC",
    border: "#A9DFC7",
    icon: <CheckCircle2 size={11} />,
    label: "Completed",
  },
  cancelled: {
    fg: "#5A6A7A",
    bg: "#EEF1F4",
    border: "#D2D9E0",
    icon: <XCircle size={11} />,
    label: "Cancelled",
  },

  active: {
    fg: "#92620A",
    bg: "#FDF3DC",
    border: "#F1D896",
    icon: <Clock size={11} />,
    label: "Active",
  },
  closed: {
    fg: "#1F7A5C",
    bg: "#E1F5EC",
    border: "#A9DFC7",
    icon: <CheckCircle2 size={11} />,
    label: "Closed",
  },

  open: {
    fg: "#2563a8",
    bg: "#dceaf7",
    border: "#a8c0d6",
    icon: <Circle size={11} />,
    label: "Open",
  },
  in_progress: {
    fg: "#92620A",
    bg: "#FDF3DC",
    border: "#F1D896",
    icon: <Clock size={11} />,
    label: "In Progress",
  },
  resolved: {
    fg: "#1F7A5C",
    bg: "#E1F5EC",
    border: "#A9DFC7",
    icon: <CheckCircle2 size={11} />,
    label: "Resolved",
  },
  reopened: {
    fg: "#7C3AAD",
    bg: "#F1E9FA",
    border: "#D9BFEF",
    icon: <RotateCcw size={11} />,
    label: "Reopened",
  },
};

const FALLBACK = {
  fg: "#5A6A7A",
  bg: "#EEF1F4",
  border: "#D2D9E0",
  icon: <AlertTriangle size={11} />,
};

export function StatusBadge({ status, label, className }) {
  const key = status?.toLowerCase().replace(/[\s-]+/g, "_");
  const config = STATUS_CONFIG[key] ?? FALLBACK;
  const displayLabel = label ?? config.label ?? key?.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
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
