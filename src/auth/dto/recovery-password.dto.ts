import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';
import { IsEmail } from '@/utils/decorators/validation/isEmail';
import { Length } from '@/utils/decorators/validation/length';

export class RecoveryPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;
}
