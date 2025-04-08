import Joi from 'joi';

const schema = {
  title: Joi.string().required(),
  completed: Joi.boolean().optional(),
  slug: Joi.string().forbidden(),
};

export const createTodoValidator = Joi.object(schema);
export const updateTodoValidator = Joi.object(schema).fork(
  ['completed', 'title'],
  schema => schema.optional()
);
