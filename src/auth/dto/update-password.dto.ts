import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';
import { Length } from '@/utils/decorators/validation/length';
import { IsEmail } from '@/utils/decorators/validation/isEmail';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
