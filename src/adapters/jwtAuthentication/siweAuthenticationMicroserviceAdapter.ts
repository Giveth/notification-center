import axios from 'axios';
import { JwtAuthenticationInterface } from './JwtAuthenticationInterface';
import { logger } from '../../utils/logger';
const authorizationRoute = process.env
  .AUTH_MICROSERVICE_AUTHORIZATION_URL as string;

export class SiweAuthenticationMicroserviceAdapter
  implements JwtAuthenticationInterface
{
  async verifyJwt(token: string): Promise<string> {
    try {
      const result = await axios.post(
        authorizationRoute,
        {
          jwt: token,
        },
        {
          headers: { 'Content-Type': `application/json` },
        },
      );

      return result.data.publicAddress.toLowerCase();
    } catch (e) {
      logger.error('SiweAuthenticationMicroserviceAdapter.verifyJwt error', {
        token,
        e,
      });
      throw e;
    }
  }
}
