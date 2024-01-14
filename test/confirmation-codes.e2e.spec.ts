import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { errorMessage } from '@/utils/errorMessage';
import baseConfigTestingModule from './baseConfigTestingModule';
import { successMessage } from '@/utils/successMessage';

describe('Personal', () => {
  let app: INestApplication;
  let config;

  beforeAll(async () => {
    config = await baseConfigTestingModule();
    app = config.app;

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST request code', () => {
    const url = '/confirmation-codes';

    it(`success post request code`, async () => {
      request(app.getHttpServer())
        .post(url)
        .send({ email: 'example@example.com' })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual(successMessage.confirmationCode);
        });
    });

    it(`failed post request code (without field "email")`, () => {
      return request(app.getHttpServer())
        .post(url)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors).toHaveProperty('email');
          expect(res.body.errors.email.sort()).toEqual(
            [
              errorMessage.IsEmail,
              errorMessage.IsString,
              errorMessage.IsNotEmpty,
            ].sort(),
          );
        });
    });
  });
});
