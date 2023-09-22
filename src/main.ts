import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errorsList) => {
        const errors = {};
        errorsList.forEach(function (error) {
          errors[error.property] = Object.values(error.constraints);
        });
        return new BadRequestException({
          errors,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      },
    }),
  );
  await app.listen(5001);
}
bootstrap();
