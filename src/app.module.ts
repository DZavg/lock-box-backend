import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import ValidationSchema from '@/utils/validationSchema';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { PersonalModule } from './personal/personal.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object(ValidationSchema),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SessionModule,
    PersonalModule,
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
