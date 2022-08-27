import { SiweAuthenticationMicroserviceAdapter } from './jwtAuthentication/siweAuthenticationMicroserviceAdapter';
import { MockJwtAdapter } from './jwtAuthentication/mockJwtAdapter';
import { errorMessages } from '../utils/errorMessages';

const siweAuthenricationAdapter = new SiweAuthenticationMicroserviceAdapter();
const jwtMockAdapter = new MockJwtAdapter();

export const getJwtAuthenticationAdapter = () => {
  switch (process.env.JWT_AUTHORIZATION_ADAPTER) {
    case 'siweMicroservice':
      return siweAuthenricationAdapter;
    case 'mock':
      return jwtMockAdapter;
    default:
      throw new Error(errorMessages.SPECIFY_JWT_AUTHENTICATION_ADAPTER);
  }
};
