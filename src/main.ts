// Main entry point for the NestJS application

//* NestJS modules
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//* Config
import { envs } from './config/envs';

// * Application module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Cargohub RESTful API')
    .setDescription('Cargohub endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory);

  await app.listen(envs.port ?? 3000);
}
bootstrap();
