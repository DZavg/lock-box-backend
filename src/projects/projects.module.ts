import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@/projects/entities/project.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/users/users.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
    ConfigModule,
    SessionsModule,
    TokensModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
