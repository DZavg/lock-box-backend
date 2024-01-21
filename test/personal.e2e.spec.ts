import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';
import { SeedJest } from './seed-jest';
import baseConfigTestingModule from './baseConfigTestingModule';
import { successMessage } from '@/utils/successMessage';
import { errorMessagesForFields } from './errorMessagesForFields';
import Role from '@/roles/role.enum';

describe('Personal', () => {
  let app: INestApplication;
  let userRepository;
  let config;
  let seedJest;

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

  describe('/GET personal data', () => {
    const url = '/personal/data';

    it(`success get personal data (role user)`, async () => {
      const { accessToken, user } = await seedJest.seedUser();
      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            username: user.username,
            email: user.email,
            id: expect.any(String),
            roles: [Role.User],
          });
        });
    });

    it(`success get personal data (role admin)`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();
      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            username: adminUser.username,
            email: adminUser.email,
            id: expect.any(String),
            roles: [Role.User, Role.Admin],
          });
        });
    });

    it(`failed get personal data`, () => {
      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });
  });

  describe('/PATCH personal data', () => {
    const url = '/personal/data';

    it(`success update personal data (role user)`, async () => {
      const newUserData = {
        email: 'new-default-user@example.com',
        username: 'new-default-user-password',
      };
      const { accessToken } = await seedJest.seedUser();
      const { defaultUser } = seedJest;
      await request(app.getHttpServer())
        .patch('/personal/data')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newUserData)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            username: newUserData.username,
            email: newUserData.email,
            id: expect.any(String),
            roles: [Role.User],
          });
        });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...newUserData, password: defaultUser.password })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`success update personal data (role admin)`, async () => {
      const newAdminUserData = {
        email: 'new-default-admin@example.com',
        username: 'new-default-admin-password',
      };
      const { accessToken } = await seedJest.seedAdminUser();
      const { defaultAdmin } = seedJest;
      await request(app.getHttpServer())
        .patch('/personal/data')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newAdminUserData)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            username: newAdminUserData.username,
            email: newAdminUserData.email,
            id: expect.any(String),
            roles: [Role.User, Role.Admin],
          });
        });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...newAdminUserData, password: defaultAdmin.password })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`failed update personal data without auth`, async () => {
      return request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ')
        .send({})
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });
  });

  describe('/PATCH personal password', () => {
    const url = '/personal/data/password';

    it(`success update personal password (role user)`, async () => {
      const newUserData = {
        password: 'default-user-password',
        newPassword: 'new-default-user-password',
      };
      const { accessToken } = await seedJest.seedUser();
      const { defaultUser } = seedJest;
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newUserData)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.changePassword,
          });
        });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...defaultUser, password: newUserData.newPassword })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`success update personal password (role admin)`, async () => {
      const newAdminUserData = {
        password: 'default-admin-password',
        newPassword: 'new-default-admin-password',
      };
      const { accessToken } = await seedJest.seedAdminUser();
      const { defaultAdmin } = seedJest;
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newAdminUserData)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.changePassword,
          });
        });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...defaultAdmin, password: newAdminUserData.newPassword })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`failed update personal no field password`, async () => {
      const newUserData = {
        newPassword: 'default-admin-password',
      };
      const { accessToken } = await seedJest.seedUser();
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newUserData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['password'].sort(),
          );
          expect(res.body.errors.password.sort()).toEqual(
            errorMessagesForFields.password,
          );
        });
    });

    it(`failed update personal no field newPassword`, async () => {
      const newUserData = {
        password: 'default-user-password',
      };
      const { accessToken } = await seedJest.seedUser();
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newUserData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['newPassword'].sort(),
          );
          expect(res.body.errors.newPassword.sort()).toEqual(
            errorMessagesForFields.newPassword,
          );
        });
    });

    it(`failed update personal same data`, async () => {
      const newUserData = {
        password: 'default-admin-password',
        newPassword: 'default-admin-password',
      };
      const { accessToken } = await seedJest.seedUser();
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newUserData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.PasswordsMatch,
          });
        });
    });
  });
});
