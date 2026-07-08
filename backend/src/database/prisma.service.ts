import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL')

    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured for Prisma.')
    }

    super({
      adapter: new PrismaPg({ connectionString }),
    })
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect()
    } catch {
      throw new Error('Failed to connect to PostgreSQL through Prisma.')
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }
}
