import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';
import { Length } from '@/utils/decorators/validation/length';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  domain: string;
}
