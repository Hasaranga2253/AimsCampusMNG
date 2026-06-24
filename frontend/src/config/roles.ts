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
