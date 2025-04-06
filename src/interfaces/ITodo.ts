import { Document, Types } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  user: Types.ObjectId;
  slug: string;
}
