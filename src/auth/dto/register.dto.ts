import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { IsUnique } from '@/utils/isUnique';
import { User } from '@/users/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  @IsEmail({}, { message: errorMessage.IsEmail })
  @IsUnique(User, { message: errorMessage.UserWithEmailExist })
  email: string;

  @IsNotEmpty({ message: errorMessage.IsNotEmpty })
  @IsString({ message: errorMessage.IsString })
  @Length(6, 30, { message: errorMessage.Length(6, 30) })
  password: string;

  @IsString({ message: errorMessage.IsString })
  @Length(2, 15, { message: errorMessage.Length(2, 30) })
  username: string;
}
