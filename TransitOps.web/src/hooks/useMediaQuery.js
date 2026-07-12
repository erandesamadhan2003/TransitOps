/**
 * useMediaQuery — reactive CSS media query hook.
 * Used for responsive sidebar behavior (mobile vs desktop layout).
 *
 * @param {string} query - e.g. '(max-width: 768px)'
 * @returns {boolean}
 */
import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)

    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [query])

  return matches
}
