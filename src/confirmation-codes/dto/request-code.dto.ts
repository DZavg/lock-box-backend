import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';
import { IsEmail } from '@/utils/decorators/validation/isEmail';

export class RequestCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
