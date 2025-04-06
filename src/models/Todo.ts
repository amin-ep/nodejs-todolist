import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { ITodo } from '../interfaces/ITodo.js';

const todoSchema: Schema<ITodo> = new Schema(
  {
    title: String,
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    slug: String,
  },
  {
    timestamps: true,
  }
);

todoSchema.pre('save', function (next) {
  if (typeof this.title === 'string') {
    this.slug = slugify(this.title, {
      lower: true,
      trim: true,
    });
  }
  next();
});

export default mongoose.model('Todo', todoSchema);
