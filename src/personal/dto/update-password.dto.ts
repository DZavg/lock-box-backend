import { IsString } from '@/utils/decorators/validation/isString';
import { Length } from '@/utils/decorators/validation/length';
import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  newPassword: string;
}
