import Todo from '../../models/Todo.js';
import catchAsync from '../../utils/catchAsync.js';
import { Request, Response, NextFunction } from 'express';
import { createTodoValidator } from '../../validators/todoValidator.js';
import HTTPError from '../../utils/httpError.js';
import { Types } from 'mongoose';

class TodoController {
  getAllTodos = catchAsync(
    async (_req: Request, res: Response, next: NextFunction) => {
      const todos = await Todo.find().populate({
        path: 'user',
        select: 'username name createdAt',
      });

      res.status(200).json({
        status: 'success',
        data: todos,
      });
    }
  );

  getTodoById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const todo = await Todo.findById(req.params.id);

      if (!todo) {
        return next(new HTTPError('There is no Todo with this id', 404));
      }

      if (
        req.user.role === 'user' &&
        todo.user.toString() != req.user._id.toString()
      ) {
        return next(new HTTPError('This todo item is not your todo', 404));
      }

      res.status(200).json({
        status: 'success',
        data: todo,
      });
    }
  );

  createTodo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = req.user._id;

      const { error } = createTodoValidator.validate(req.body);

      if (error) {
        return next(new HTTPError(error.message, 400));
      }

      const newTodo = await Todo.create(req.body);

      res.status(201).json({
        status: 'success',
        data: newTodo,
      });
    }
  );

  updateTodo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnOriginal: false,
        }
      );

      if (!updatedTodo) {
        return next(new HTTPError('There is no todo with this id', 404));
      }

      res.status(200).json({
        status: 'success',
        data: updatedTodo,
      });
    }
  );

  deleteTodo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await Todo.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );

  getMyTodos = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const todos = await Todo.find({ user: req.user._id });

      res.status(200).json({
        status: 'success',
        result: todos.length,
        data: todos,
      });
    }
  );
}

export default TodoController;
