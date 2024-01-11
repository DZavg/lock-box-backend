import { IsOptional } from 'class-validator';
import { IsString } from '@/utils/decorators/validation/isString';
import { Length } from '@/utils/decorators/validation/length';
import { IsEmail } from '@/utils/decorators/validation/isEmail';
import { IsUnique } from '@/utils/decorators/validation/isUnique';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';

export class UpdateUserBySelfDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsUnique(User, { message: errorMessage.UserWithEmailExist })
  email: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  username: string;
}
