import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { defaultAdmin, defaultUser, seedAdminUser } from './seed-jest';
import { errorMessage } from '@/utils/errorMessage';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import baseConfigTestingModule from './baseConfigTestingModule';
import { User } from '@/users/entities/user.entity';

describe('Users', () => {
  let app: INestApplication;
  let userRepository;
  let config;

  beforeAll(async () => {
    config = await baseConfigTestingModule();
    app = config.app;

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    userRepository = config.dataSource.getRepository(User);
    await userRepository.remove(await userRepository.find());
  });

  it(`/GET all users`, () => {
    const expectedUsers = [];

    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .expect(expectedUsers);
  });
  describe('/POST create user', () => {
    it(`Success create user`, () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(defaultUser)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toMatchObject({
            email: defaultUser.email,
            username: defaultUser.username,
          });
          expect(res.body).toHaveProperty('id');
        });
    });

    it(`Failed create duplicate user`, async () => {
      await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/users')
        .send(defaultAdmin)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('email');
          expect(res.body.errors.email).toEqual([
            errorMessage.UserWithEmailExist,
          ]);
        });
    });

    it(`Failed create user without data`, () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('email');
          expect(res.body.errors).toHaveProperty('password');
          expect(res.body.errors).toHaveProperty('username');
          expect(res.body.errors.email.sort()).toEqual(
            [
              errorMessage.IsEmail,
              errorMessage.IsString,
              errorMessage.IsNotEmpty,
            ].sort(),
          );
          expect(res.body.errors.password.sort()).toEqual(
            [
              errorMessage.Length(6, 30),
              errorMessage.IsString,
              errorMessage.IsNotEmpty,
            ].sort(),
          );
          expect(res.body.errors.username.sort()).toEqual(
            [
              errorMessage.Length(2, 30),
              errorMessage.IsString,
              errorMessage.IsNotEmpty,
            ].sort(),
          );
        });
    });
  });

  describe('/GET find user by id', () => {
    it(`Success find user`, async () => {
      const { adminUser } = await seedAdminUser(app);
      return request(app.getHttpServer())
        .get(`/users/${adminUser.id}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: adminUser.id,
            email: adminUser.email,
            username: adminUser.username,
          });
        });
    });
    it(`Failed find user`, () => {
      const userId = '999';
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.UserNotFound);
        });
    });
  });

  describe('/PATCH update user by id', () => {
    it(`Success update user`, async () => {
      const { adminUser } = await seedAdminUser(app);
      const updateDefaultAdmin: UpdateUserDto = {
        username: 'update-default-admin',
        email: 'update-default-admin@example.com',
      };
      return request(app.getHttpServer())
        .patch(`/users/${adminUser.id}`)
        .send(updateDefaultAdmin)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            email: updateDefaultAdmin.email,
            username: updateDefaultAdmin.username,
            id: adminUser.id,
          });
        });
    });
    it(`Failed update user`, () => {
      const userId = '999';
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.UserNotFound);
        });
    });
  });

  describe('/DELETE delete user by id', () => {
    it(`Success delete user`, () => {
      const adminId = '1';
      return request(app.getHttpServer())
        .delete(`/users/${adminId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.message).toEqual('success');
        });
    });
  });
});
