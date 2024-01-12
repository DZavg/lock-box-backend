import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '@/sessions/entities/session.entity';
import { ConfigModule } from '@nestjs/config';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), ConfigModule, TokensModule],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
