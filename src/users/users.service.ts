import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { hashStringByBcrypt } from '@/utils/hash';
import { errorMessage } from '@/utils/errorMessage';
import { SALT_FOR_PASSWORD } from '@/users/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashStringByBcrypt(
      createUserDto.password,
      SALT_FOR_PASSWORD,
    );
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        { error: errorMessage.UserNotFound },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashStringByBcrypt(
        updateUserDto.password,
        SALT_FOR_PASSWORD,
      );
    }
    await this.usersRepository.update({ id }, updateUserDto);
    return await this.findOneById(id);
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { message: 'success' };
  }
}
