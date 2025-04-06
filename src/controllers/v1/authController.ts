import { Request, Response, NextFunction } from 'express';
import HTTPError from '../../utils/httpError.js';
import User from '../../models/User.js';
import {
  loginValidator,
  signupValidator,
} from '../../validators/authValidator.js';
import catchAsync from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

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
      const existingUser = await User.findOne({ email: req.body.username });
      // if user does not exists create new account
      if (!existingUser) {
        const user = await User.create(req.body);
        await user.save({ validateBeforeSave: false });
        const token = this.generateToken(user._id as string);
        res.status(200).json({
          status: 'success',
          token: token,
          data: user,
        });
      } else if (existingUser) {
        // if user exists with email and not verified send smtp email

        return next(
          new HTTPError(
            'this username has been saved. Please choose another username!',
            403
          )
        );
      }
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
      const user = await User.findOne({ email: req.body.username });

      if (!user || !(await user.verifyPassword(req.body.password))) {
        return next(new HTTPError('Incorrect email or password', 400));
      }
      // generate token
      const token = this.generateToken(user.id as string);
      // log in user and generate token
      res.status(200).json({
        status: 'success',
        token,
        data: user,
      });
    }
  );
}

export default AuthController;
