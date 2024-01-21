import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { successMessage } from '@/utils/successMessage';
import { User } from '@/users/entities/user.entity';
import { errorMessage } from '@/utils/errorMessage';
import baseConfigTestingModule from './baseConfigTestingModule';
import { ConfirmationCode } from '@/confirmation-codes/entities/confirmation-code.entity';
import { instanceToPlain } from 'class-transformer';
import { errorMessagesForFields } from './errorMessagesForFields';
import { SeedJest } from './seed-jest';

describe('Auth', () => {
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

  describe('/POST registration', () => {
    const url = '/auth/registration';
    it(`success registration`, () => {
      const defaultUser = {
        username: 'default-user',
        password: 'default-user-password',
        email: 'default-user@example.com',
      };
      return request(app.getHttpServer())
        .post(url)
        .send(defaultUser)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.registration,
          });
        });
    });

    it(`failed registration (user already exist)`, async () => {
      await seedJest.seedAdminUser();
      const { defaultAdmin } = seedJest;
      return request(app.getHttpServer())
        .post(url)
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
        .post(url)
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
  });

  describe('/POST login', () => {
    const url = '/auth/login';
    it(`success login`, async () => {
      await seedJest.seedUser();
      const { defaultUser } = seedJest;
      return request(app.getHttpServer())
        .post(url)
        .send({ email: defaultUser.email, password: defaultUser.password })
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
        .post(url)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['email', 'password'].sort(),
          );
          expect(res.body.errors.email.sort()).toEqual(
            errorMessagesForFields.email,
          );
          expect(res.body.errors.password.sort()).toEqual(
            [errorMessage.IsNotEmpty, errorMessage.IsString].sort(),
          );
        });
    });
  });

  describe('/Post logout', () => {
    const url = '/auth/logout';
    it(`success logout`, async () => {
      const { accessToken } = await seedJest.seedUser();
      await request(app.getHttpServer())
        .post(url)
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
        .post(url)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });
  });

  describe('/Post refresh', () => {
    const url = '/auth/refresh';
    it(`success refresh`, async () => {
      const { accessToken, refreshToken } = await seedJest.seedUser();
      let newAccessToken = '';
      await request(app.getHttpServer())
        .post(url)
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
      const { accessToken } = await seedJest.seedUser();
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['refresh_token'].sort(),
          );
          expect(res.body.errors.refresh_token.sort()).toEqual(
            [errorMessage.IsNotEmpty].sort(),
          );
        });
    });

    it(`failed refresh (refresh token not string)`, async () => {
      const { accessToken } = await seedJest.seedUser();
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: 1232332 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['refresh_token'].sort(),
          );
          expect(res.body.errors.refresh_token.sort()).toEqual(
            [errorMessage.IsString].sort(),
          );
        });
    });

    it(`failed refresh (refresh token another user)`, async () => {
      const { refreshToken } = await seedJest.seedUser();
      const { accessToken } = await seedJest.seedAdminUser();
      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: refreshToken })
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

    async function getConfirmationCodeFromDb(user) {
      const confirmationCodeRepository =
        config.dataSource.getRepository(ConfirmationCode);
      return instanceToPlain(
        await confirmationCodeRepository.findOneBy({ email: user.email }),
      ).code;
    }

    async function getConfirmationCode(email) {
      await request(app.getHttpServer())
        .post('/confirmation-codes')
        .send({ email })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            message: successMessage.confirmationCode,
          });
        });
    }

    it(`success recovery-password`, async () => {
      await seedJest.seedUser();
      const { defaultUser } = seedJest;

      await getConfirmationCode(defaultUser.email);
      return request(app.getHttpServer())
        .post(url)
        .send({
          email: defaultUser.email,
          password: '123456',
          code: await getConfirmationCodeFromDb(defaultUser),
        })
        .expect((res) => {
          expect(res.body).toEqual({
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          });
        });
    });

    it(`failed recovery-password`, async () => {
      await seedJest.seedUser();
      const { defaultUser } = seedJest;

      await getConfirmationCode(defaultUser.email);
      return request(app.getHttpServer())
        .post(url)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['email', 'password', 'code'].sort(),
          );
          expect(res.body.errors.email.sort()).toEqual(
            errorMessagesForFields.email,
          );
          expect(res.body.errors.password.sort()).toEqual(
            errorMessagesForFields.password,
          );
          expect(res.body.errors.code.sort()).toEqual(
            errorMessagesForFields.code,
          );
        });
    });
  });
});
