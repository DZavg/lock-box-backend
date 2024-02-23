import { IsNotEmpty } from '@/utils/decorators/validation/isNotEmpty';
import { IsString } from '@/utils/decorators/validation/isString';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  domain: string;
}
