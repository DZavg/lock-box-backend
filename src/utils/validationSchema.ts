import * as Joi from 'joi';

export default {
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_LOGGING: Joi.boolean().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
  ACCESS_TOKEN_EXPIRATION: Joi.number().required(),
  ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.number().required(),
  REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
  MAILER_SERVICE: Joi.string().required(),
  MAILER_USER: Joi.string().required(),
  MAILER_PASSWORD: Joi.string().required(),
  CONFIRMATION_CODES_EXPIRATION: Joi.number().required(),
  APP_DOCKER_HOST: Joi.string().required(),
  APP_DOCKER_PORT: Joi.number().required(),
  PORT: Joi.number().required(),
};
