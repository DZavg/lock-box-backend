import { HttpStatus, INestApplication } from '@nestjs/common';
import CreateUserDto from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { LoginDto } from '@/auth/dto/login.dto';
import * as request from 'supertest';

export const seedAdminUser = async (
  app: INestApplication,
): Promise<{ adminUser: any; authTokenForAdmin: any }> => {
  const defaultAdmin: CreateUserDto = {
    username: 'default-admin',
    password: 'default-admin-password',
    email: 'default-admin@example.com',
  };

  const usersService = app.get(UsersService);
  const userOutput = await usersService.create(defaultAdmin);

  const loginInput: LoginDto = {
    email: defaultAdmin.email,
    password: defaultAdmin.password,
  };

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send(loginInput)
    .expect(HttpStatus.CREATED);

  const authTokenForAdmin: any = loginResponse.body.access_token;

  const adminUser: any = JSON.parse(JSON.stringify(userOutput));

  return { adminUser, authTokenForAdmin };
};
