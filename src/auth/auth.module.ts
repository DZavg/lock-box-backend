import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { SessionModule } from '@/session/session.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    SessionModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
