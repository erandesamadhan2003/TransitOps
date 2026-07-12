/**
 * Card.jsx — Standard Glass Card + CardHeader
 *
 * Card:       glassmorphic surface, 16px radius, 20px padding
 * CardHeader: Display font title + optional subtitle + action slot
 */
import { cn } from '@/utils/cn'

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
export function Card({ className, children }) {
  return (
    <div className={cn('glass-card p-5', className)}>
      {children}
    </div>
  )
}

/**
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   action?: React.ReactNode,
 *   className?: string,
 * }} props
 */
export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
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
  )
}
