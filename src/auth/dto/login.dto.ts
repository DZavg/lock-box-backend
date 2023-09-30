import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

export class LoginDto {
  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  @IsEmail({}, { message: errorMessage.IsEmail })
  email: string;

  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  password: string;
}
