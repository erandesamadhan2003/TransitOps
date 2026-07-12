import { cn } from "@/utils/cn";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none select-none";

const VARIANTS = {
  primary: "bg-ink-600 text-white hover:bg-ink-700 active:bg-ink-800",
  secondary:
    "bg-white border border-border text-ink-600 hover:bg-ink-50 active:bg-ink-100",
  danger: "bg-[#B3241F] text-white hover:opacity-90 active:opacity-80",
  ghost: "bg-transparent text-text-secondary hover:bg-ink-50 active:bg-ink-100",
  teal: "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-600",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...rest
}) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
