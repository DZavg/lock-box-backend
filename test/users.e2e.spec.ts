import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { errorMessage } from '@/utils/errorMessage';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import baseConfigTestingModule from './baseConfigTestingModule';
import { User } from '@/users/entities/user.entity';
import { errorMessagesForFields } from './errorMessagesForFields';
import { SeedJest } from './seed-jest';
import Role from '@/users/role.enum';

describe('Users', () => {
  let app: INestApplication;
  let userRepository;
  let config;
  let seedJest;
  const url = '/users';

  beforeAll(async () => {
    config = await baseConfigTestingModule();
    app = config.app;
    seedJest = await SeedJest(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    userRepository = config.dataSource.getRepository(User);
    await userRepository.remove(await userRepository.find());
  });

  describe('/GET all users', () => {
    it(`success get all users`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();
      const expectedUsers = [adminUser];

      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect(expectedUsers);
    });

    it(`failed get all users (unauthorized)`, async () => {
      return request(app.getHttpServer())
        .get(url)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });

    it(`failed get all users (role user)`, async () => {
      const { accessToken } = await seedJest.seedUser();
      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Forbidden,
          });
        });
    });
  });
  describe('/POST create user', () => {
    it(`Success create user`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const { defaultUser } = seedJest;
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(defaultUser)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            email: defaultUser.email,
            username: defaultUser.username,
            id: expect.any(String),
            roles: [Role.User],
          });
        });
    });

    it(`Failed create duplicate user`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const { defaultAdmin } = seedJest;
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(defaultAdmin)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            errors: {
              email: [errorMessage.UserWithEmailExist],
            },
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });
    });

    it(`Failed create user without data`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['email', 'username', 'password'].sort(),
          );
          expect(res.body.errors.email.sort()).toEqual(
            errorMessagesForFields.email,
          );
          expect(res.body.errors.username.sort()).toEqual(
            errorMessagesForFields.username,
          );
          expect(res.body.errors.password.sort()).toEqual(
            errorMessagesForFields.password,
          );
        });
    });

    it(`Failed create user (role user)`, async () => {
      const { accessToken } = await seedJest.seedUser();
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Forbidden,
          });
        });
    });
  });

  describe('/GET find user by id', () => {
    it(`Success find user`, async () => {
      const { adminUser, accessToken } = await seedJest.seedAdminUser();
      return request(app.getHttpServer())
        .get(`/users/${adminUser.id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            id: adminUser.id,
            email: adminUser.email,
            username: adminUser.username,
            roles: [Role.User, Role.Admin],
          });
        });
    });
    it(`Failed find user (user not found)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const userId = '999';
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.UserNotFound,
          });
        });
    });

    it(`Failed find user (role user)`, async () => {
      const { accessToken } = await seedJest.seedUser();
      const userId = '999';
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Forbidden,
          });
        });
    });
  });
  //
  describe('/PATCH update user by id', () => {
    it(`Success update user`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();
      const updateDefaultAdmin: UpdateUserDto = {
        username: 'update-default-admin',
        email: 'update-default-admin@example.com',
      };
      return request(app.getHttpServer())
        .patch(`/users/${adminUser.id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(updateDefaultAdmin)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            email: updateDefaultAdmin.email,
            username: updateDefaultAdmin.username,
            id: adminUser.id,
            roles: [Role.User, Role.Admin],
          });
        });
    });
    it(`Failed update user (user not found)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const userId = '999';
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.UserNotFound,
          });
        });
    });

    it(`Failed update user (role user)`, async () => {
      const { accessToken } = await seedJest.seedUser();
      const userId = '999';
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Forbidden,
          });
        });
    });
  });

  describe('/DELETE delete user by id', () => {
    it(`Success delete user`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();
      return request(app.getHttpServer())
        .delete(`/users/${adminUser.id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            message: 'success',
          });
        });
    });

    it(`Failed delete user (role user)`, async () => {
      const { accessToken, user } = await seedJest.seedUser();
      return request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Forbidden,
          });
        });
    });
  });
});
