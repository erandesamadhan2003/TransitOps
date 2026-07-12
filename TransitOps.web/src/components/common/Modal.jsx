/**
 * Modal.jsx — Design system Modal (Elevated Glass spec)
 *
 * Sizes: sm | md | lg
 * Closes on Escape + locks body scroll.
 * Entry animation: y 8px → 0, scale 0.98 → 1, 160ms ease-out.
 */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   size?: 'sm' | 'md' | 'lg',
 *   className?: string,
 *   children: React.ReactNode,
 * }} props
 */
export function Modal({ open, onClose, title, size = 'md', className, children }) {
  const panelRef = useRef(null)

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus trap — move focus to panel on open
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/40 animate-[fade-in_150ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative w-full glass-elevated p-6 outline-none',
          'animate-[modal-in_160ms_ease-out]',
          SIZE_MAP[size],
          className,
        )}
        style={{
          animation: 'modal-in 160ms ease-out',
        }}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[18px] font-bold text-text-primary tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-secondary hover:bg-ink-50 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
