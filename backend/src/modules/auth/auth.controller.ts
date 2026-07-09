import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { CurrentUser } from './decorators/current-user.decorator'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import type { JwtPayload } from './auth.types'
import { AuthService, type LoginResponse, type RegisterResponse } from './auth.service'
import { LoginResponseDto, RegisterResponseDto, SafeUserDto } from './dto/auth-response.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

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
