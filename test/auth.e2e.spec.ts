import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { successMessage } from '@/utils/successMessage';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';
import { defaultAdmin, seedAdminUser, seedUser } from './seed-jest';
import baseConfigTestingModule from './baseConfigTestingModule';
import { ConfirmationCode } from '@/confirmation-codes/entities/confirmation-code.entity';
import { instanceToPlain } from 'class-transformer';
import { errorMessagesForFields } from './errorMessagesForFields';

describe('Auth', () => {
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

  describe('/POST registration', () => {
    it(`success registration`, () => {
      const defaultUser = {
        username: 'default-user',
        password: 'default-user-password',
        email: 'default-user@example.com',
      };
      return request(app.getHttpServer())
        .post('/auth/registration')
        .send(defaultUser)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.registration,
          });
        });
    });

    it(`failed registration (user already exist)`, async () => {
      await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/auth/registration')
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

    it(`failed registration (empty data)`, () => {
      return request(app.getHttpServer())
        .post('/auth/registration')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          errorMessagesForFields.email(res);
          errorMessagesForFields.username(res);
          errorMessagesForFields.password(res);
        });
    });
  });

  describe('/POST login', () => {
    it(`success login`, async () => {
      await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: defaultAdmin.email, password: defaultAdmin.password })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`failed login`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('password');
          expect(res.body.errors.password.sort()).toEqual(
            [errorMessage.IsString, errorMessage.IsNotEmpty].sort(),
          );
          errorMessagesForFields.email(res);
        });
    });
  });

  describe('/Post logout', () => {
    it(`success logout`, async () => {
      const { accessToken } = await seedAdminUser(app);
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            message: 'success',
          });
        });
      return request(app.getHttpServer())
        .get('/personal/data')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });

    it(`failed logout`, () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });
  });
  describe('/Post refresh', () => {
    it(`success refresh`, async () => {
      const { accessToken, refreshToken } = await seedAdminUser(app);
      let newAccessToken = '';
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: refreshToken })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          newAccessToken = res.body.access_token;
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
      return request(app.getHttpServer())
        .get('/personal/data')
        .set('Authorization', 'Bearer ' + newAccessToken)
        .expect(HttpStatus.OK);
    });

    it(`failed refresh (empty field refreshToken)`, async () => {
      const { accessToken } = await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            errors: {
              refresh_token: [errorMessage.IsNotEmpty],
            },
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });
    });

    it(`failed refresh (refresh token not string)`, async () => {
      const { accessToken } = await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: 1232332 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            errors: {
              refresh_token: [errorMessage.IsString],
            },
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });
    });

    it(`failed refresh (refresh token another user)`, async () => {
      const { accessToken } = await seedAdminUser(app);
      const user = await seedUser(app);
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: user.refreshToken })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });
  });

  describe('/Post recovery-password', () => {
    const url = '/auth/recovery-password';

    async function getConfirmationCode(user) {
      const confirmationCodeRepository =
        config.dataSource.getRepository(ConfirmationCode);
      return instanceToPlain(
        await confirmationCodeRepository.findOneBy({ email: user.email }),
      ).code;
    }

    it(`success recovery-password`, async () => {
      await seedAdminUser(app);
      await request(app.getHttpServer())
        .post('/confirmation-codes')
        .send({ email: defaultAdmin.email })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.confirmationCode,
          });
        });

      return request(app.getHttpServer())
        .post(url)
        .send({
          email: defaultAdmin.email,
          password: '123456',
          code: await getConfirmationCode(defaultAdmin),
        })
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`failed recovery-password`, async () => {
      await seedAdminUser(app);
      await request(app.getHttpServer())
        .post('/confirmation-codes')
        .send({ email: defaultAdmin.email })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.confirmationCode,
          });
        });

      return request(app.getHttpServer())
        .post(url)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          errorMessagesForFields.email(res);
          errorMessagesForFields.password(res);
          errorMessagesForFields.code(res);
        });
    });
  });
});
