import { Inbox } from "lucide-react";

export function EmptyState({
  icon = <Inbox size={40} strokeWidth={1.5} />,
  title = "No data found",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-text-tertiary">{icon}</span>
      <p className="font-display text-[15px] font-semibold text-text-primary">
        {title}
      </p>
      {description && (
        <p className="text-[13px] text-text-secondary max-w-xs">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
