import { Controller, Get, Inject } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger'

import { HealthService } from './health.service'

export class HealthResponseDto {
  @ApiProperty({ example: true, type: Boolean })
  success!: true

  @ApiProperty({ example: 'AIMS Campus Management API', type: String })
  service!: string

  @ApiProperty({ example: 'healthy', type: String })
  status!: 'healthy'

  @ApiProperty({ example: '2026-06-24T18:30:00.000Z', type: String })
  timestamp!: string
}

export class DatabaseHealthResponseDto {
  @ApiProperty({ example: true, type: Boolean })
  success!: true

  @ApiProperty({ example: 'PostgreSQL', type: String })
  database!: 'PostgreSQL'

  @ApiProperty({ example: 'connected', type: String })
  status!: 'connected'

  @ApiProperty({ example: '2026-06-24T18:30:00.000Z', type: String })
  timestamp!: string
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check backend service health' })
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    return this.healthService.getHealth()
  }

  @Get('database')
  @ApiOperation({ summary: 'Check PostgreSQL database connectivity' })
  @ApiOkResponse({ type: DatabaseHealthResponseDto })
  @ApiServiceUnavailableResponse({
    description: 'Database connection is unavailable.',
  })
  async getDatabaseHealth(): Promise<DatabaseHealthResponseDto> {
    return this.healthService.getDatabaseHealth()
  }
}
