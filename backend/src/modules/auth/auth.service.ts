import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'

import { UserStatus } from '../../generated/prisma/client'
import { UsersService } from '../users/users.service'
import { type JwtPayload, type SafeUser, toSafeUser } from './auth.types'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

export interface RegisterResponse {
  message: string
  user: SafeUser
}

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  user: SafeUser
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    if (!this.isPublicStudentSignupEnabled()) {
      throw new ForbiddenException('Public student signup is currently disabled.')
    }

    const email = this.normalizeEmail(registerDto.email)
    const existingUser = await this.usersService.findByEmail(email)

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.')
    }

    const passwordHash = await hash(registerDto.password, 12)
    const createdUser = await this.usersService.createStudentUser({
      firstName: registerDto.firstName.trim(),
      lastName: registerDto.lastName.trim(),
      email,
      passwordHash,
    })

    return {
      message: 'Registration successful.',
      user: toSafeUser(createdUser),
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const email = this.normalizeEmail(loginDto.email)
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    const passwordMatches = await compare(loginDto.password, user.passwordHash)

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.')
    }

    if (user.status === UserStatus.INACTIVE || user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Account is not active.')
    }

    const safeUser = toSafeUser(user)
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: safeUser.roles,
    })

    return {
      accessToken,
      tokenType: 'Bearer',
      user: safeUser,
    }
  }

  async getCurrentUser(payload: JwtPayload): Promise<SafeUser> {
    const user = await this.usersService.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('Authentication required.')
    }

    return toSafeUser(user)
  }

  private isPublicStudentSignupEnabled(): boolean {
    const configValue = this.configService.get<string>('ALLOW_PUBLIC_STUDENT_SIGNUP')

    return (configValue ?? 'true').toLowerCase() === 'true'
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase()
  }
}
