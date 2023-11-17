import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@/auth/dto/login.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { RefreshDto } from '@/auth/dto/refresh.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/registration')
  async registration(@Body() registerDto: RegisterDto) {
    return this.authService.registration(registerDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('/refresh')
  async refreshToken(@Req() req, @Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(req, refreshDto);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Patch('/profile')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req) {
    return this.authService.logout(req.accessToken);
  }
}
