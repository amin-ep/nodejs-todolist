import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import User from '../../models/User.js';

export default class UserController {
  getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await User.find();

      res.status(200).json({
        status: 'success',
        data: users,
      });
    }
  );

  getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: user,
      });
    }
  );

  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnOriginal: false,
        }
      );

      res.status(200).json({
        status: 'success',
        data: updatedUser,
      });
    }
  );

  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await User.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}
