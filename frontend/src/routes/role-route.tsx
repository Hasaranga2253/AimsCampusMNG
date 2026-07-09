import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getDefaultDashboardPathForRoles, hasRequiredRole } from '@/config/roles'
import { useAuth } from '@/hooks/use-auth'
import { type UserRole } from '@/types/auth'

type RoleRouteProps = Readonly<{
  role: UserRole
  children: ReactNode
}>

export function RoleRoute({ role, children }: RoleRouteProps) {
  const { isLoading, roles, user } = useAuth()

  if (isLoading) {
    return (
      <main className="page-shell">
        <section className="surface">
          <p className="eyebrow">AIMS</p>
          <h1 className="page-title">Checking Access</h1>
          <p className="page-copy">Confirming your role permissions for this dashboard.</p>
        </section>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasRequiredRole(roles, role)) {
    const redirectPath = getDefaultDashboardPathForRoles(roles)

    return <Navigate to={redirectPath ?? '/login'} replace />
  }

  return <>{children}</>
}
