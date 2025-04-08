import Joi from 'joi';
const schema = {
    name: Joi.string().min(2).max(16).required(),
    username: Joi.string().min(4).max(16).required(),
    password: Joi.string().min(8).max(14).required(),
};
export const signupValidator = Joi.object(schema);
export const loginValidator = Joi.object(schema).fork(['name'], schema => schema.forbidden());
