import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';
import { AccessTypeDto } from '@/accesses/dto/access-type.dto';
import { Length } from '@/utils/decorators/validation/length';

export class CreateAccessDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  origin: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  login: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  password: string;

  @IsNotEmpty()
  type: AccessTypeDto;
}
