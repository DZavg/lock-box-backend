import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('The best swagger in the world for the Lock Box service')
  .setDescription('The Lock Box API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
