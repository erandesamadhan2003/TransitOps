/**
 * PublicRoute.jsx
 *
 * Wraps public-only routes (login page).
 * Redirects already-authenticated users to the dashboard.
 */
import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '@/services/auth.service'

export function PublicRoute() {
  const isAuthenticated = authService.isAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
