import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { SessionService } from '@/session/session.service';
import { errorMessage } from '@/utils/errorMessage';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (await this.accessTokenIsRevoked(accessToken)) {
      throw this.unauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET_KEY'),
      });

      const user = await this.usersService.findOneById(id);
      user['accessToken'] = accessToken;
      request['user'] = user;
    } catch {
      throw this.unauthorizedException();
    }
    return true;
  }

  private unauthorizedException(): HttpException {
    return new HttpException(
      { error: errorMessage.Unauthorized },
      HttpStatus.UNAUTHORIZED,
    );
  }

  private async accessTokenIsRevoked(token): Promise<boolean> {
    const accessToken = await this.sessionService.findAccessToken(token);
    return !token || !accessToken || accessToken.revoked;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
