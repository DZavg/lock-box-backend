import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import baseConfigTestingModule from './baseConfigTestingModule';
import { successMessage } from '@/utils/successMessage';
import { errorMessagesForFields } from './errorMessagesForFields';

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
          expect(res.body).toEqual({
            message: successMessage.confirmationCode,
          });
        });
    });

    it(`failed post request code (without field "email")`, () => {
      return request(app.getHttpServer())
        .post(url)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(res.body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(Object.keys(res.body.errors).sort()).toEqual(['email'].sort());
          expect(res.body.errors.email.sort()).toEqual(
            errorMessagesForFields.email,
          );
        });
    });
  });
});
