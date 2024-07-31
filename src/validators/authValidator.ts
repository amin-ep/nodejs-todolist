import Joi, { func } from 'joi';

const schema = {
  username: Joi.string().min(4).max(14),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(12),
  verificationCode: Joi.string().forbidden(),
  verified: Joi.string().forbidden().forbidden(),
};

export const signupValidator = Joi.object(schema).fork(
  ['username', 'email', 'password'],
  schema => schema.required()
);

export const loginValidator = Joi.object(schema)
  .fork(['email', 'password'], schema => schema.required())
  .fork(['username'], schema => schema.forbidden());
