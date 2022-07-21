import { Response } from 'express';

export const sendStandardResponse = (
  data: {
    res: Response;
    result: any;
  },
  httpStatusCode = 200,
) => {
  const { res, result } = data;
  const trackId = res?.locals?.trackId;
  res.status(httpStatusCode).json({ result, trackId });
};
