import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerDocs from '@/utils/swaggerDocs';
import { useContainer } from 'class-validator';
import validationPipe from '@/utils/validationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(validationPipe);

  const document = SwaggerModule.createDocument(app, swaggerDocs);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(5001);
}
bootstrap();
