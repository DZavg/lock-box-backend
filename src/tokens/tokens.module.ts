import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '@/sessions/entities/session.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRATION') + 's',
        },
      }),
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
