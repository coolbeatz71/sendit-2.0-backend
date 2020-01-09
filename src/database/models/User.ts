import bcrypt from 'bcrypt';
import mongoose, { Document, Schema, Error } from 'mongoose';

export type UserDocument = Document & {
  email: string;
  firstName: string;
  lastName: string;
  password: string;

  provider: string;

  // for facebook login
  profile: {
    name: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
  };

  isLoggedIn: boolean;
  isAdmin: boolean;

  comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (
  candidatePassword: string,
  callback: (err: any, isMatch: boolean) => {},
) => void;

const userSchema = new Schema(
  {
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    password: { type: String, select: false },

    provider: String,

    profile: {
      name: String,
      gender: String,
      location: String,
      website: String,
      picture: String,
    },

    isLoggedIn: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (hashErr: Error, hash: string) => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      next();
    });
  });
});

userSchema.set('toJSON', {
  transform(_doc, ret, _opt) {
    delete ret['password'];
    return ret;
  },
});

/**
 * @param candidatePassword password to compare
 *
 * @param cb
 * @returns void
 */
const comparePassword: comparePasswordFunction = function(this: any, candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>('User', userSchema, 'users');
