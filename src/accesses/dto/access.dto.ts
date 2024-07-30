import { AccessTypeDto } from '@/accesses/dto/access-type.dto';

export class AccessDto {
  id: number;
  origin: string;
  login: string;
  type: AccessTypeDto;
}
