import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

@ApiTags('Personal')
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @UseGuards(AuthGuard)
  @Get('/data')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch('/data')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.personalService.update(req.user.id, updateUserDto);
  }
}
