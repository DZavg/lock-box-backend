import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesController } from './accesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from '@/accesses/entities/access.entity';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from '@/sessions/sessions.module';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Access]),
    UsersModule,
    ConfigModule,
    SessionsModule,
    TokensModule,
  ],
  controllers: [AccessesController],
  providers: [AccessesService],
  exports: [AccessesService],
})
export class AccessesModule {}
