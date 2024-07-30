import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Access } from '@/accesses/entities/access.entity';
import { errorMessage } from '@/utils/errorMessage';
import { ProjectDto } from '@/projects/dto/project.dto';
import { User } from '@/users/entities/user.entity';
import { UpdateAccessDto } from '@/accesses/dto/update-access.dto';
import { successMessage } from '@/utils/successMessage';
import { AccessType } from '@/accesses/entities/access-type.entity';
import { AccessTypeDto } from '@/accesses/dto/access-type.dto';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
    @InjectRepository(AccessType)
    private accessTypeRepository: Repository<AccessType>,
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
    return await this.accessRepository.find({
      where: { project },
      relations: {
        type: true,
      },
      order: {
        login: 'ASC',
      },
    });
  }

  async findAllTypes(): Promise<AccessType[]> {
    return await this.accessTypeRepository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  async findTypeById(typeId: AccessTypeDto): Promise<AccessType> {
    const type = await this.accessTypeRepository.findOne({
      where: {
        id: Number(typeId),
      },
    });

    if (!type) {
      throw new HttpException(
        { error: errorMessage.AccessTypeNotFound },
        HttpStatus.NOT_FOUND,
      );
    }

    return type;
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
        HttpStatus.NOT_FOUND,
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
        HttpStatus.NOT_FOUND,
      );
    }

    return password;
  }

  async update(id: number, updateAccessDto: UpdateAccessDto, user: User) {
    await this.findOneById(id, user);

    if (updateAccessDto.type) {
      await this.findTypeById(updateAccessDto.type);
    }

    await this.accessRepository.update({ id }, updateAccessDto);
    return { message: successMessage.updateAccess };
  }

  async remove(id: number, user: User) {
    await this.findOneById(id, user);
    await this.accessRepository.delete(id);
    return { message: successMessage.deleteAccess };
  }
}
