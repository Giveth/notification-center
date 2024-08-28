import { decode, JwtPayload } from 'jsonwebtoken';
import { JwtAuthenticationInterface } from './JwtAuthenticationInterface';
import { errorMessages } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';
import { StandardError } from '../../types/StandardError';

export class MockJwtAdapter implements JwtAuthenticationInterface {
  verifyJwt(token: string): Promise<string> {
    try {
      const decodedJwt = decode(token) as JwtPayload;
      if (!decodedJwt.publicAddress) {
        throw new StandardError({
          message: errorMessages.UN_AUTHORIZED,
          httpStatusCode: 401,
        });
      }
      return decodedJwt.publicAddress.toLowerCase();
    } catch (e: any) {
      logger.error('MockJwtAdapter.verifyJwt() error', { token, e });
      throw e;
    }
  }
}
