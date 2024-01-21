import Role from '@/users/role.enum';

export class UserDto {
  id: number;
  email: string;
  username: string;
  roles: Role[];
}
