export const USER_ROLES = {
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  INTERNAL_MODERATOR: 'INTERNAL_MODERATOR',
  PROGRAMME_COORDINATOR: 'PROGRAMME_COORDINATOR',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES]

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  status: UserStatus
  roles: readonly UserRole[]
  createdAt: string
  updatedAt: string
}

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  user: AuthUser
}

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  user: AuthUser
}
