import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'

type ProtectedRouteProps = Readonly<{
  children: ReactNode
}>

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="page-shell">
        <section className="surface">
          <p className="eyebrow">AIMS</p>
          <h1 className="page-title">Checking Session</h1>
          <p className="page-copy">Confirming your authentication state before loading the dashboard.</p>
        </section>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
