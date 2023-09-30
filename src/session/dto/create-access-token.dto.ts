import { IsOptional } from 'class-validator';

export class CreateAccessTokenDto {
  expiredAt: string;
  token: string;
  userId: number;
  @IsOptional()
  revoked?: boolean = false;
}
