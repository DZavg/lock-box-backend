import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';
import { defaultAdmin, seedAdminUser } from './seed-jest';
import baseConfigTestingModule from './baseConfigTestingModule';
import { successMessage } from '@/utils/successMessage';
import { errorMessagesForFields } from './errorMessagesForFields';

describe('Personal', () => {
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

  describe('/GET personal data', () => {
    const url = '/personal/data';

    it(`success get personal data`, async () => {
      const { adminUser, accessToken } = await seedAdminUser(app);
      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            username: adminUser.username,
            email: adminUser.email,
            id: expect.any(String),
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

    it(`success update personal data`, async () => {
      const newAdminUserData = {
        email: 'new-default-admin@example.com',
        username: 'new-default-admin',
      };
      const { accessToken } = await seedAdminUser(app);
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

    it(`success update personal password`, async () => {
      const newAdminUserData = {
        password: 'default-admin-password',
        newPassword: 'new-default-admin-password',
      };
      const { accessToken } = await seedAdminUser(app);
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
      const newAdminUserData = {
        newPassword: 'default-admin-password',
      };
      const { accessToken } = await seedAdminUser(app);
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newAdminUserData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          errorMessagesForFields.password(res);
        });
    });

    it(`failed update personal no field newPassword`, async () => {
      const newAdminUserData = {
        password: 'default-admin-password',
      };
      const { accessToken } = await seedAdminUser(app);
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newAdminUserData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          errorMessagesForFields.newPassword(res);
        });
    });

    it(`failed update personal same data`, async () => {
      const newAdminUserData = {
        password: 'default-admin-password',
        newPassword: 'default-admin-password',
      };
      const { accessToken } = await seedAdminUser(app);
      await request(app.getHttpServer())
        .patch(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newAdminUserData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.PasswordsMatch);
        });
    });
  });
});
