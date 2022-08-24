import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: "http://localhost:8080",
    methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
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
