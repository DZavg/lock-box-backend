import { Injectable } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/utils/password';
import { JwtService } from '@nestjs/jwt';

interface comparePasswordDTO {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(user: User) {}

  async comparePassword(userDto: comparePasswordDTO) {
    const user = await this.userService.findOneByEmail(userDto.email);
    if (!user) return false;
    return await comparePassword(userDto.password || '', user.password);
  }

  async generateTokens(user: User) {
    const payload = { id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
