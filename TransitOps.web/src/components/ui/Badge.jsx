import { cn } from "@/utils/cn";

const TONES = {
  neutral: "bg-ink-50 text-ink-600 border-ink-100",
  outline: "bg-white text-text-secondary border-border-strong",
};

export function Badge({ tone = "neutral", icon, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
