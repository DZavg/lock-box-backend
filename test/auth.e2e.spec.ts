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
import { defaultAdmin, loginInput, seedAdminUser } from './seed-jest';

describe('Auth', () => {
  let app: INestApplication;
  let dataSource;
  let userRepository;
  let authTokenForAdmin;
  let adminUser;

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

  describe('/GET profile', () => {
    it(`success get profile`, async () => {
      ({ adminUser, authTokenForAdmin } = await seedAdminUser(app));
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer ' + authTokenForAdmin)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toEqual(adminUser.email);
          expect(res.body.username).toEqual(adminUser.username);
        });
    });

    it(`failed login`, () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer ')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });
  });

  describe('/PATCH profile', () => {
    const newAdminUserData = {
      email: 'new-default-admin@example.com',
      username: 'new-default-admin',
      password: 'new-default-admin-password',
    };
    it(`success update profile`, async () => {
      ({ adminUser, authTokenForAdmin } = await seedAdminUser(app));
      await request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', 'Bearer ' + authTokenForAdmin)
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

    it(`failed update profile`, async () => {
      return request(app.getHttpServer())
        .patch('/auth/profile')
        .set('Authorization', 'Bearer ')
        .send(newAdminUserData)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toEqual(errorMessage.Unauthorized);
        });
    });
  });

  describe('/Post logout', () => {
    it(`success logout`, async () => {
      ({ adminUser, authTokenForAdmin } = await seedAdminUser(app));
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer ' + authTokenForAdmin)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual('success');
        });
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer ' + authTokenForAdmin)
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
});
