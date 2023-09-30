import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Get,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@/auth/dto/login.dto';
import { UsersService } from '@/users/users.service';
import PostgresErrorCodeEnum from '@/database/types/postgresErrorCode.enum';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { hashPassword } from '@/utils/password';
import { errorMessage } from '@/utils/errorMessage';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/registration')
  async registration(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.userService.create(registerDto);
      return this.authService.registration(user);
    } catch (error) {
      if (error?.code === PostgresErrorCodeEnum.UniqueViolation) {
        throw new HttpException(
          { error: errorMessage.UserWithEmailExist },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        { error: errorMessage.ServerError },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const equalsPass = await this.authService.comparePassword(loginDto);
    if (!equalsPass) {
      throw new HttpException(
        { error: errorMessage.LoginError },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findOneByEmail(loginDto.email);
    return await this.authService.generateTokens(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req) {
    return 'success';
  }
}
