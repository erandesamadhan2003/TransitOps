/**
 * NotFoundPage.jsx — 404 fallback
 */
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <p className="font-mono text-[72px] font-bold text-ink-100 leading-none">404</p>
      <h1 className="font-display text-[24px] font-bold text-text-primary">Page not found</h1>
      <p className="text-[14px] text-text-secondary max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
    </div>
  )
}
