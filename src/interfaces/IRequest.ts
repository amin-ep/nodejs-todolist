import { Request } from 'express';
import { IUser, IUserDocument } from './IUser.js';

export interface IRequest extends Request {
  user: IUserDocument;
}
