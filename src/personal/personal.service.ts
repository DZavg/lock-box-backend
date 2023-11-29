import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersService } from '@/users/users.service';

@Injectable()
export class PersonalService {
  constructor(private userService: UsersService) {}
  async update(userId: number, updateUserDto: UpdateUserDto) {
    return await this.userService.update(userId, updateUserDto);
  }
}
