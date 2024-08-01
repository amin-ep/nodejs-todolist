import HTTPError from '../../utils/httpError.js';
import User from '../../models/User.js';
import { loginValidator, signupValidator, } from '../../validators/authValidator.js';
import catchAsync from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/sendEmail.js';
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
        const existingUser = await User.findOne({ email: req.body.email });
        if (!existingUser) {
            const user = await User.create(req.body);
            const key = user.generateVerifyCode();
            await user.save({ validateBeforeSave: false });
            const link = `${req.protocol}://${req.get('host')}/api/v1/verifyEmail/${key}`;
            const html = `
          <p>To confirm your email address please click <a href="${link}"></a>
        `;
            await sendEmail({
                email: user.email,
                html: html,
                message: key,
                text: `this is your email verification code: ${key}`,
            }, res, true);
        }
        else if (existingUser &&
            existingUser.verified === false &&
            existingUser.active === true) {
            const key = existingUser.generateVerifyCode();
            await existingUser.save({ validateBeforeSave: false });
            const link = `${req.protocol}://${req.get('host')}/api/v1/verifyEmail/${key}`;
            const html = `
          <p>To confirm your email address please click <a href="${link}"></a>
        `;
            await sendEmail({
                email: existingUser.email,
                html: html,
                message: key,
                text: `this is your email verification code: ${key}`,
            }, res, true);
        }
        else if (existingUser &&
            existingUser.verified === true &&
            existingUser.active === true) {
            return next(new HTTPError('A user exists with this email', 403));
        }
        else if (existingUser &&
            existingUser.verified === true &&
            existingUser.active === false) {
            existingUser.active = true;
            existingUser.verified = false;
            await existingUser.save({ validateBeforeSave: false });
            const key = existingUser.generateVerifyCode();
            await existingUser.save({ validateBeforeSave: false });
            const link = `${req.protocol}://${req.get('host')}/api/v1/verifyEmail/${key}`;
            const html = `
          <p>To confirm your email address please click <a href="${link}"></a>
        `;
            await sendEmail({
                email: existingUser.email,
                html: html,
                message: key,
                text: `this is your email verification code: ${key}`,
            }, res, true);
        }
    });
    verifyEmail = catchAsync(async (req, res, next) => {
        const user = await User.findOne({ verificationCode: req.params.code });
        if (!user) {
            return next(new HTTPError('Invalid verification code', 403));
        }
        user.verified = true;
        user.verificationCode = undefined;
        await user.save({ validateBeforeSave: false });
        const token = this.generateToken(user.id);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user,
            },
        });
    });
    login = catchAsync(async (req, res, next) => {
        const { error } = loginValidator.validate(req.body);
        if (error) {
            return next(new HTTPError(error.message, 400));
        }
        const user = await User.findOne({ email: req.body.email });
        if (user?.verified === false) {
            return next(new HTTPError('This account is not verified yet!', 401));
        }
        if (!user ||
            user.active === false ||
            !user.verifyPassword(req.body.password)) {
            return next(new HTTPError('Incorrect email or password', 400));
        }
        const token = this.generateToken(user.id);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user,
            },
        });
    });
}
export default AuthController;
