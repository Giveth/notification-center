import { ErrorRequestHandler } from 'express';
import { StandardError } from '../types/StandardError';
import { errorMessagesEnum } from '../utils/errorMessages';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  _next,
) => {
  logger.error('errorHandler ', {
    error,
  });
  const httpStatus =
    error instanceof StandardError ? (error.httpStatusCode as number) : 500;
  res.status(httpStatus);
  const errorBody: any =
    error instanceof StandardError
      ? error
      : new StandardError(errorMessagesEnum.INTERNAL_SERVER_ERROR);

  errorBody.trackId = res.locals.trackId;
  res.send(errorBody);
};

export const throwErrorIfInstanceOfStandardError = (e: Error) => {
  if (e instanceof StandardError) {
    throw e;
  }
};
