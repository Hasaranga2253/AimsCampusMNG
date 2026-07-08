import 'reflect-metadata'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const frontendUrl = configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173'
  const port = Number(configService.get<string>('PORT') ?? '3001')

  app.enableShutdownHooks()
  app.setGlobalPrefix('api/v1')
  app.enableCors({
    origin: frontendUrl,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AIMS Campus Management API')
    .setDescription('Backend foundation for the AIMS Campus Management System.')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(port)
}

void bootstrap()
