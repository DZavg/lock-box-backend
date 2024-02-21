import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}
  async create(user: User, createProjectDto: CreateProjectDto) {
    const newProject = await this.projectRepository.create({
      ...createProjectDto,
      user,
    });
    await this.projectRepository.save(newProject);
    return newProject;
  }

  async findAll(user: User) {
    return await this.projectRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOneById(user: User, id: number) {
    return await this.projectRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });
  }

  async update(user: User, id: number, updateProjectDto: UpdateProjectDto) {
    await this.projectRepository.update({ id }, updateProjectDto);
    return await this.findOneById(user, id);
  }

  async remove(user: User, id: number) {
    const project = await this.findOneById(user, id);
    if (project) {
      await this.projectRepository.delete(id);
      return { message: 'success' };
    }
    throw new HttpException(
      { error: 'Проекта с таким id не существует' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
