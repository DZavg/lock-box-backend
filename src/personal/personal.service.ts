import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UpdateUserBySelfDto } from '@/personal/dto/update-user-by-self.dto';
import { ChangePasswordDto } from '@/personal/dto/change-password.dto';

@Injectable()
export class PersonalService {
  constructor(private userService: UsersService) {}
  async updateUser(userId: number, updateUserBySelfDto: UpdateUserBySelfDto) {
    return await this.userService.updateBySelf(userId, updateUserBySelfDto);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(userId, changePasswordDto);
  }
}
