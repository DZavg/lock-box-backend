import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import {
  compareStringWithHashByBcrypt,
  hashStringByBcrypt,
} from '@/utils/hash';
import { errorMessage } from '@/utils/errorMessage';
import { SALT_FOR_PASSWORD } from '@/roles/constants';
import { UpdateUserBySelfDto } from '@/personal/dto/update-user-by-self.dto';
import { successMessage } from '@/utils/successMessage';
import { ChangePasswordDto } from '@/personal/dto/change-password.dto';
import { UpdatePasswordDto } from '@/auth/dto/update-password.dto';

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

  async getPasswordById(id: number) {
    return await this.usersRepository.findOne({
      select: ['password'],
      where: { id },
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

  async updateBySelf(id: number, updateUserBySelfDto: UpdateUserBySelfDto) {
    await this.usersRepository.update({ id }, updateUserBySelfDto);
    return await this.findOneById(id);
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword && changePasswordDto.password) {
      const user = await this.getPasswordById(id);

      const passwordsIsMatch =
        changePasswordDto.newPassword.trim() ===
        changePasswordDto.password.trim();

      if (passwordsIsMatch) {
        throw new HttpException(
          { error: errorMessage.PasswordsMatch },
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordIsValid = await compareStringWithHashByBcrypt(
        changePasswordDto.password,
        user.password,
      );

      if (!passwordIsValid) {
        throw new HttpException(
          { error: errorMessage.PasswordError },
          HttpStatus.BAD_REQUEST,
        );
      }

      changePasswordDto.password = await hashStringByBcrypt(
        changePasswordDto.newPassword,
        SALT_FOR_PASSWORD,
      );
    }
    await this.usersRepository.update(
      { id },
      { password: changePasswordDto.password },
    );
    return { message: successMessage.changePassword };
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    await this.usersRepository.update(
      { email: updatePasswordDto.email },
      { password: updatePasswordDto.password },
    );
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { message: 'success' };
  }
}
