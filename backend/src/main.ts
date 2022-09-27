import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }));
  await app.listen(3000);
}
bootstrap();
