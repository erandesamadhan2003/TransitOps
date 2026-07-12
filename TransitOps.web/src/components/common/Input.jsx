/**
 * Input.jsx — Design system Input component
 * Label + input + helper/error slots.
 * Forwards ref to the underlying <input> for react-hook-form compatibility.
 */
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

/**
 * @type {React.ForwardRefExoticComponent<{
 *   label?: string,
 *   error?: string,
 *   helper?: string,
 *   leftAdornment?: React.ReactNode,
 *   rightAdornment?: React.ReactNode,
 *   containerClassName?: string,
 *   className?: string,
 * } & React.InputHTMLAttributes<HTMLInputElement>>}
 */
export const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    leftAdornment,
    rightAdornment,
    containerClassName,
    className,
    id,
    ...rest
  },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftAdornment && (
          <span className="absolute left-3 text-text-tertiary pointer-events-none">
            {leftAdornment}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border border-border-strong bg-white px-3 text-[14px] text-text-primary',
            'placeholder:text-text-tertiary',
            'transition-shadow duration-150',
            'focus:outline-none focus:border-ink-500 focus:shadow-focus',
            error && 'border-[#B3241F] focus:border-[#B3241F] focus:shadow-[0_0_0_3px_rgba(179,36,31,0.18)]',
            leftAdornment && 'pl-9',
            rightAdornment && 'pr-9',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          {...rest}
        />
        {rightAdornment && (
          <span className="absolute right-3 text-text-tertiary">
            {rightAdornment}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-[12px] font-medium text-[#B3241F]" role="alert">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${inputId}-helper`} className="text-[12px] text-text-secondary">
          {helper}
        </p>
      )}
    </div>
  )
})
