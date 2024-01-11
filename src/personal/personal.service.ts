import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UpdateUserBySelfDto } from '@/personal/dto/update-user-by-self.dto';
import { UpdatePasswordDto } from '@/personal/dto/update-password.dto';

@Injectable()
export class PersonalService {
  constructor(private userService: UsersService) {}
  async updateUser(userId: number, updateUserBySelfDto: UpdateUserBySelfDto) {
    return await this.userService.updateBySelf(userId, updateUserBySelfDto);
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(userId, updatePasswordDto);
  }
}
