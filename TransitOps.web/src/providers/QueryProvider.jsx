/**
 * QueryProvider.jsx
 * Wraps the app in TanStack Query's QueryClientProvider + DevTools (dev only).
 */
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
