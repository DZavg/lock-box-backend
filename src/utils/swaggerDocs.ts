import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('The best swagger in the world for the PM service')
  .setDescription('The pm API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
