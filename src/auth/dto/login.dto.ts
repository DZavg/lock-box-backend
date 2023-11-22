import { IsEmail } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: errorMessage.IsEmail })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
