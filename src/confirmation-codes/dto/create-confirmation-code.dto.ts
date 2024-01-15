import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsDate, IsNumber } from 'class-validator';
import { IsString } from '@/utils/decorators/validation/isString';
import { IsEmail } from '@/utils/decorators/validation/isEmail';

export class CreateConfirmationCodeDto {
  @IsNotEmpty()
  @IsNumber()
  code: string;

  @IsDate()
  expiredAt: Date;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
