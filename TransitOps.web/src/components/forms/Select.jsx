import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    className,
    containerClassName,
    options = [],
    placeholder,
    required,
    id,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="ml-0.5 text-[#B3241F]">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-text-primary",
          "transition-colors duration-150 focus:outline-none",
          "focus:border-ink-500 focus:shadow-focus",
          error ? "border-[#B3241F]" : "border-border-strong",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs font-medium text-[#B3241F]">{error}</p>
      ) : helper ? (
        <p className="text-xs text-text-secondary">{helper}</p>
      ) : null}
    </div>
  );
});
