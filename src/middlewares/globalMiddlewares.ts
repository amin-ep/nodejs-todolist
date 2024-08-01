import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.js';
import HTTPError from '../utils/httpError.js';
import { IRequest } from '../interfaces/IRequest.js';
import jwt from 'jsonwebtoken';
import { ObjectSchema } from 'joi';
import User from '../models/User.js';

export const protect = catchAsync(
  async (req: IRequest, res: Response, next: NextFunction) => {
    let token: string = '';
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new HTTPError("You're not logged in. please login first!", 401)
      );
    }

    // @ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new HTTPError('the user does not exists', 404));
    }

    req.user = user.id;
    next();
  }
);

export const checkBodyValidation = (validator: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = validator.validate(req.body);

    if (error) {
      return next(new HTTPError(error.message as string, 400));
    }
    next();
  };
};
