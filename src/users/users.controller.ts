import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import PostgresErrorCodeEnum from '@/database/types/postgresErrorCode.enum';
import { hashPassword } from '@/utils/password';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hashPassword(createUserDto.password);
      return await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCodeEnum.UniqueViolation) {
        throw new HttpException(
          { error: 'Пользователь с таким email уже существует' },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        { error: 'Сервер не отвечает' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: number) {
    return this.usersService.findOneById(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
