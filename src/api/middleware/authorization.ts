import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from 'dotenv';
import helper from './../../helpers';
import { User, UserDocument } from '../../database/models/User';
import { JWT_ENCRYPTION } from '../../database/config';

config();

/**
 * function to verify the token from the header
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns boolean
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const { authorization } = req.headers;
  if (!authorization) {
    return helper.getResponse(res, httpStatus.UNAUTHORIZED, {
      message: 'Authorization is missing',
    });
  }

  const token: string = authorization.split(' ')[1];

  try {
    const jwtPayload: any = jwt.verify(token, JWT_ENCRYPTION);
    User.findOne({ _id: jwtPayload._id }, (err, result: UserDocument): any => {
      if (err) return helper.getServerError(res, err.message);
      if (!result) {
        return helper.getResponse(res, httpStatus.UNAUTHORIZED, {
          message: 'The token appears to be invalid or expired',
        });
      }
      if (!result.isLoggedIn) {
        return helper.getResponse(res, httpStatus.FORBIDDEN, {
          message: 'You need to first log in',
        });
      }

      req.user = jwtPayload;
      next();
    });
  } catch (error) {
    const message = 'The token appears to be invalid or expired';
    return helper.getResponse(res, httpStatus.UNAUTHORIZED, { message });
  }
};

/**
 * Middleware to verify admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
export const admin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    const { isAdmin }: any = req.user;

    // authorize if the isAdmin is true
    if (isAdmin) return next();
    return helper.getResponse(res, httpStatus.FORBIDDEN, {
      message: 'Access forbidden: only authenticated admin is authorized',
    });
  });
};

/**
 * Middleware to verify user access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
export const user = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    const { isAdmin }: any = req.user;

    // authorize if the isAdmin is false
    if (!isAdmin) return next();
    return helper.getResponse(res, httpStatus.FORBIDDEN, {
      message: 'Access forbidden: only authenticated user is authorized',
    });
  });
};
