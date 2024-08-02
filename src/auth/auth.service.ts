import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import {
  compareStringWithHashByBcrypt,
  hashStringByBcrypt,
} from '@/utils/hash';
import { SessionsService } from '@/sessions/sessions.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { errorMessage } from '@/utils/errorMessage';
import { RegisterDto } from '@/auth/dto/register.dto';
import { successMessage } from '@/utils/successMessage';
import { RefreshDto } from '@/sessions/dto/refresh.dto';
import { TokensService } from '@/tokens/tokens.service';
import { RecoveryPasswordDto } from '@/auth/dto/recovery-password.dto';
import { ConfirmationCodesService } from '@/confirmation-codes/confirmation-codes.service';
import { SALT_FOR_PASSWORD } from '@/utils/constants';
import { demoAccess } from '@/utils/demoAccess';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionService: SessionsService,
    private tokensService: TokensService,
    private confirmationCodesService: ConfirmationCodesService,
  ) {}

  async registration(registerDto: RegisterDto) {
    await this.userService.create(registerDto);
    return { message: successMessage.registration };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    const equalsPass = await compareStringWithHashByBcrypt(
      loginDto.password || '',
      user?.password,
    );

    if (!equalsPass) {
      throw new HttpException(
        { error: errorMessage.LoginError },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.sessionService.createSession(user);
  }

  async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
    await this.confirmationCodesService.verifyCode({
      email: recoveryPasswordDto.email,
      code: recoveryPasswordDto.code,
    });

    const hashedPassword = await hashStringByBcrypt(
      recoveryPasswordDto.password,
      SALT_FOR_PASSWORD,
    );

    await this.userService.updatePassword({
      email: recoveryPasswordDto.email,
      password: hashedPassword,
    });

    return { message: successMessage.changePassword };
  }

  async refreshToken(req, refreshDto: RefreshDto) {
    return await this.sessionService.refreshToken(req, refreshDto);
  }

  async logout(accessToken: string) {
    const jwtId = this.tokensService.getJwtId(accessToken);
    await this.sessionService.revokeSession(jwtId);
    return { message: successMessage.logout };
  }

  async demoAccess() {
    return this.login({
      email: demoAccess.email,
      password: demoAccess.password,
    });
  }
}
