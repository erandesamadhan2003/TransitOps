/**
 * format.js — Generic formatting utilities
 * Uses dayjs (already in package.json) for date/time.
 * All functions are pure — no side effects.
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(duration)

// ── Date / Time ────────────────────────────────────────────────────────────────
/**
 * Format a date to "12 Jul 2026"
 * @param {string | Date | number} date
 * @returns {string}
 */
export function formatDate(date) {
  return dayjs(date).format('D MMM YYYY')
}

/**
 * Format a date to "12 Jul 2026, 10:30 AM"
 * @param {string | Date | number} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return dayjs(date).format('D MMM YYYY, h:mm A')
}

/**
 * Relative time: "3 hours ago", "in 2 days"
 * @param {string | Date | number} date
 * @returns {string}
 */
export function timeAgo(date) {
  return dayjs(date).fromNow()
}

// ── Currency ────────────────────────────────────────────────────────────────────
/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} [currency='INR']
 * @param {string} [locale='en-IN']
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Numbers ─────────────────────────────────────────────────────────────────────
/**
 * Compact number: 1200 → "1.2K", 1500000 → "1.5M"
 * @param {number} value
 * @returns {string}
 */
export function formatCompactNumber(value) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value)
}

// ── Strings ─────────────────────────────────────────────────────────────────────
/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert snake_case / kebab-case to a human-readable label.
 * "in_progress" → "In Progress"
 * @param {string} str
 * @returns {string}
 */
export function toLabel(str) {
  return str
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Get initials from a full name (up to 2 chars).
 * "Rahul Sharma" → "RS"
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}
