import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { RoleName, UserStatus } from '../../generated/prisma/client'
import { CurrentUser } from './decorators/current-user.decorator'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtPayload } from './auth.types'
import { AuthService, LoginResponse, RegisterResponse } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

class SafeUserDto {
  @ApiProperty({ example: 'cm1234567890', type: String })
  id!: string

  @ApiProperty({ example: 'AIMS', type: String })
  firstName!: string

  @ApiProperty({ example: 'Student', type: String })
  lastName!: string

  @ApiProperty({ example: 'student@aims.local', type: String })
  email!: string

  @ApiProperty({ enum: UserStatus, enumName: 'UserStatus', type: String })
  status!: UserStatus

  @ApiProperty({ enum: RoleName, enumName: 'RoleName', isArray: true })
  roles!: RoleName[]

  @ApiProperty({ example: '2026-07-08T10:00:00.000Z', type: String })
  createdAt!: string

  @ApiProperty({ example: '2026-07-08T10:00:00.000Z', type: String })
  updatedAt!: string
}

class RegisterResponseDto {
  @ApiProperty({ example: 'Registration successful.', type: String })
  message!: string

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto
}

class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', type: String })
  accessToken!: string

  @ApiProperty({ example: 'Bearer', type: String })
  tokenType!: 'Bearer'

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a student account for local development' })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @ApiConflictResponse({ description: 'An account with this email already exists.' })
  @ApiForbiddenResponse({ description: 'Public student signup is disabled.' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(registerDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate an existing account' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiForbiddenResponse({ description: 'Account is inactive or suspended.' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the current authenticated user profile' })
  @ApiOkResponse({ type: SafeUserDto })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  async getMe(@CurrentUser() currentUser: JwtPayload): Promise<SafeUserDto> {
    return this.authService.getCurrentUser(currentUser)
  }
}
