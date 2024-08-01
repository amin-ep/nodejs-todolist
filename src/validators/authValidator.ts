import Joi from 'joi';

const schema = {
  username: Joi.string().min(4).max(14).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(12).required(),
  verificationCode: Joi.string().forbidden(),
  verified: Joi.string().forbidden().forbidden(),
};

export const signupValidator = Joi.object(schema);

export const loginValidator = Joi.object(schema).fork(['username'], schema =>
  schema.forbidden()
);
