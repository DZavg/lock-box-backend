import { IsOptional } from 'class-validator';

export class CreateSessionDto {
  expiredAt: string;
  accessToken: string;
  @IsOptional()
  refreshToken?: string;
  userId: number;
  @IsOptional()
  revoked?: boolean = false;
}
