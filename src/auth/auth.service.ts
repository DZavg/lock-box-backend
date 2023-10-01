import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/utils/password';
import { SessionService } from '@/session/session.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { errorMessage } from '@/utils/errorMessage';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
  ) {}

  async registration(user: User) {
    return { message: 'Пользователь успешно зарегистрирован' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    const equalsPass = await comparePassword(
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

  async logout(user: any) {
    await this.sessionService.revokeAccessToken(user.accessToken);
    return { message: 'success' };
  }
}
