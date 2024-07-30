import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';
import { CreateAccessDto } from '@/accesses/dto/create-access.dto';
import { AccessesService } from '@/accesses/accesses.service';
import { successMessage } from '@/utils/successMessage';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private accessesService: AccessesService,
  ) {}
  async create(user: User, createProjectDto: CreateProjectDto) {
    const newProject = this.projectRepository.create({
      ...createProjectDto,
      user,
    });
    await this.projectRepository.save(newProject);
    return { message: successMessage.createProject };
  }

  async createAccess(user: User, id: number, createAccessDto: CreateAccessDto) {
    const project = await this.findOneById(user, id);

    await this.accessesService.create(createAccessDto, project);
    return { message: successMessage.createAccess };
  }

  async findAll(user: User, query: string = '') {
    return await this.projectRepository.find({
      where: [
        {
          user: { id: user.id },
          domain: ILike(`%${query}%`),
        },
        {
          user: { id: user.id },
          title: ILike(`%${query}%`),
        },
      ],
      order: {
        title: 'ASC',
      },
    });
  }

  async findAllAccesses(user: User, id: number) {
    const project = await this.findOneById(user, id);
    const accesses = await this.accessesService.findAll(project);
    return {
      project,
      accesses,
    };
  }

  async findOneById(user: User, id: number) {
    if (!Number.isInteger(id)) {
      throw new HttpException(
        { error: errorMessage.ProjectNotFound },
        HttpStatus.NOT_FOUND,
      );
    }

    const project = await this.projectRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });

    if (!project) {
      throw new HttpException(
        { error: errorMessage.ProjectNotFound },
        HttpStatus.NOT_FOUND,
      );
    }

    return project;
  }

  async update(user: User, id: number, updateProjectDto: UpdateProjectDto) {
    await this.findOneById(user, id);
    await this.projectRepository.update({ id }, updateProjectDto);
    return { message: successMessage.updateProject };
  }

  async remove(user: User, id: number) {
    await this.findOneById(user, id);
    await this.projectRepository.delete(id);
    return { message: successMessage.deleteProject };
  }
}
