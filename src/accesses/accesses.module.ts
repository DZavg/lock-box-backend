import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesController } from './accesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from '@/accesses/entities/access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Access])],
  controllers: [AccessesController],
  providers: [AccessesService],
})
export class AccessesModule {}
