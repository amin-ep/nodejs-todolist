import catchAsync from '../utils/catchAsync.js';
import HTTPError from '../utils/httpError.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidObjectId } from 'mongoose';
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
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new HTTPError('the user does not exists', 404));
    }
    req.user = user;
    next();
});
export const checkBodyValidation = (validator) => {
    return (req, _res, next) => {
        const { error } = validator.validate(req.body);
        if (error) {
            return next(new HTTPError(error.message, 400));
        }
        next();
    };
};
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next('You do not have permission to perform this action!');
        }
        next();
    };
};
export const checkID = (req, res, next, val) => {
    if (!isValidObjectId(val)) {
        console.log(val);
        return next(new HTTPError(`Invalid ID:${req.params.id}`, 404));
    }
    next();
};
export const setUserOnBody = async (req, res, next) => {
    if (!req.body.user)
        req.body.user = req.user._id;
    next();
};
