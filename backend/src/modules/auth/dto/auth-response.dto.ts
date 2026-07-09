import { ApiProperty } from '@nestjs/swagger'

import { RoleName, UserStatus } from '../../../generated/prisma/client'

export class SafeUserDto {
  @ApiProperty({ example: 'cmrbzrovi00001c91kbe3dvdo', type: String })
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

  @ApiProperty({ example: '2026-07-09T04:18:00.000Z', type: String })
  createdAt!: string

  @ApiProperty({ example: '2026-07-09T04:18:00.000Z', type: String })
  updatedAt!: string
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'Registration successful.', type: String })
  message!: string

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', type: String })
  accessToken!: string

  @ApiProperty({ example: 'Bearer', type: String })
  tokenType!: 'Bearer'

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto
}
