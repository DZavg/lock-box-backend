import * as Joi from 'joi';

export default {
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_LOGGING: Joi.boolean().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
  ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
  ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
  REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
};
