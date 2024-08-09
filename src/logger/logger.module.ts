import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from '@/logger/logger.service';
import { MyLogger } from '@/logger/entities/logger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyLogger])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
