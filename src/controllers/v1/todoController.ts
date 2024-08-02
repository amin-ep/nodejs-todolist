import Todo from '../../models/Todo.js';
import catchAsync from '../../utils/catchAsync.js';
import { Request, Response, NextFunction } from 'express';
import { createTodoValidator } from '../../validators/todoValidator.js';
import HTTPError from '../../utils/httpError.js';
import { IRequest } from '../../interfaces/IRequest.js';
class TodoController {
  getAllTodos = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const todos = await Todo.find();

      res.status(200).json({
        status: 'success',
        data: {
          todos,
        },
      });
    }
  );

  getTodoById = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const todo = await Todo.findById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          todo,
        },
      });
    }
  );
  createTodo = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = req.user._id;
      const { error } = createTodoValidator.validate(req.body);
      if (error) {
        return next(new HTTPError(error.message, 400));
      }
      const newTodo = await Todo.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          todo: newTodo,
        },
      });
    }
  );
  updateTodo = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnOriginal: false,
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          todo: updatedTodo,
        },
      });
    }
  );

  deleteTodo = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      await Todo.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );

  getMyTodos = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const myTodos = await Todo.find({ user: req.user._id });
      res.status(200).json({
        status: 'success',
        result: myTodos.length,
        data: {
          todos: myTodos,
        },
      });
    }
  );
}

export default TodoController;
