import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '@/app.module';
import { seedAdminUser } from './seed-jest';
import { useContainer } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

describe('Users', () => {
  let app: INestApplication;
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

    await app.init();
    ({ adminUser } = await seedAdminUser(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET all users`, () => {
    const expectedUsers = [
      {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
      },
    ];
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .expect(expectedUsers);
  });
  describe('/POST create user', () => {
    it(`Success create user`, () => {
      const defaultUser = {
        username: 'default-user',
        password: 'default-user-password',
        email: 'default-user@example.com',
      };
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

    it(`Failed create duplicate user`, () => {
      const defaultUser = {
        username: 'default-user',
        password: 'default-user-password',
        email: 'default-user@example.com',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(defaultUser)
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
          expect(res.body.errors.email).toEqual([
            errorMessage.IsEmail,
            errorMessage.IsString,
            errorMessage.IsNotEmpty,
          ]);
          expect(res.body.errors.password).toEqual([
            errorMessage.Length(6, 30),
            errorMessage.IsString,
            errorMessage.IsNotEmpty,
          ]);
          expect(res.body.errors.username).toEqual([
            errorMessage.Length(2, 30),
            errorMessage.IsString,
          ]);
        });
    });
  });

  describe('/GET find user by id', () => {
    it(`Success find user`, () => {
      const defaultAdmin = {
        username: 'default-admin',
        password: 'default-admin-password',
        email: 'default-admin@example.com',
      };
      const adminId = '1';
      return request(app.getHttpServer())
        .get(`/users/${adminId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            email: defaultAdmin.email,
            username: defaultAdmin.username,
            id: adminId,
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
    it(`Success update user`, () => {
      const updateDefaultAdmin: UpdateUserDto = {
        username: 'update-default-admin',
        email: 'update-default-admin@example.com',
      };
      const adminId = '1';
      return request(app.getHttpServer())
        .patch(`/users/${adminId}`)
        .send(updateDefaultAdmin)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            email: updateDefaultAdmin.email,
            username: updateDefaultAdmin.username,
            id: adminId,
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
    it(`Success update user`, () => {
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
