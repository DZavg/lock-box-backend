import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '@/session/session.module';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [UsersModule, JwtModule, ConfigModule, SessionModule, TokensModule],
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService],
})
export class PersonalModule {}
