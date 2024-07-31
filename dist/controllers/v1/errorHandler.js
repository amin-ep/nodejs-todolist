const developmentError = (err, res) => {
    res.status(500).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        err,
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
            message: 'something went wrong!',
            err,
        });
    }
};
export default function (err, req, res, next) {
    const appMode = process.env.NODE_ENV;
    if (appMode === 'development') {
        err = developmentError(err, res);
    }
    else if (appMode === 'production') {
        err = productionError(err, res);
    }
}
