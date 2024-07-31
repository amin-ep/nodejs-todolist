import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserDocument } from '../interfaces/IUser';
import { v4 as uuid } from 'uuid';
const userSchema: Schema<IUserDocument> = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: String,
    password: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },

    verificationCode: String,
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

userSchema.methods.generateVerifyCode = function () {
  if (typeof this.verificationCode === 'string') {
    this.verificationCode = uuid();
  }

  return this.verificationCode;
};

export default mongoose.model('User', userSchema);
