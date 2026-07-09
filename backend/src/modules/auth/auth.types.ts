import { Prisma, RoleName, UserStatus } from '../../generated/prisma/client'

export const userWithRolesInclude = {
  userRoles: {
    include: {
      role: true,
    },
  },
} satisfies Prisma.UserInclude

export type UserWithRoles = Prisma.UserGetPayload<{
  include: typeof userWithRolesInclude
}>

export interface JwtPayload {
  sub: string
  email: string
  roles: RoleName[]
}

export interface SafeUser {
  id: string
  firstName: string
  lastName: string
  email: string
  status: UserStatus
  roles: RoleName[]
  createdAt: string
  updatedAt: string
}

export function toSafeUser(user: UserWithRoles): SafeUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    roles: user.userRoles.map((userRole) => userRole.role.name),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}
