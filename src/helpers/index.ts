import mongoose from 'mongoose';
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
   * @param user IJwtPayload
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
   * check if the _id is a valid mongoose objectId
   *
   * @param string _id
   * @return boolean
   * @memberof Helpers
   */
  public isValidId(_id: string): boolean {
    return mongoose.Types.ObjectId.isValid(_id);
  }

  /**
   * Remove keys with undefined or falsy values from a object
   * @param obj object
   */
  public getSanitizedBody(obj: any) {
    Object.keys(obj).forEach(key => {
      if (!obj[key]) delete obj[key];
    });
    return obj;
  }

  /**
   * validate names (firstName or lastName)
   * @param req Request
   * @param field string
   * @param nameType string
   * @returns {void} Promise<void>
   */
  public async validateNames(req: Request, field: string, nameType: string): Promise<void> {
    await this.validateEmpty(req, field, nameType);
    await check(field)
      .trim()
      .matches(/^[a-zA-Z\-\s]+$/)
      .withMessage(`The ${nameType} can only contain alphatic characters`)
      .isLength({ min: 3 })
      .withMessage(`The ${nameType} must be at least 3 characters long`)
      .run(req);
  }

  public isPropInBody(req: Request, field: string) {
    return req.body.hasOwnProperty(field);
  }

  public async validateUpdateParcel(req: Request, field: string): Promise<void> {
    const fieldType = field
      .split(/(?=[A-Z])/)
      .join(' ')
      .toLowerCase();
    if (this.isPropInBody(req, field)) {
      await this.validateEmpty(req, field, fieldType);
    }

    if (this.isPropInBody(req, field) && field === 'weight') {
      await this.validateWeight(req, field);
    }
  }

  /**
   * validate empty fields
   * @param req Request
   * @param field string
   * @param nameType string
   * @returns {void} Promise<void>
   */
  public async validateEmpty(req: Request, field: string, nameType: string): Promise<void> {
    await check(field)
      .trim()
      .not()
      .isEmpty()
      .withMessage(`The ${nameType} cannot be empty`)
      .run(req);
  }

  /**
   * validate the parcel weight field
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  public async validateWeight(req: Request, field: string): Promise<void> {
    await this.validateEmpty(req, field, 'weight');
    await check(field)
      .trim()
      .isNumeric()
      .withMessage('The parcel weight must be a number')
      .run(req);
  }

  /**
   * validate password
   * @param req Request
   * @param field string
   * @returns {void} Promise<void>
   */
  public async validatePassword(req: Request, field: string): Promise<void> {
    await this.validateEmpty(req, field, 'password');
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
   * @returns {void} Promise<void>
   */
  public async validateEmail(req: Request, field: string): Promise<void> {
    await check(field)
      .trim()
      .not()
      .isEmpty()
      .withMessage('The email address cannot be empty')
      .run(req);

    await check(field)
      .trim()
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
   * get the parcel price from its weight
   * @param number weight
   * @return number
   */
  public getParcelPrice(weight: number): number {
    const unitPrice: number = 500;
    return weight * unitPrice;
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
