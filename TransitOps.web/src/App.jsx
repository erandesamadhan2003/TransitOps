/**
 * App.jsx — Root composition layer
 * Only providers + router. Nothing else lives here.
 */
import { QueryProvider } from '@/providers'
import { AppRouter } from '@/routes/AppRouter'

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  )
}
