import httpStatus from 'http-status';
import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import helper from './../../helpers';
import { User } from '../../database/models/User';

export class Auth {
  /**
   * controller to sign up the user
   * @param req Request
   * @param res Response
   */
  public async signUp(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, email, password } = req.body;
    await helper.validateNames(req, 'firstName', 'first name');
    await helper.validateNames(req, 'lastName', 'last name');
    await helper.validateEmail(req, 'email');
    await helper.validatePassword(req, 'password');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return helper.getValidationError(res, errors);

    try {
      const users = await User.findOne({ email });

      if (users) {
        return helper.getResponse(res, httpStatus.CONFLICT, {
          message: 'Account with that email address already exists',
        });
      }

      const newUser = new User({
        email,
        firstName,
        lastName,
        password,
        isLoggedIn: false,
        isAdmin: false,
      });

      newUser.save((err, user) => {
        if (err) return helper.getServerError(res, err.message);
        const { _id, email, isAdmin } = user;
        const token = helper.generateToken({ _id, email, isAdmin });

        return helper.getResponse(res, httpStatus.CREATED, {
          token,
          data: user,
        });
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * controller to sign in the user (login)
   * @param req Request
   * @param res Response
   */
  public async signIn(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    await helper.validateEmail(req, 'email');
    await helper.validatePassword(req, 'password');

    const errors = validationResult(req);
    if (!errors.isEmpty()) return helper.getValidationError(res, errors);

    try {
      const userResult = await User.findOne({ email }).select('+password');

      if (!userResult) {
        return helper.getResponse(res, httpStatus.NOT_FOUND, {
          message: 'No user found with the provided email address',
        });
      }

      userResult.comparePassword(password, (_error, isMatch): any => {
        if (!isMatch) {
          return helper.getResponse(res, httpStatus.BAD_REQUEST, {
            message: 'The password you provided is incorrect',
          });
        }

        // update the isLogged field
        User.findOneAndUpdate(
          { email },
          { $set: { isLoggedIn: true } },
          { new: true },
          (err, data: any) => {
            if (err) return helper.getServerError(res, err.message);
            const { _id, email, isAdmin } = data;
            const token = helper.generateToken({ _id, email, isAdmin });
            return helper.getResponse(res, httpStatus.CREATED, { token, data });
          },
        );
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }
}

const auth = new Auth();
export default auth;
