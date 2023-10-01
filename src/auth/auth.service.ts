import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { compareString, hashString } from '@/utils/hash';
import { SessionService } from '@/session/session.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { errorMessage } from '@/utils/errorMessage';
import { RegisterDto } from '@/auth/dto/register.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
  ) {}

  async registration(registerDto: RegisterDto) {
    await this.userService.create(registerDto);
    return { message: 'Пользователь успешно зарегистрирован' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    const equalsPass = await compareString(
      loginDto.password || '',
      user.password,
    );

    if (!equalsPass) {
      throw new HttpException(
        { error: errorMessage.LoginError },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.sessionService.generateTokens(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashString(updateUserDto.password);
    }
    return await this.userService.update(userId, updateUserDto);
  }

  async logout(accessToken: string) {
    console.log(accessToken);
    await this.sessionService.revokeToken(accessToken);
    return { message: 'success' };
  }
}
