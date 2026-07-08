import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'
import { DatabaseHealthResponseDto, HealthResponseDto } from './health.controller'

@Injectable()
export class HealthService {
  constructor(@Inject(PrismaService) private readonly prismaService: PrismaService) {}

  getHealth(): HealthResponseDto {
    return {
      success: true,
      service: 'AIMS Campus Management API',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }
  }

  async getDatabaseHealth(): Promise<DatabaseHealthResponseDto> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`

      return {
        success: true,
        database: 'PostgreSQL',
        status: 'connected',
        timestamp: new Date().toISOString(),
      }
    } catch {
      throw new ServiceUnavailableException({
        success: false,
        database: 'PostgreSQL',
        status: 'unavailable',
        timestamp: new Date().toISOString(),
      })
    }
  }
}
