import { Injectable } from '@nestjs/common';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { accessToken } from '@/session/entities/accessToken.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(accessToken)
    private readonly accessTokenRepository: Repository<accessToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async saveAccessToken(createAccessTokenDto: CreateAccessTokenDto) {
    const accessToken =
      await this.accessTokenRepository.create(createAccessTokenDto);
    await this.accessTokenRepository.save(accessToken);
    return accessToken;
  }

  async findAccessToken(token: string) {
    return await this.accessTokenRepository.findOneBy({ token });
  }

  async deleteAccessToken(token: string) {
    return await this.accessTokenRepository.delete(token);
  }

  async revokeAccessToken(token: string) {
    return await this.accessTokenRepository.update(
      { token },
      { revoked: true },
    );
  }

  async generateTokens(user: User) {
    const payload = { id: user.id };
    const expiredAccessToken = new Date(
      new Date().getTime() +
        this.configService.get('ACCESS_TOKEN_EXPIRATION') * 1000,
    ).toISOString();
    const accessToken = await this.jwtService.signAsync(payload);

    await this.saveAccessToken({
      token: accessToken,
      expiredAt: expiredAccessToken,
      userId: user.id,
      revoked: false,
    });

    return {
      access_token: accessToken,
    };
  }
}
