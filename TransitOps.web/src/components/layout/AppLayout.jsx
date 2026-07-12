/**
 * AppLayout.jsx — Authenticated app shell
 *
 * Composes: Sidebar + Navbar + main content area.
 *
 * To set up navigation, define your nav array here once you know your pages:
 *
 *   const NAV = [
 *     { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
 *     { label: 'Vehicles',  path: '/vehicles', icon: <Truck size={18} /> },
 *   ]
 *
 * Then pass it to <Sidebar nav={NAV} />.
 */
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { authService } from '@/services/auth.service'

// Define nav items here as you build pages
const NAV = []

/**
 * @param {{ children: React.ReactNode }} props
 */
export function AppLayout({ children }) {
  const navigate = useNavigate()
  const user = authService.getUser()

  function handleLogout() {
    authService.clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar nav={NAV} user={user} onLogout={handleLogout} />

      {/* Mobile top bar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-[60px] md:pt-0">
        <div className="p-8 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  )
}
