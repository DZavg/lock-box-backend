import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import swaggerDocs from '@/utils/swaggerDocs';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
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

  const document = SwaggerModule.createDocument(app, swaggerDocs);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(5001);
}
bootstrap();
