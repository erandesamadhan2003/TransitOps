/**
 * routes.js
 *
 * Single source of truth for all client-side route paths.
 * Import ROUTES everywhere — never hardcode path strings.
 *
 * Add routes here as pages are created.
 */
export const ROUTES = {
  LOGIN:     '/login',
  DASHBOARD: '/',
  // Add more as you build pages
}

/**
 * Build a concrete URL from a parameterized route pattern.
 * @example buildRoute('/vehicles/:id', { id: '42' }) → '/vehicles/42'
 *
 * @param {string} pattern
 * @param {Record<string, string | number>} params
 * @returns {string}
 */
export function buildRoute(pattern, params = {}) {
  return Object.entries(params).reduce(
    (path, [key, val]) => path.replace(`:${key}`, String(val)),
    pattern,
  )
}
