import { Injectable } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/utils/password';
import { SessionService } from '@/session/session.service';

interface comparePasswordDTO {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
  ) {}

  async registration(user: User) {
    return { message: 'Пользователь успешно зарегистрирован' };
  }

  async comparePassword(userDto: comparePasswordDTO) {
    const user = await this.userService.findOneByEmail(userDto.email);
    if (!user) return false;
    return await comparePassword(userDto.password || '', user.password);
  }

  async logout(user: any) {
    return 'true';
    // return await this.sessionService.revokeAccessToken(user.accessToken);
  }
}
