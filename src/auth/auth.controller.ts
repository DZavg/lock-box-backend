import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@/auth/dto/login.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { RefreshDto } from '@/sessions/dto/refresh.dto';
import { RecoveryPasswordDto } from '@/auth/dto/recovery-password.dto';

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

  @Post('/recovery-password')
  async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.authService.recoveryPassword(recoveryPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Post('/refresh')
  async refreshToken(@Req() req, @Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(req, refreshDto);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req) {
    return this.authService.logout(req.accessToken);
  }

  @Get('/demo-access')
  async demoAccess() {
    return this.authService.demoAccess();
  }
}
