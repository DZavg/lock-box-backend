import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { IsUniqueConstraint } from '@/utils/decorators/validation/isUnique';
import { ConfigModule } from '@nestjs/config';
import { SessionsModule } from '@/sessions/sessions.module';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    SessionsModule,
    TokensModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, IsUniqueConstraint],
  exports: [UsersService],
})
export class UsersModule {}
