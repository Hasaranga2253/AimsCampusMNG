import { ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'
import { Prisma, RoleName, UserStatus } from '../../generated/prisma/client'
import { userWithRolesInclude, UserWithRoles } from '../auth/auth.types'

interface CreateStudentUserInput {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithRoles | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: userWithRolesInclude,
    })
  }

  async findById(id: string): Promise<UserWithRoles | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      include: userWithRolesInclude,
    })
  }

  async createStudentUser(input: CreateStudentUserInput): Promise<UserWithRoles> {
    const studentRole = await this.prismaService.role.findUnique({
      where: { name: RoleName.STUDENT },
    })

    if (!studentRole) {
      throw new InternalServerErrorException('Student role is not configured.')
    }

    try {
      return await this.prismaService.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          passwordHash: input.passwordHash,
          status: UserStatus.ACTIVE,
          userRoles: {
            create: [{ roleId: studentRole.id }],
          },
        },
        include: userWithRolesInclude,
      })
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An account with this email already exists.')
      }

      throw error
    }
  }
}
