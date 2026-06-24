import { type ReactNode } from 'react'

import { type UserRole } from '@/types/auth'

type RoleRouteProps = Readonly<{
  role: UserRole
  children: ReactNode
}>

export function RoleRoute({ role, children }: RoleRouteProps) {
  // Temporary foundation logic: replace this passthrough with real role authorization later.
  void role

  return <>{children}</>
}
