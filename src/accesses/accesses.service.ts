import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Access } from '@/accesses/entities/access.entity';
import { errorMessage } from '@/utils/errorMessage';
import { ProjectDto } from '@/projects/dto/project.dto';
import { User } from '@/users/entities/user.entity';
import { UpdateAccessDto } from '@/accesses/dto/update-access.dto';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createAccessDto: CreateAccessDto, project: ProjectDto) {
    const newAccess = await this.accessRepository.create({
      ...createAccessDto,
      project,
    });
    await this.accessRepository.save(newAccess);
    return { message: 'success' };
  }

  async findAll(project: ProjectDto) {
    return await this.accessRepository.find({ where: { project } });
  }

  async findOneById(id: number, user: User) {
    const userId = user?.id;

    const access = await this.accessRepository
      .createQueryBuilder('access')
      .innerJoin('access.project', 'project')
      .innerJoin('project.user', 'user')
      .select(['access.id', 'access.origin', 'access.login', 'access.type'])
      .where('user.id = :id', { id: userId })
      .andWhere('access.id = :accessId', { accessId: id })
      .getOne();

    if (!access) {
      throw new HttpException(
        { error: errorMessage.AccessNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }

    return access;
  }

  async findPasswordById(id: number, user: User) {
    const userId = user?.id;

    const password = await this.accessRepository
      .createQueryBuilder('access')
      .innerJoin('access.project', 'project')
      .innerJoin('project.user', 'user')
      .select('access.password')
      .where('user.id = :id', { id: userId })
      .andWhere('access.id = :accessId', { accessId: id })
      .getOne();

    if (!password) {
      throw new HttpException(
        { error: errorMessage.PasswordNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }

    return password;
  }

  async update(id: number, updateAccessDto: UpdateAccessDto, user: User) {
    await this.findOneById(id, user);
    await this.accessRepository.update({ id }, updateAccessDto);
    return { message: 'success' };
  }

  async remove(id: number, user: User) {
    await this.findOneById(id, user);
    await this.accessRepository.delete(id);
    return { message: 'success' };
  }
}
