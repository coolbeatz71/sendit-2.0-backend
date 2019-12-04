import { IError } from './../interfaces/error.interface';
import * as httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

// handle not found errors
export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    message: 'Requested Resource Not Found',
    success: false,
  });
  res.end();
};

// handle internal server errors
export const internalServerError = (
  err: IError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err,
  });
  res.end();
};
