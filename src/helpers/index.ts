import httpStatus from 'http-status';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { check } from 'express-validator';
import { config } from 'dotenv';
import { JWT_ENCRYPTION } from '../database/config';

config();

export interface IJwtPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
}

export interface IResponseBody {
  token?: string;
  message?: any;
  data?: any;
}

export class Helpers {
  /**
   * generate the jwt for a user
   * @param {user} user IJwtPayload
   * @returns string
   */
  public generateToken(user: IJwtPayload): string {
    const { _id, email, isAdmin } = user;
    return this.encryptToken({
      _id,
      email,
      isAdmin,
    });
  }

  /**
   * validate names (firstName or lastName)
   * @param req Request
   * @param field string
   * @param nameType string
   * @returns {void}
   */
  public async validateNames(req: Request, field: string, nameType: string) {
    await check(field)
      .not()
      .isEmpty()
      .withMessage(`The ${nameType} cannot be empty`)
      .run(req);

    await check(field)
      .isAlpha()
      .withMessage(`The ${nameType} can only contain alphatic characters`)
      .isLength({ min: 3 })
      .withMessage(`The ${nameType} must be at least 3 characters long`)
      .run(req);
  }

  /**
   * validate password
   * @param req Request
   * @param field string
   * @returns {void}
   */
  public async validatePassword(req: Request, field: string) {
    await check(field)
      .not()
      .isEmpty()
      .withMessage('The password cannot be empty')
      .run(req);

    await check(field)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
      .withMessage(
        'The password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number',
      )
      .run(req);
  }

  /**
   * validate email address
   * @param req Request
   * @param field string
   * @returns void
   */
  public async validateEmail(req: Request, field: string) {
    await check(field)
      .not()
      .isEmpty()
      .withMessage('The email address cannot be empty')
      .run(req);

    await check(field)
      .isEmail()
      .withMessage('Please enter a valid email address')
      .run(req);
  }

  /**
   * display the validation errors
   * @param res Response
   */
  public getValidationError(res: Response, errors: any): Response | any {
    return helper.getResponse(res, httpStatus.BAD_REQUEST, {
      message: errors.array(),
    });
  }

  /**
   * return the API http response
   * @param res
   * @param body
   * @return Response
   */
  public getResponse(res: Response, status: number, body: IResponseBody): Response {
    return res.status(status).json(body);
  }

  public getServerError(res: Response, error: any) {
    const status = httpStatus.INTERNAL_SERVER_ERROR;
    return this.getResponse(res, status, {
      message: error,
    });
  }

  /**
   * generate the jwt for a user
   * @param {data} data IJwtPayload
   * @returns Promise<string>
   */
  private encryptToken(data: IJwtPayload): string {
    const token = jwt.sign(data, JWT_ENCRYPTION, { expiresIn: '3d' });
    return token;
  }
}

const helper = new Helpers();
export default helper;
