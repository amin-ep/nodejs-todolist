import { Model, Schema, Document } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  verified: boolean;
  active: boolean;
  verificationCode: string | undefined;
}

export interface IUserDocument extends IUser, Document {
  verifyPassword: (password: string) => Promise<void>;
  generateVerifyCode: () => string;
}
