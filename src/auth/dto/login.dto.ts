import { IsEmail, IsString } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';

export class LoginDto {
  @IsNotEmpty()
  @IsString({ message: errorMessage.IsString })
  @IsEmail({}, { message: errorMessage.IsEmail })
  email: string;

  @IsNotEmpty()
  @IsString({ message: errorMessage.IsString })
  password: string;
}
