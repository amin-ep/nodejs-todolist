import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const developmentError = (err: any, res: Response) => {
  res.status(500).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const productionError = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
      err,
    });
  }
};

export default function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const appMode = process.env.NODE_ENV as string;
  if (appMode === 'development') {
    err = developmentError(err, res);
  } else if (appMode === 'production') {
    err = productionError(err, res);
  }
}
