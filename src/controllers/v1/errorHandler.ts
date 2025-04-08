import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import HTTPError from '../../utils/httpError.js';
import mongoose from 'mongoose';
import { MongoError } from 'mongodb';

config({ path: '../config.env' });

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  errors?: {
    [key: string]: { message: string };
  };
  path?: string;
  value?: any;
  errmsg?: string;
}

const sendErrorForDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorForProd = (err: CustomError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid data sent: ${errors.join(', ')}`;
  return new HTTPError(message, 400);
};

const handleCastError = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new HTTPError(message, 404);
};

const handleDuplicateFieldError = (err: MongoError) => {
  const values = err.message.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field: ${values}. Please use another value!`;
  return new HTTPError(message, 400);
};

const handleJWTError = () => new HTTPError('Invalid token', 401);

const handleJWTExpiredError = () =>
  new HTTPError('The token has expired, please login again!', 401);

export default function globalErrorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const env = process.env.NODE_ENV;

  if (env === 'development') {
    sendErrorForDev(err, res);
  } else if (env === 'production' || env === 'test') {
    if (err.name === 'ValidationError')
      err = handleValidationError(err as mongoose.Error.ValidationError);
    if (err.name === 'CastError')
      err = handleCastError(err as mongoose.Error.CastError);
    if ((err as MongoError).code === 11000)
      err = handleDuplicateFieldError(err as MongoError);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
    if (err.statusCode === 429) {
      return next(
        new HTTPError(
          'Too many requests from this IP, Please try again in an hour!',
          429
        )
      );
    }
    sendErrorForProd(err, res);
  }
}
