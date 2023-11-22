import { IsString } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';

export class RefreshDto {
  @IsNotEmpty()
  @IsString({ message: errorMessage.IsString })
  refresh_token: string;
}
