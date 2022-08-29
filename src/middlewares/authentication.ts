import { NextFunction, Request, Response } from 'express';
import {
  decodeBasicAuthentication,
  decodeMicroServiceToken,
} from '../utils/authorizationUtils';
import { StandardError } from '../types/StandardError';
import { errorMessages, errorMessagesEnum } from '../utils/errorMessages';
import { MICRO_SERVICES } from '../utils/utils';
import axios from 'axios';
import { createNewUserAddressIfNotExists } from '../repositories/userAddressRepository';
import { logger } from '../utils/logger';
import { findThirdPartyBySecret } from '../repositories/thirdPartyRepository';
import { getJwtAuthenticationAdapter } from '../adapters/adapterFactory';

export const authenticateThirdPartyServiceToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers['authorization'] as string;
    if (!authorization) {
      throw new StandardError(errorMessagesEnum.UNAUTHORIZED);
    }
    const { username, secret } = decodeBasicAuthentication(authorization);
    const serviceEntity = await findThirdPartyBySecret({
      username,
      secret,
    });

    if (!serviceEntity) {
      throw new StandardError(errorMessagesEnum.UNAUTHORIZED);
    }

    res.locals.microService = serviceEntity.microService;
    next();
  } catch (e) {
    logger.error('authenticateThirdPartyBasicAuth error', e);
    res.status(401).send({ message: errorMessages.UN_AUTHORIZED });

    // next(e);
  }
};

export const validateAuthMicroserviceJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization as string;
  try {
    const token = authorizationHeader.split(' ')[1].toString();
    const walletAddress = await getJwtAuthenticationAdapter().verifyJwt(token);
    res.locals.user = await createNewUserAddressIfNotExists(walletAddress);
    next();
  } catch (e) {
    logger.error('authenticateThirdPartyBasicAuth error', e);
    res.status(401).send({ message: errorMessages.UN_AUTHORIZED });
    // next(e);
  }
};
