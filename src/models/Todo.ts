import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
const todoSchema = new Schema(
  {
    title: String,
    completed: Boolean,
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
