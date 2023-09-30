import { Injectable } from '@nestjs/common';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { accessToken } from '@/session/entities/accessToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(accessToken)
    private readonly accessTokenRepository: Repository<accessToken>,
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
}
