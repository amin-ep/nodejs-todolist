import { ObjectId } from 'mongoose';

export interface ITodo {
  title: string;
  completed: boolean;
  user: ObjectId;
  slug: string;
}
