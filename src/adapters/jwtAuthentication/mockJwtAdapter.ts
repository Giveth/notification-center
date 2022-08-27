import { JwtAuthenticationInterface } from './JwtAuthenticationInterface';
import { decode, JwtPayload } from 'jsonwebtoken';
import { errorMessages } from '../../utils/errorMessages';
import { logger } from '../../utils/logger';

export class MockJwtAdapter implements JwtAuthenticationInterface {
  verifyJwt(token: string): Promise<string> {
    try {
      const decodedJwt = decode(token) as JwtPayload;
      if (!decodedJwt.publicAddress) {
        throw new Error(errorMessages.UN_AUTHORIZED);
      }
      return decodedJwt.publicAddress.toLowerCase();
    } catch (e: any) {
      logger.error('MockJwtAdapter.verifyJwt() error', { token, e });
      throw e;
    }
  }
}
