import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';

export class RefreshDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
