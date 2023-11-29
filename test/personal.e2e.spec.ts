import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';
import { seedAdminUser } from './seed-jest';
import baseConfigTestingModule from './baseConfigTestingModule';

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
    it(`success get personal data`, async () => {
      const { adminUser, accessToken } = await seedAdminUser(app);
      return request(app.getHttpServer())
        .get('/personal/data')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toEqual(adminUser.email);
          expect(res.body.username).toEqual(adminUser.username);
        });
    });

    it(`failed get personal data`, () => {
      return request(app.getHttpServer())
        .get('/personal/data')
        .set('Authorization', 'Bearer ')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });
  });

  describe('/PATCH personal data', () => {
    const newAdminUserData = {
      email: 'new-default-admin@example.com',
      username: 'new-default-admin',
      password: 'new-default-admin-password',
    };
    it(`success update personal data`, async () => {
      const { accessToken } = await seedAdminUser(app);
      await request(app.getHttpServer())
        .patch('/personal/data')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(newAdminUserData)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body.username).toEqual(newAdminUserData.username);
        });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(newAdminUserData)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it(`failed update personal data`, async () => {
      return request(app.getHttpServer())
        .patch('/personal/data')
        .set('Authorization', 'Bearer ')
        .send(newAdminUserData)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });
  });
});
