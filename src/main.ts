import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerDocs from '@/utils/swaggerDocs';
import { useContainer } from 'class-validator';
import validationPipe from '@/utils/validationPipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(validationPipe);

  const document = SwaggerModule.createDocument(app, swaggerDocs);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = app.get<ConfigService>(ConfigService);
  await app.listen(config.get('PORT'));
}
bootstrap();
