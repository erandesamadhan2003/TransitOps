/**
 * cn.js — className utility
 * Thin wrapper around clsx for conditional class merging.
 *
 * Usage:
 *   cn('base-class', condition && 'conditional-class', { 'another': isTrue })
 */
import { clsx } from 'clsx'

/**
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
