import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { SessionService } from '@/session/session.service';
import { UnauthorizedException } from '@/utils/exception/unauthorizedException';

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
    const user = await this.verifyToken(accessToken);

    if ((await this.accessTokenIsRevoked(accessToken)) || !user) {
      throw new UnauthorizedException();
    }

    request['user'] = user;

    return true;
  }

  private async verifyToken(accessToken) {
    const { id } = await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET_KEY'),
    });

    const user = await this.usersService.findOneById(id);
    user['accessToken'] = accessToken;
    return user;
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
