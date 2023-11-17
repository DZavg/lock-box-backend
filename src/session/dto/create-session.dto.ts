import { IsOptional } from 'class-validator';

export class CreateSessionDto {
  expiredAt: Date;
  accessToken: string;
  refreshToken: string;
  userId: number;
  @IsOptional()
  revoked?: boolean = false;
}
