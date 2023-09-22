import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

export class CreateUserDto {
  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  @IsEmail({}, { message: errorMessage.IsEmail })
  email: string;

  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  @Length(6, 30, { message: errorMessage.Length(6, 30) })
  password: string;
}

export default CreateUserDto;
