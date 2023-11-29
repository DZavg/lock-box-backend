import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Session } from '@/session/entities/session.entity';
import { RefreshDto } from '@/session/dto/refresh.dto';
import { UnauthorizedException } from '@/utils/exception/unauthorizedException';
import { getRandomUuid } from '@/utils/uuid';
import { hashStringBySha256 } from '@/utils/hash';
import { TokensService } from '@/tokens/tokens.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private configService: ConfigService,
    private tokensService: TokensService,
  ) {}

  async createSession(user: User) {
    const jwtId = getRandomUuid();
    const payload = { id: user.id };
    const options = { jwtid: jwtId };

    const tokens = await this.tokensService.generateTokens(payload, options);
    const hashedTokens = await this.tokensService.hashTokens(tokens);

    await this.saveTokens({
      accessToken: hashedTokens.access_token,
      refreshToken: hashedTokens.refresh_token,
      jwtId: jwtId,
      user: user,
      revoked: false,
    });

    return tokens;
  }

  async saveTokens(createSessionDto: CreateSessionDto) {
    const session = await this.sessionRepository.create(createSessionDto);
    await this.sessionRepository.save(session);
    return session;
  }

  async findByJwtId(jwtId: string) {
    return await this.sessionRepository.findOneBy({ jwtId });
  }

  async refreshToken(req, refreshDto: RefreshDto) {
    const jwtId = this.tokensService.getJwtId(req.accessToken);
    const refreshTokenIsVerify = await this.tokensService.verifyToken(
      refreshDto.refresh_token,
      this.configService.get('REFRESH_TOKEN_SECRET_KEY'),
    );

    const tokensFromDb = await this.findByJwtId(jwtId);
    const refreshTokenIsValid =
      hashStringBySha256(refreshDto.refresh_token) ===
      tokensFromDb.refreshToken;

    if (refreshTokenIsVerify.expired || !refreshTokenIsValid) {
      throw new UnauthorizedException();
    }

    await this.revokeSession(jwtId);

    return this.createSession(req.user);
  }

  async revokeSession(jwtId: string) {
    return await this.sessionRepository.update({ jwtId }, { revoked: true });
  }
}
