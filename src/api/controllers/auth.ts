import httpStatus from 'http-status';
import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import helper from './../../helpers';
import { User } from '../../database/models/User';
import { IUser } from '../../interfaces/models.interface';

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

      const userObj: IUser = {
        email,
        firstName,
        lastName,
        password,
        isLoggedIn: true,
        isAdmin: false,
      };

      const newUser = new User(userObj);
      newUser.save((_err: Error, user: any) => {
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
        User.findOneAndUpdate({ email }, { isLoggedIn: true }, { new: true }, (_err, data: any) => {
          const { _id, email, isAdmin } = data;
          const token = helper.generateToken({ _id, email, isAdmin });
          return helper.getResponse(res, httpStatus.OK, { token, data });
        });
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * controller to login user via (facebook and google)
   * @param req Request
   * @param res Response
   */
  public async socialLogin(req: Request, res: Response): Promise<any> {
    try {
      const { provider, image, email, name } = req.body;

      await helper.validateEmpty(req, 'image', 'image url');
      await helper.validateEmpty(req, 'name', 'username');
      await helper.validateNames(req, 'provider', 'provider');
      await helper.validateEmail(req, 'email');

      const errors = validationResult(req);
      if (!errors.isEmpty()) return helper.getValidationError(res, errors);

      const profile = {
        email,
        image,
        username: name.toLowerCase(),
      };

      User.findOneAndUpdate(
        { 'profile.username': profile.username, 'profile.email': profile.email },
        { provider, profile, isLoggedIn: true, isAdmin: false },
        { new: true, upsert: true },
        (_err, data: any) => {
          const { _id, profile, isAdmin } = data;
          const { email } = profile;
          const token = helper.generateToken({ _id, email, isAdmin });
          return helper.getResponse(res, httpStatus.CREATED, { token, data });
        },
      );
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * get user token info for page authorization
   * @param req Request
   * @param res Response
   */
  public async getUser(req: Request, res: Response): Promise<any> {
    let token: string;
    try {
      const { _id }: any = req.user;

      User.findOne({ _id }, (_err, data: any) => {
        const { _id, email, provider, profile, isAdmin } = data;

        if (provider) {
          const { email } = profile;
          token = helper.generateToken({ _id, email, isAdmin });
        }

        token = helper.generateToken({ _id, email, isAdmin });
        return helper.getResponse(res, httpStatus.OK, { token, data });
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }

  /**
   * controller for signing out
   * @param req Request
   * @param res Response
   */
  public async signOut(req: Request, res: Response): Promise<any> {
    try {
      const { _id }: any = req.user;
      User.findOneAndUpdate({ _id }, { isLoggedIn: false }, (_err, _data: any) => {
        return helper.getResponse(res, httpStatus.OK, {
          message: 'User successfully signs out',
        });
      });
    } catch (error) {
      return helper.getServerError(res, error.message);
    }
  }
}

const authCtrl = new Auth();
export default authCtrl;
