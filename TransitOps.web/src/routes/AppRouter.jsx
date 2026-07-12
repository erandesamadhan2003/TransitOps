/**
 * AppRouter.jsx
 *
 * Add routes here as you build pages.
 * Each page-level component is lazy-loaded automatically.
 *
 * Pattern for adding a new route:
 *   1. Create the page: src/features/<name>/pages/<Name>Page.jsx
 *   2. Lazy import it below
 *   3. Add it under <ProtectedRoute> (or <PublicRoute> if public)
 */
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { Loader } from '@/components/common'

// ── Public pages ──────────────────────────────────────────────────────────────
// const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))

// ── Protected pages ───────────────────────────────────────────────────────────
// const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))

// ── 404 ───────────────────────────────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="lg" />
    </div>
  )
}

const router = createBrowserRouter([
  // ── Public routes ─────────────────────────────────────────────────────────
  {
    element: <PublicRoute />,
    children: [
      // { path: '/login', element: <LoginPage /> },
    ],
  },

  // ── Protected routes (rendered inside AppLayout shell) ────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      // { path: '/', element: <DashboardPage /> },
      // Add feature routes here as pages are built
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
