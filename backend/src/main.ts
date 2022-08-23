import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true, 
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }));
  await app.listen(3000);
}
bootstrap();
