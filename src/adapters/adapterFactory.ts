import { SiweAuthenticationMicroserviceAdapter } from './jwtAuthentication/siweAuthenticationMicroserviceAdapter';
import { MockJwtAdapter } from './jwtAuthentication/mockJwtAdapter';
import { errorMessages } from '../utils/errorMessages';
import { OrttoAdapter } from './emailAdapter/orttoAdapter';
import { OrttoMockAdapter } from './emailAdapter/orttoMockAdapter';

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

const orttoEmailAdapter = new OrttoAdapter();
const emailMockAdapter = new OrttoMockAdapter();
export const getEmailAdapter = () => {
  switch (process.env.EMAIL_ADAPTER) {
    case 'ortto':
      return orttoEmailAdapter;
    case 'mock':
      return emailMockAdapter;
    default:
      throw new Error(errorMessages.SPECIFY_Email_ADAPTER);
  }
};
