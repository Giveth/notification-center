import { logger } from '../../utils/logger';
import { OrttoAdapterInterface } from './orttoAdapterInterface';

export class OrttoMockAdapter implements OrttoAdapterInterface {
  async callOrttoActivity(data: any, microService: string): Promise<boolean> {
    logger.debug('OrttoMockAdapter has been called', data, microService);
    return true;
  }
}
