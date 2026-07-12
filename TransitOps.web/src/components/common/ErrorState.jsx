/**
 * ErrorState.jsx — Error / failure placeholder
 * Shown when a query fails. Accepts an optional retry callback.
 */
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

/**
 * @param {{
 *   title?: string,
 *   message?: string,
 *   onRetry?: () => void,
 * }} props
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-[#B3241F]">
        <AlertTriangle size={40} strokeWidth={1.5} />
      </span>
      <p className="font-display text-[15px] font-semibold text-text-primary">{title}</p>
      <p className="text-[13px] text-text-secondary max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
