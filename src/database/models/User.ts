import bcrypt from 'bcrypt';
import crypto from 'crypto';
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
  gravatar: (size: number) => string;
};

type comparePasswordFunction = (
  candidatePassword: string,
  callback: (err: any, isMatch: any) => {},
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
      default: false,
    },
  },
  { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (hashErr: Error, hash: string) => {
      if (hashErr) {
        return next(hashErr);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.set('toJSON', {
  transform(_doc, ret, _opt) {
    // tslint:disable-next-line: no-string-literal
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

/**
 * Helper method for getting user's gravatar.
 *
 * @param size
 * @returns string
 */
userSchema.methods.gravatar = function(size: number = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>('User', userSchema, 'users');
