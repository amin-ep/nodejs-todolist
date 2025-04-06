import HTTPError from '../../utils/httpError.js';
import User from '../../models/User.js';
import { loginValidator, signupValidator, } from '../../validators/authValidator.js';
import catchAsync from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
class AuthController {
    generateToken(id) {
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return token;
    }
    signup = catchAsync(async (req, res, next) => {
        const { error } = signupValidator.validate(req.body);
        if (error) {
            return next(new HTTPError(error.message, 400));
        }
        const existingUser = await User.findOne({ email: req.body.username });
        if (!existingUser) {
            const user = await User.create(req.body);
            await user.save({ validateBeforeSave: false });
            const token = this.generateToken(user._id);
            res.status(200).json({
                status: 'success',
                token: token,
                data: user,
            });
        }
        else if (existingUser) {
            return next(new HTTPError('this username has been saved. Please choose another username!', 403));
        }
    });
    login = catchAsync(async (req, res, next) => {
        const { error } = loginValidator.validate(req.body);
        if (error) {
            return next(new HTTPError(error.message, 400));
        }
        const user = await User.findOne({ email: req.body.username });
        if (!user || !(await user.verifyPassword(req.body.password))) {
            return next(new HTTPError('Incorrect email or password', 400));
        }
        const token = this.generateToken(user.id);
        res.status(200).json({
            status: 'success',
            token,
            data: user,
        });
    });
}
export default AuthController;
