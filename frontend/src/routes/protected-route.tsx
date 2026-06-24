import { type ReactNode } from 'react'

type ProtectedRouteProps = Readonly<{
  children: ReactNode
}>

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporary foundation logic: replace this passthrough with a real auth/session guard later.
  return <>{children}</>
}
