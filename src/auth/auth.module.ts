import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from '@/tokens/tokens.module';
import { ConfirmationCodesModule } from '@/confirmation-codes/confirmation-codes.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    JwtModule,
    ConfigModule,
    TokensModule,
    ConfirmationCodesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
