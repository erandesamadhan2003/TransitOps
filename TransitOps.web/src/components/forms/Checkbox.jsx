import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export const Checkbox = forwardRef(function Checkbox(
  { label, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-2 text-sm"
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-border-strong accent-ink-600",
            "cursor-pointer",
            className,
          )}
          {...props}
        />
        <span className="text-text-primary">{label}</span>
      </label>
      {error && (
        <p className="ml-6 text-xs font-medium text-[#B3241F]">{error}</p>
      )}
    </div>
  );
});
