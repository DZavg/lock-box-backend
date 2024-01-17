import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { UpdateUserBySelfDto } from '@/personal/dto/update-user-by-self.dto';
import { UserDto } from '@/users/dto/user.dto';
import { ChangePasswordDto } from '@/personal/dto/change-password.dto';

@ApiTags('Personal')
@ApiBearerAuth()
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @UseGuards(AuthGuard)
  @Get('/data')
  getProfile(@Req() req): UserDto {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch('/data')
  async updateUser(
    @Req() req,
    @Body() updateUserBySelfDto: UpdateUserBySelfDto,
  ): Promise<UserDto> {
    return this.personalService.updateUser(req.user.id, updateUserBySelfDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/data/password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.personalService.changePassword(req.user.id, changePasswordDto);
  }
}
