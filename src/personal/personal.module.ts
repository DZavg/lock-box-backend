import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from '@/sessions/sessions.module';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [UsersModule, ConfigModule, SessionsModule, TokensModule],
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService],
})
export class PersonalModule {}
