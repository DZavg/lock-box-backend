import { HttpStatus, INestApplication } from '@nestjs/common';
import CreateUserDto from '@/users/dto/create-user.dto';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import Role from '@/users/role.enum';
import { hashStringByBcrypt } from '@/utils/hash';
import { SALT_FOR_PASSWORD } from '@/users/constants';

export const SeedJest = async (app: INestApplication) => {
  const defaultAdmin: CreateUserDto = {
    username: 'default-admin',
    password: 'default-admin-password',
    email: 'default-admin@example.com',
  };

  const hashedAdminPassword = await hashStringByBcrypt(
    defaultAdmin.password,
    SALT_FOR_PASSWORD,
  );

  const defaultUser: CreateUserDto = {
    username: 'default-user',
    password: 'default-user-password',
    email: 'default-user@example.com',
  };

  const hashedUserPassword = await hashStringByBcrypt(
    defaultUser.password,
    SALT_FOR_PASSWORD,
  );

  const dataSource = app.get(DataSource);
  const usersRepository = dataSource.getRepository(User);

  const seedAdminUser = async () => {
    const newUser = await usersRepository.save(
      await usersRepository.create({
        ...defaultAdmin,
        password: hashedAdminPassword,
        roles: [Role.User, Role.Admin],
      }),
    );

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: defaultAdmin.email, password: defaultAdmin.password })
      .expect(HttpStatus.CREATED);

    const accessToken: any = loginResponse.body.access_token;
    const refreshToken: any = loginResponse.body.refresh_token;

    const adminUser: any = instanceToPlain(newUser);

    return { adminUser, accessToken, refreshToken };
  };

  const seedUser = async () => {
    const newUser = await usersRepository.save(
      await usersRepository.create({
        ...defaultUser,
        password: hashedUserPassword,
      }),
    );

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      })
      .expect(HttpStatus.CREATED);

    const accessToken: string = loginResponse.body.access_token;
    const refreshToken: string = loginResponse.body.refresh_token;

    const user: any = instanceToPlain(newUser);

    return { user, accessToken, refreshToken };
  };

  return { seedAdminUser, seedUser, defaultUser, defaultAdmin };
};
