import Role from '@/roles/role.enum';

export class UserDto {
  id: number;
  email: string;
  username: string;
  roles: Role[];
}
