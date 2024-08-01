import Joi from 'joi';
const schema = {
    title: Joi.string().required(),
    completed: Joi.boolean(),
    user: Joi.string().required(),
    slug: Joi.string().forbidden(),
};
export const createTodoValidator = Joi.object(schema);
