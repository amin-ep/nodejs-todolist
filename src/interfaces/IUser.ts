import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  password: string;
  role: string;
  verificationCode: string | undefined;
  verifyPassword: (password: string) => Promise<boolean>;
}
