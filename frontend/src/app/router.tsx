import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { DashboardPlaceholder } from '@/components/shared/dashboard-placeholder'
import { LandingPage } from '@/pages/public/landing-page'
import { LoginPage } from '@/pages/public/login-page'
import { NotFoundPage } from '@/pages/public/not-found-page'
import { SignupPage } from '@/pages/public/signup-page'
import { ProtectedRoute } from '@/routes/protected-route'
import { RoleRoute } from '@/routes/role-route'
import { USER_ROLES, type UserRole } from '@/types/auth'

type DashboardRouteConfig = Readonly<{
  path: string
  role: UserRole
}>

const dashboardRouteConfigs = [
  { path: '/student/dashboard', role: USER_ROLES.STUDENT },
  { path: '/lecturer/dashboard', role: USER_ROLES.LECTURER },
  { path: '/moderator/dashboard', role: USER_ROLES.INTERNAL_MODERATOR },
  { path: '/coordinator/dashboard', role: USER_ROLES.PROGRAMME_COORDINATOR },
  { path: '/admin/dashboard', role: USER_ROLES.ADMIN },
] as const satisfies readonly DashboardRouteConfig[]

export const APP_ROUTE_PATHS: readonly string[] = [
  '/',
  '/login',
  '/signup',
  ...dashboardRouteConfigs.map(({ path }) => path),
  '/missing-route',
]

const dashboardRoutes: RouteObject[] = dashboardRouteConfigs.map(({ path, role }) => ({
  path,
  element: (
    <ProtectedRoute>
      <RoleRoute role={role}>
        <DashboardPlaceholder role={role} />
      </RoleRoute>
    </ProtectedRoute>
  ),
}))

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  ...dashboardRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export const router = createBrowserRouter(appRoutes)
