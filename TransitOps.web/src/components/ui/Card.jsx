import { cn } from "@/utils/cn";

export function Card({ className, children }) {
  return <div className={cn("glass-card p-5", className)}>{children}</div>;
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 mb-4", className)}
    >
      <div>
        <h3 className="font-display text-[15px] font-semibold text-text-primary tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-text-secondary">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
