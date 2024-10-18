import * as Joi from 'joi';

export const validationSchema = Joi.object({
  ENV: Joi.string().valid('dev', 'prod').required(),
  PORT: Joi.string().required(),
  DB_TYPE: Joi.string().valid('postgres').required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
