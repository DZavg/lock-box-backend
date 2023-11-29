import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashStringBySha256 } from '@/utils/hash';
import { TokensDto } from '@/tokens/dto/tokens.dto';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async generateTokens(payload, options) {
    const accessToken = await this.generateAccessToken(payload, options);
    const refreshToken = await this.generateRefreshToken(payload, options);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async generateAccessToken(payload, options) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('ACCESS_TOKEN_EXPIRATION')}s`,
      ...options,
    });
  }

  async generateRefreshToken(payload, options) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRATION')}s`,
      ...options,
    });
  }

  async hashTokens(tokens: TokensDto) {
    const hashAccessToken = hashStringBySha256(tokens.access_token);
    const hashRefreshToken = hashStringBySha256(tokens.refresh_token);

    return {
      access_token: hashAccessToken,
      refresh_token: hashRefreshToken,
    };
  }

  async verifyToken(token: string, secretKey: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });
      return { ...payload, expired: false };
    } catch (e) {
      return { expired: true };
    }
  }

  getJwtId(accessToken: string) {
    return JSON.parse(JSON.stringify(this.jwtService.decode(accessToken))).jti;
  }
}
