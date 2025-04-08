import { config } from 'dotenv';
import HTTPError from '../../utils/httpError.js';
config({ path: '../config.env' });
const sendErrorForDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        err,
        stack: err.stack,
    });
};
const sendErrorForProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid data sent: ${errors.join(', ')}`;
    return new HTTPError(message, 400);
};
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new HTTPError(message, 404);
};
const handleDuplicateFieldError = (err) => {
    const values = err.message.match(/(["'])(\\?.)*?\1/)?.[0];
    const message = `Duplicate field: ${values}. Please use another value!`;
    return new HTTPError(message, 400);
};
const handleJWTError = () => new HTTPError('Invalid token', 401);
const handleJWTExpiredError = () => new HTTPError('The token has expired, please login again!', 401);
export default function globalErrorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const env = process.env.NODE_ENV;
    if (env === 'development') {
        sendErrorForDev(err, res);
    }
    else if (env === 'production' || env === 'test') {
        if (err.name === 'ValidationError')
            err = handleValidationError(err);
        if (err.name === 'CastError')
            err = handleCastError(err);
        if (err.code === 11000)
            err = handleDuplicateFieldError(err);
        if (err.name === 'JsonWebTokenError')
            err = handleJWTError();
        if (err.name === 'TokenExpiredError')
            err = handleJWTExpiredError();
        if (err.statusCode === 429) {
            return next(new HTTPError('Too many requests from this IP, Please try again in an hour!', 429));
        }
        sendErrorForProd(err, res);
    }
}
