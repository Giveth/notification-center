import express, { Request, Response } from 'express';
import { updateSuccessLog } from '../repositories/logRepository';
import { logger } from './logger';



export const sendStandardResponse = (
  data: {
    res: Response;
    result: any;
  },
  httpStatusCode = 200,
) => {
  const { res, result } = data;
  const trackId = res.locals.trackId;
  updateSuccessLog({
    trackId,
    result: JSON.stringify(result),
    statusCode: httpStatusCode,
  });
  res.status(httpStatusCode).json({result,trackId});
};
