import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsDate, IsNumber } from 'class-validator';
import { User } from '@/users/entities/user.entity';

export class CreateConfirmationCodeDto {
  @IsNotEmpty()
  @IsNumber()
  code: string;

  @IsDate()
  expiredAt: Date;

  user: User;
}
