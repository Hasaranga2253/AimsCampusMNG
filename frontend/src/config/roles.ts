import { USER_ROLES, type UserRole } from '@/types/auth'

export const ROLE_OPTIONS = [
  USER_ROLES.STUDENT,
  USER_ROLES.LECTURER,
  USER_ROLES.INTERNAL_MODERATOR,
  USER_ROLES.PROGRAMME_COORDINATOR,
  USER_ROLES.ADMIN,
] as const satisfies readonly UserRole[]

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.LECTURER]: 'Lecturer',
  [USER_ROLES.INTERNAL_MODERATOR]: 'Internal Moderator',
  [USER_ROLES.PROGRAMME_COORDINATOR]: 'Programme Coordinator',
  [USER_ROLES.ADMIN]: 'Administrator',
}

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  [USER_ROLES.STUDENT]: '/student/dashboard',
  [USER_ROLES.LECTURER]: '/lecturer/dashboard',
  [USER_ROLES.INTERNAL_MODERATOR]: '/moderator/dashboard',
  [USER_ROLES.PROGRAMME_COORDINATOR]: '/coordinator/dashboard',
  [USER_ROLES.ADMIN]: '/admin/dashboard',
}

const ROLE_REDIRECT_PRIORITY = [
  USER_ROLES.ADMIN,
  USER_ROLES.PROGRAMME_COORDINATOR,
  USER_ROLES.INTERNAL_MODERATOR,
  USER_ROLES.LECTURER,
  USER_ROLES.STUDENT,
] as const satisfies readonly UserRole[]

export function getDefaultDashboardPathForRoles(roles: readonly UserRole[]): string | null {
  for (const role of ROLE_REDIRECT_PRIORITY) {
    if (roles.includes(role)) {
      return ROLE_DASHBOARD_PATHS[role]
    }
  }

  return null
}

export function hasRequiredRole(roles: readonly UserRole[], requiredRole: UserRole): boolean {
  return roles.includes(requiredRole)
}
