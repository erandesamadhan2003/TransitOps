/**
 * useDebounce — delays a value update by `delay` ms.
 * Useful for search inputs to avoid firing a query on every keystroke.
 *
 * @template T
 * @param {T} value
 * @param {number} [delay=400]
 * @returns {T}
 */
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
