import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { accessToken } from '@/session/entities/accessToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([accessToken])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
