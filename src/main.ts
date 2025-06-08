// Main entry point for the NestJS application

//* NestJS modules
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//* External modules
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';

//* Config
import { envs } from './config/envs';

// * Application module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: true, // Permite cualquier origen
    credentials: true,
  });

  // app.enableCors({
  //   origin: (origin, callback) => {
  //     const allowedOrigins = [envs.frontendUrl];
  //     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true,
  // });

  // Usa Helmet para configurar headers de seguridad
  app.use(helmet());

  // app.use(cookieParser());

  // // Configurar csurf con cookies
  // app.use(
  //   csurf({
  //     cookie: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //     },
  //   }),
  // );

  // // Manejar el token CSRF para frontend (por ejemplo enviarlo en una cookie o endpoint)
  // app.use((req, res, next) => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken());
  //   next();
  // });

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
