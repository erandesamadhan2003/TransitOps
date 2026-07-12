/**
 * useLocalStorage — synced localStorage state hook.
 * Behaves like useState but persists to localStorage.
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (val: T | ((prev: T) => T)) => void]}
 */
import { useState, useCallback } from 'react'
import { storageService } from '@/services/storage.service'

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    const saved = storageService.get(key)
    return saved !== null ? saved : initialValue
  })

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        storageService.set(key, next)
        return next
      })
    },
    [key],
  )

  return [stored, setValue]
}
