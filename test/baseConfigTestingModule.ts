import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DataSource } from 'typeorm';

export default async function () {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();

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

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const dataSource = moduleRef.get<DataSource>(DataSource);

  return { app, dataSource };
}
