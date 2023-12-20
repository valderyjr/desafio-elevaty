import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  // enable cors
  app.enableCors({
    origin: process.env.FE_URL ?? false,
    credentials: true,
  });

  // class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(4000, '0.0.0.0');

  // @TODO: COLOCAR ONDE ESTÁ RODANDO

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
