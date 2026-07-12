/**
 * storage.service.js
 *
 * Abstraction over localStorage / sessionStorage.
 * All keys are prefixed with STORAGE_PREFIX to avoid collisions.
 */

const STORAGE_PREFIX = 'transitops:'

/**
 * @param {string} key
 * @returns {string}
 */
function prefixed(key) {
  return `${STORAGE_PREFIX}${key}`
}

export const storageService = {
  /**
   * Get and JSON-parse a value from localStorage.
   * @template T
   * @param {string} key
   * @param {T} [fallback]
   * @returns {T | null}
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(prefixed(key))
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch {
      return fallback
    }
  },

  /**
   * JSON-stringify and persist a value to localStorage.
   * @param {string} key
   * @param {unknown} value
   */
  set(key, value) {
    try {
      localStorage.setItem(prefixed(key), JSON.stringify(value))
    } catch {
      // Storage quota exceeded — silently ignore
    }
  },

  /**
   * Remove a key from localStorage.
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(prefixed(key))
  },

  /**
   * Clear all keys with the app prefix.
   */
  clear() {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(STORAGE_PREFIX)) keysToRemove.push(k)
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  },
}
