import catchAsync from '../utils/catchAsync.js';
import HTTPError from '../utils/httpError.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = catchAsync(async (req, res, next) => {
    let token = '';
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }
    if (!token) {
        return next(new HTTPError("You're not logged in. please login first!", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new HTTPError('the user does not exists', 404));
    }
    req.user = user.id;
    next();
});
export const checkBodyValidation = (validator) => {
    return (req, res, next) => {
        const { error } = validator.validate(req.body);
        if (error) {
            return next(new HTTPError(error.message, 400));
        }
        next();
    };
};
