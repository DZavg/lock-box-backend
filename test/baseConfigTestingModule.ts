import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DataSource } from 'typeorm';
import validationPipe from '@/utils/validationPipe';

export default async function () {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();

  app.useGlobalPipes(validationPipe);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const dataSource = moduleRef.get<DataSource>(DataSource);

  return { app, dataSource };
}
