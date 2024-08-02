import { NextFunction, Response } from 'express';
import { IRequest } from '../../interfaces/IRequest.js';
import catchAsync from '../../utils/catchAsync.js';
import User from '../../models/User.js';

export default class UserController {
  getAllUsers = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const todos = await User.find();

      res.status(200).json({
        status: 'success',
        data: {
          todos,
        },
      });
    }
  );

  getUserById = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const user = await User.findById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  );

  updateUser = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const updatedTodo = await User.findByIdAndUpdate(
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

  deleteUser = catchAsync(
    async (req: IRequest, res: Response, next: NextFunction) => {
      await User.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );

  // delete me
  // update me
  // update my password
}
