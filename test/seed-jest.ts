import { HttpStatus, INestApplication } from '@nestjs/common';
import CreateUserDto from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import * as request from 'supertest';

const defaultAdmin: CreateUserDto = {
  username: 'default-admin',
  password: 'default-admin-password',
  email: 'default-admin@example.com',
};

const defaultUser: CreateUserDto = {
  username: 'default-user',
  password: 'default-user-password',
  email: 'default-user@example.com',
};

const seedAdminUser = async (
  app: INestApplication,
): Promise<{
  adminUser: any;
  accessToken: any;
  refreshToken: any;
}> => {
  const usersService = app.get(UsersService);
  const userOutput = await usersService.create(defaultAdmin);

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: defaultAdmin.email, password: defaultAdmin.password })
    .expect(HttpStatus.CREATED);

  const accessToken: any = loginResponse.body.access_token;
  const refreshToken: any = loginResponse.body.refresh_token;

  const adminUser: any = JSON.parse(JSON.stringify(userOutput));

  return { adminUser, accessToken, refreshToken };
};

const seedUser = async (
  app: INestApplication,
): Promise<{
  user: any;
  accessToken: any;
  refreshToken: any;
}> => {
  const usersService = app.get(UsersService);
  const userOutput = await usersService.create(defaultUser);

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: defaultUser.email,
      password: defaultUser.password,
    })
    .expect(HttpStatus.CREATED);

  const accessToken: any = loginResponse.body.access_token;
  const refreshToken: any = loginResponse.body.refresh_token;

  const user: any = JSON.parse(JSON.stringify(userOutput));

  return { user, accessToken, refreshToken };
};

export { seedAdminUser, seedUser, defaultAdmin, defaultUser };
