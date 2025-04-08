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
      trim: true,
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
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.verifyPassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
