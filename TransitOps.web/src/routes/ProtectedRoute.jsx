/**
 * ProtectedRoute.jsx
 *
 * Wraps authenticated-only routes. Redirects to /login if no token found.
 * Renders the AppLayout shell (Sidebar + Navbar + main content) for all
 * protected pages.
 */
import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '@/services/auth.service'
import { AppLayout } from '@/components/layout'

export function ProtectedRoute() {
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
