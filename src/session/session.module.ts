import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '@/session/entities/session.entity';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), ConfigModule, TokensModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
