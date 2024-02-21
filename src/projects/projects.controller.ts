import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { ProjectDto } from '@/projects/dto/project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(
    @Req() req,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService.create(req.user, createProjectDto);
  }

  @Get()
  findAll(@Req() req): Promise<ProjectDto[]> {
    return this.projectsService.findAll(req.user);
  }

  @Get(':id')
  findOneById(@Req() req, @Param('id') id: string): Promise<ProjectDto> {
    return this.projectsService.findOneById(req.user, +id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService.update(req.user, +id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.projectsService.remove(req.user, +id);
  }
}
