import { Request, Response, NextFunction } from 'express';
import HTTPError from '../../utils/httpError.js';
import User from '../../models/User.js';
import {
  loginValidator,
  signupValidator,
} from '../../validators/authValidator.js';
import catchAsync from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/sendEmail.js';

class AuthController {
  generateToken(id: string) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
    return token;
  }

  signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // check input data
      const { error } = signupValidator.validate(req.body);

      if (error) {
        return next(new HTTPError(error.message as string, 400));
      }
      // check user exists or not
      const existingUser = await User.findOne({ email: req.body.email });
      // if user does not exists create new account
      if (!existingUser) {
        const user = await User.create(req.body);
        const key = user.generateVerifyCode();
        await user.save({ validateBeforeSave: false });
        const link = `${req.protocol}://${req.get(
          'host'
        )}/api/v1/verifyEmail/${key}`;
        const html = `
          <p>To confirm your email address please click <a href="${link}"></a>
        `;

        await sendEmail(
          {
            email: user.email,
            html: html,
            message: key,
            text: `this is your email verification code: ${key}`,
          },
          res,
          true
        );
      } else if (
        existingUser &&
        existingUser.verified === false &&
        existingUser.active === true
      ) {
        // if user exists with email and not verified send smtp email
        const key = existingUser.generateVerifyCode();
        await existingUser.save({ validateBeforeSave: false });
        const link = `${req.protocol}://${req.get(
          'host'
        )}/api/v1/verifyEmail/${key}`;
        const html = `
          <p>To confirm your email address please click <a href="${link}"></a>
        `;

        await sendEmail(
          {
            email: existingUser.email,
            html: html,
            message: key,
            text: `this is your email verification code: ${key}`,
          },
          res,
          true
        );
      } else if (
        existingUser &&
        existingUser.verified === true &&
        existingUser.active === true
      ) {
        // if user exists and verified send error
        return next(new HTTPError('A user exists with this email', 403));
      } else if (
        existingUser &&
        existingUser.verified === true &&
        existingUser.active === false
      ) {
        // active user and send email if user exists but is not active
        existingUser.active = true;
        existingUser.verified = false;
        await existingUser.save({ validateBeforeSave: false });
        // send email

        const key = existingUser.generateVerifyCode();
        await existingUser.save({ validateBeforeSave: false });
        const link = `${req.protocol}://${req.get(
          'host'
        )}/api/v1/verifyEmail/${key}`;
        const html = `
          <p>To confirm your email address please click <a href="${link}"></a>
        `;

        await sendEmail(
          {
            email: existingUser.email,
            html: html,
            message: key,
            text: `this is your email verification code: ${key}`,
          },
          res,
          true
        );
      }
    }
  );

  verifyEmail = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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
    }
  );

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // send error if input data is invalid
      const { error } = loginValidator.validate(req.body);

      if (error) {
        return next(new HTTPError(error.message, 400));
      }
      // send error if input email or password is incorrect
      const user = await User.findOne({ email: req.body.email });

      if (user?.verified === false) {
        return next(new HTTPError('This account is not verified yet!', 401));
      }

      if (
        !user ||
        user.active === false ||
        !user.verifyPassword(req.body.password)
      ) {
        return next(new HTTPError('Incorrect email or password', 400));
      }
      // generate token
      const token = this.generateToken(user.id as string);
      // log in user and generate token
      res.status(200).json({
        status: 'success',
        token,
        data: {
          user,
        },
      });
    }
  );
}

export default AuthController;
