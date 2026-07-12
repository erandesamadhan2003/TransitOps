/**
 * StatusBadge.jsx — Lifecycle status pill badge
 * Maps status keys → semantic colors from theme.md §2.6
 *
 * Supported statuses: open | in_progress | resolved | closed | reopened
 * Also handles: scheduled | completed | cancelled | active | inactive | maintenance
 */
import {
  Circle, Clock, CheckCircle2, Archive, RotateCcw,
  CalendarClock, XCircle, Wrench
} from 'lucide-react'
import { cn } from '@/utils/cn'

/** @type {Record<string, { fg: string, bg: string, border: string, icon: React.ReactNode }>} */
const STATUS_CONFIG = {
  open:        { fg: '#2563a8', bg: '#dceaf7', border: '#a8c0d6', icon: <Circle size={11} /> },
  in_progress: { fg: '#92620A', bg: '#FDF3DC', border: '#F1D896', icon: <Clock size={11} /> },
  resolved:    { fg: '#1F7A5C', bg: '#E1F5EC', border: '#A9DFC7', icon: <CheckCircle2 size={11} /> },
  closed:      { fg: '#5A6A7A', bg: '#EEF1F4', border: '#D2D9E0', icon: <Archive size={11} /> },
  reopened:    { fg: '#7C3AAD', bg: '#F1E9FA', border: '#D9BFEF', icon: <RotateCcw size={11} /> },
  // Trip statuses
  scheduled:   { fg: '#2563a8', bg: '#dceaf7', border: '#a8c0d6', icon: <CalendarClock size={11} /> },
  completed:   { fg: '#1F7A5C', bg: '#E1F5EC', border: '#A9DFC7', icon: <CheckCircle2 size={11} /> },
  cancelled:   { fg: '#5A6A7A', bg: '#EEF1F4', border: '#D2D9E0', icon: <XCircle size={11} /> },
  // Vehicle statuses
  active:      { fg: '#1F7A5C', bg: '#E1F5EC', border: '#A9DFC7', icon: <CheckCircle2 size={11} /> },
  inactive:    { fg: '#5A6A7A', bg: '#EEF1F4', border: '#D2D9E0', icon: <Circle size={11} /> },
  maintenance: { fg: '#92620A', bg: '#FDF3DC', border: '#F1D896', icon: <Wrench size={11} /> },
}

/** Fallback for unknown statuses */
const FALLBACK = { fg: '#5A6A7A', bg: '#EEF1F4', border: '#D2D9E0', icon: <Circle size={11} /> }

/**
 * @param {{
 *   status: string,
 *   label?: string,
 *   className?: string,
 * }} props
 */
export function StatusBadge({ status, label, className }) {
  const key = status?.toLowerCase().replace(/\s+/g, '_')
  const config = STATUS_CONFIG[key] ?? FALLBACK
  const displayLabel = label ?? key?.replace(/_/g, ' ')

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold capitalize',
        className,
      )}
      style={{
        color: config.fg,
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      {config.icon}
      {displayLabel}
    </span>
  )
}
