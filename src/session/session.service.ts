import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Session } from '@/session/entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async saveTokens(createAccessTokenDto: CreateSessionDto) {
    const accessToken =
      await this.sessionRepository.create(createAccessTokenDto);
    await this.sessionRepository.save(accessToken);
    return accessToken;
  }

  async findByAccessToken(accessToken: string) {
    return await this.sessionRepository.findOneBy({ accessToken });
  }

  async deleteByAccessToken(token: string) {
    return await this.sessionRepository.delete(token);
  }

  async revokeToken(accessToken: string) {
    return await this.sessionRepository.update(
      { accessToken },
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

    await this.saveTokens({
      accessToken: accessToken,
      expiredAt: expiredAccessToken,
      userId: user.id,
      revoked: false,
    });

    return {
      access_token: accessToken,
    };
  }
}
