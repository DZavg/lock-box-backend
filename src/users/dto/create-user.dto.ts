import { IsEmail, IsString, Length } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { IsUnique } from '@/utils/decorators/validation/isUnique';
import { User } from '@/users/entities/user.entity';
import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: errorMessage.IsString })
  @IsEmail({}, { message: errorMessage.IsEmail })
  @IsUnique(User, { message: errorMessage.UserWithEmailExist })
  email: string;

  @IsNotEmpty()
  @IsString({ message: errorMessage.IsString })
  @Length(6, 30, { message: errorMessage.Length(6, 30) })
  password: string;

  @IsString({ message: errorMessage.IsString })
  @Length(2, 30, { message: errorMessage.Length(2, 30) })
  username: string;

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }
}

export default CreateUserDto;
