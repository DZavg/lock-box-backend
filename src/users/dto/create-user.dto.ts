import { Length } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { IsUnique } from '@/utils/decorators/validation/isUnique';
import { User } from '@/users/entities/user.entity';
import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';
import { IsEmail } from '@/utils/decorators/validation/isEmail';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsUnique(User, { message: errorMessage.UserWithEmailExist })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 30, { message: errorMessage.Length(6, 30) })
  password: string;

  @IsString()
  @Length(2, 30, { message: errorMessage.Length(2, 30) })
  username: string;

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }
}

export default CreateUserDto;
