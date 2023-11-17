import { IsNotEmpty, IsString } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

export class RefreshDto {
  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  refresh_token: string;
}
