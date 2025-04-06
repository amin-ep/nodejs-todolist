import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/IUser.js';

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  if (typeof this.password === 'string') {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.verifyPassword = async function (inputPassword: string) {
  const result = await bcrypt.compare(inputPassword, this.password);
  return result;
};

export default mongoose.model('User', userSchema);
