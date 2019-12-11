import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from 'dotenv';
import helper from './../../helpers';
import { User } from '../../database/models/User';
import { JWT_ENCRYPTION } from '../../database/config';

config();

/**
 * function to verify the token from the header
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns boolean
 */
const verifyToken = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return helper.getResponse(res, httpStatus.UNAUTHORIZED, {
      message: 'Authorization is missing',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const jwtPayload: any = jwt.verify(token, JWT_ENCRYPTION);
    const result: any = await User.findOne({ _id: jwtPayload._id });

    if (!result.isLoggedIn) {
      return helper.getResponse(res, httpStatus.FORBIDDEN, {
        message: 'You need to first log in',
      });
    }
    req.user = jwtPayload;

    // get the isAdmin value
    const { isAdmin }: any = req.user;
    return isAdmin;
  } catch (error) {
    return helper.getServerError(res, { message: error.message });
  }
};

/**
 * Middleware to verify admin access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
const admin = async (req: Request, res: Response, next: NextFunction) => {
  const isAdmin = await verifyToken(req, res);

  // authorize if the isAdmin is true
  if (isAdmin) return next();
  return helper.getResponse(res, httpStatus.FORBIDDEN, {
    message: 'Access forbidden: only authenticated admin is authorized',
  });
};

/**
 * Middleware to verify user access
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
const user = async (req: Request, res: Response, next: NextFunction) => {
  const isAdmin = await verifyToken(req, res);

  // authorize if the isAdmin is false
  if (!isAdmin) return next();
  return helper.getResponse(res, httpStatus.FORBIDDEN, {
    message: 'Access forbidden: only authenticated user is authorized',
  });
};

export default { user, admin };
