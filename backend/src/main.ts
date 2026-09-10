import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createLogger, format, transports } from 'winston';

async function bootstrap() {
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
    ),
    transports: [
      new transports.Console(),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 启用CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API文档配置
  const config = new DocumentBuilder()
    .setTitle('Minecraft Server API')
    .setDescription('Minecraft服务器官方网站API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  logger.info(`Application is running on: http://localhost:${port}`);
  logger.info(`Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
