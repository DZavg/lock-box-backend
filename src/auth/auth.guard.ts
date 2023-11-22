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
    const origins = ['/auth/refresh'];

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const verifyAccessToken = await this.sessionService.verifyToken(
      accessToken,
      this.configService.get('ACCESS_TOKEN_SECRET_KEY'),
    );

    if (verifyAccessToken.expired && !origins.includes(request.route.path)) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(verifyAccessToken.id);

    if ((await this.accessTokenIsRevoked(accessToken)) || !user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    request.accessToken = accessToken;

    return true;
  }

  private async accessTokenIsRevoked(token): Promise<boolean> {
    const jwtId = this.sessionService.getJwtId(token);
    const accessToken = await this.sessionService.findByJwtId(jwtId);
    return !token || !accessToken || accessToken.revoked;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
