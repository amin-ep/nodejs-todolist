import { config } from 'dotenv';
config({ path: '.env' });
const developmentError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err,
        stack: err.stack,
    });
};
const productionError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: 'something went wrong',
            err,
        });
    }
};
export default function (err, req, res, next) {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    const appMode = process.env.NODE_ENV;
    if (appMode === 'development') {
        developmentError(err, res);
    }
    else {
        productionError(err, res);
    }
}
