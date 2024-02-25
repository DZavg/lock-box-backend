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
import { CreateAccessDto } from '@/accesses/dto/create-access.dto';
import { AccessDto } from '@/accesses/dto/access.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Req() req,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService.create(req.user, createProjectDto);
  }

  @Post(':id/accesses')
  createAccess(
    @Param('id') id: string,
    @Req() req,
    @Body() createAccessDto: CreateAccessDto,
  ) {
    return this.projectsService.createAccess(req.user, +id, createAccessDto);
  }

  @Get()
  findAll(@Req() req): Promise<ProjectDto[]> {
    return this.projectsService.findAll(req.user);
  }

  @Get(':id/accesses')
  findAllAccesses(@Param('id') id: string, @Req() req): Promise<AccessDto[]> {
    return this.projectsService.findAllAccesses(req.user, +id);
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
