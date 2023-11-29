import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '@/app.module';
import { useContainer } from 'class-validator';
import { successMessage } from '@/utils/successMessage';
import { User } from '@/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { errorMessage } from '@/utils/errorMessage';
import { defaultAdmin, loginInput, seedAdminUser, seedUser } from './seed-jest';

describe('Auth', () => {
  let app: INestApplication;
  let dataSource;
  let userRepository;
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errorsList) => {
          const errors = {};
          errorsList.forEach(function (error) {
            errors[error.property] = Object.values(error.constraints);
          });
          return new BadRequestException({
            errors,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        },
      }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    dataSource = moduleRef.get<DataSource>(DataSource);

    userRepository = dataSource.getRepository(User);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
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
          expect(res.body.message).toEqual(successMessage.registration);
        });
    });

    it(`failed registration (user already exist)`, async () => {
      await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/auth/registration')
        .send(defaultAdmin)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('email');
          expect(res.body.errors.email.sort()).toEqual(
            [errorMessage.UserWithEmailExist].sort(),
          );
        });
    });

    it(`failed registration (empty data)`, () => {
      return request(app.getHttpServer())
        .post('/auth/registration')
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
        });
    });
  });

  describe('/POST login', () => {
    it(`success login`, async () => {
      await seedAdminUser(app);
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it(`failed login`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('email');
          expect(res.body.errors).toHaveProperty('password');
          expect(res.body.errors.email.sort()).toEqual(
            [
              errorMessage.IsEmail,
              errorMessage.IsString,
              errorMessage.IsNotEmpty,
            ].sort(),
          );
          expect(res.body.errors.password.sort()).toEqual(
            [errorMessage.IsString, errorMessage.IsNotEmpty].sort(),
          );
        });
    });
  });

  describe('/Post logout', () => {
    it(`success logout`, async () => {
      ({ adminUser, accessToken } = await seedAdminUser(app));
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual('success');
        });
      return request(app.getHttpServer())
        .get('/personal/data')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });

    it(`failed logout`, () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });
  });
  describe('/Post refresh', () => {
    it(`success refresh`, async () => {
      ({ adminUser, accessToken, refreshToken } = await seedAdminUser(app));
      let newAccessToken = '';
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: refreshToken })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          newAccessToken = res.body.access_token;
          expect(Object.keys(res.body).sort()).toEqual(
            ['access_token', 'refresh_token'].sort(),
          );
        });
      return request(app.getHttpServer())
        .get('/personal/data')
        .set('Authorization', 'Bearer ' + newAccessToken)
        .expect(HttpStatus.OK);
    });

    it(`failed refresh (empty field refreshToken)`, async () => {
      ({ adminUser, accessToken } = await seedAdminUser(app));
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('refresh_token');
          expect(res.body.errors.refresh_token.sort()).toEqual(
            [errorMessage.IsNotEmpty].sort(),
          );
        });
    });

    it(`failed refresh (refresh token not string)`, async () => {
      ({ adminUser, accessToken } = await seedAdminUser(app));
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: 1232332 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('refresh_token');
          expect(res.body.errors.refresh_token.sort()).toEqual(
            [errorMessage.IsString].sort(),
          );
        });
    });

    it(`failed refresh (refresh token another user)`, async () => {
      ({ adminUser, accessToken, refreshToken } = await seedAdminUser(app));
      const user = await seedUser(app);
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ refresh_token: user.refreshToken })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });
  });
});
