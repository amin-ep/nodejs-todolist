import Joi from 'joi';
const schema = {
    username: Joi.string().min(4).max(14),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(12),
    verificationCode: Joi.string(),
    verified: Joi.boolean(),
    active: Joi.boolean(),
};
export const updateUserValidator = Joi.object(schema);
